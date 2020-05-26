import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ficha-trato',
  templateUrl: './ficha-trato.component.html',
  styleUrls: ['./ficha-trato.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FichaTratoComponent implements OnInit {

  public id:string;
  public trato:any={
    nombre:null,
    descripcion:null,
    tipo:null,
    clienteId:null,
    vendedorId:null,
    estado:0,
    fechaFin:null,
    nota:" " ,
    reporte:" ",
    cliente:{}
  };
  public desc:boolean=true;
  public toUpload:boolean=false;
  public name:string;
  public file:any;
  public defFiles:any=[];
  public noDefFiles:any=[];
  public defButton:boolean=false;

  public clientObj:any={};
  public frecuent:boolean=false;
  datePickerConfig:any;

  public subtarea:any={
    fechaInicio:"",
    fechaFin:"",
    titulo:"",
    descripcion:"",
    estado:0,
    tratoId:"",
    categoriaId:""
  }
  public hoyGuion:any;
  public hoyLocale:any;
  public categorias:any=[];
  public efe:any;

  public sugerencia:any="En base base a lo ultimo que has hecho, tal vez ahora deberías "

  constructor(private activated:ActivatedRoute, private api:DataApiService, 
    private toast:ToastService, private router:Router) { }

  ngOnInit() {
    this.id=this.activated.snapshot.paramMap.get("id");
    this.hoyGuion=FichaTratoComponent.setHoy()
    this.hoyLocale=this.setHoyLocale()
    this.getTrato();
    this.getCategorias();
  }

  private  setHoyLocale():string{//fecha local en formato ISO
    let inicio=this.hoyGuion.split("-")
    let i= new Date(inicio[2], inicio[1]-1, inicio[0]).toISOString();
    return i
  }

  getTrato(){
    this.api.get(`/Tratos/${this.id}/getTrato`)
      .subscribe((trato)=>{
       this.trato=trato
       this.defFiles=[];
       this.noDefFiles=[];
       this.trato.archivos.forEach(archivo => {
         if(archivo.definitive){
          this.defFiles.push(archivo)  
         }
         else{
           this.noDefFiles.push(archivo)
         }
       });
       this.trato.archivos=this.defFiles;

       this.trato.subtareas.forEach(s => {
        if(s.fechaFin<this.hoyLocale && s.estado==0){
          this.setVencida(s)
        }
       });

       let sug=""

       switch(this.setSugerencia().toString()){
         case '1':{
           sug="hacer una llamada de atención al cliente"
           break
         }
         case '2':{
          sug="realizar una visita o reunion"
          break
          }
         case '3':{
          sug="realizar una visita o reunion"
          break
          }
        case '4':{
          sug="diseñar los productos"
          break
          } 
        case '5':{
          sug="cotizar los productos"
          break
          }
        case '6':{
          sug="mandar la documentación"
          break
          }
        case '7':{
          sug="realizar un servicio de instalacion"
          break
          }
        case '8':{
          sug="enviar los los productos al cliente"
          break
          }
        case '9':{
          sug="realizar una llamada de atención para mantenimiento"
          break
          }
        case '10':{
          sug="hacer una llamada de atención al cliente"
          break
          }
        default: {
          sug="realizar una llamada"
          break
        }
       }
       this.sugerencia="En base base a lo ultimo que has hecho, tal vez ahora deberías "

       this.sugerencia+=sug
      })
  }

  setSugerencia():string{
    let sugerenciaId:string="1"
    
    // if((this.trato.subtareas.length-1)!=-1){
    //   let ultima=this.trato.subtareas[this.trato.subtareas.length-1].categoriaId
    //   sugerenciaId=this.revisarAgendadas(ultima)
    // }
    // else{
    //   return "10"
    // }

    this.trato.subtareas.forEach(sub => {
      if(sub.estado==1){
        sugerenciaId=sub.categoriaId+1
      }
    });
    return sugerenciaId 
  }

  revisarAgendadas(u:number){
    if(u==1 || u==2){
      return 3
    }
    if(u==9){
      return 1
    }
    this.trato.subtareas.forEach(s => {
      if(s.categoriaId==u+1){ //si hay agendada la siguiente
        this.revisarAgendadas(u+1)
      }
     });

     return u+1
  }

  setVencida(s){
    s.estado=2;
    this.api.patch('/Subtareas',s).subscribe((okay)=>{})
  }

  assignDesc(trato){
    this.api.patch(`/Tratos`,trato)
      .subscribe((trato)=>{
      })
  }

  assignNota(trato){
    this.trato.reporte=" "
    if(trato.nota!=""){
      trato.estado=0;
      this.api.patch(`/Tratos`,trato)
        .subscribe((trato)=>{
          this.toast.showSuccess("Trato reabierto")
      })     
    }
    else{
     this.toast.showError("La nota está vacia")
    }
  }

  assign(trato, estado){
    if(!this.trato.reporte){
      this.trato.reporte=" "
    }
    let ready=false;
     let mess;
     if(estado){mess='¿Desea cerrar el trato?'}
     else{mess='¿Desea dar por perdido el trato?'}

     if(estado){
       trato.subtareas.forEach(s => {
         if(s.estado==1 && s.categoriaId==5){
           this.api.get(`/Cotizaciones`,true,{where:{subtareaId:s.id}})
           .subscribe((coti:any)=>{
             if (coti[0].definitivo){
               ready=true;
               if(confirm(mess)){
               let fecha=new Date().toISOString();
               trato.fechaFin=fecha;
               if(trato.nota==""){trato.nota=" "}
               if(trato.reporte==""){trato.reporte=" "}
               if(estado){
                 trato.estado=1
                 console.log("programar correo") 
                  //crear registro de encuesta
                  this.api.get('/Cerrados',true,{where:{tratoId:trato.id}}).subscribe((encuestas:any)=>{
                    if(!encuestas.length){
                      let hoy:any=new Date().toLocaleDateString()
                      hoy=hoy.split('/')
                      hoy[1]=Number(hoy[1])
                      if(hoy[1]>=9){
                        hoy[1]=(hoy[1]+4)-12
                        hoy[2]=Number(hoy[2])+1
                      }
                      else{
                        hoy[1]=hoy[1]+4
                      }

                      hoy[1]=hoy[1].toString()

                      if(hoy[0].length<2){
                        hoy[0]='0'+hoy[0]
                      }
                      if(hoy[1].length<2){
                        hoy[1]='0'+hoy[1]
                      }

                      if(hoy[0]=='30' || hoy[0]=='31'){
                        hoy[0]='29'
                      }

                      //fecha actual mas cuatro meses
                      let cerrado={
                        respuesta1:"0",
                        respuesta2:"0",
                        respuesta3:"...",
                        tratoId:trato.id,
                        fechaEnvio:hoy[0]+'-'+hoy[1]+'-'+hoy[2]
                      }
                      console.log("el registro a crear: ",cerrado)
                      this.api.post('/Cerrados',cerrado).subscribe((okay)=>{})
                    }
                })
                }
               else{
                trato.estado=2
               }
                 this.api.patch('/Tratos',trato).subscribe( (edited)=>{
                   this.isFrecuent(trato.clientId)
                   this.getTrato();
                   this.toast.showSuccess("Trato terminado")
                 })
               }
              }
            })
          }
        });
        if(!ready){
          this.toast.showWarning("El trato debe contar con una cotización definitiva terminada")
        }
     }

     else{
      if(confirm(mess)){
        let fecha=new Date().toISOString();
        trato.fechaFin=fecha;
        if(trato.nota==""){trato.nota=" "}
        if(trato.reporte==""){trato.reporte=" "}
        if(estado){trato.estado=1}
        else{
          trato.estado=2
          let data={
            to: trato.cliente.email,
            subject: "Encuesta Trato Perdido",
            html:'Buen día, por parte de COR muebles te invitamos a llenar esta <a href="https://www.w3schools.com">encuesta</a> para mejorar nuestro servicio ¡Gracias!  '
          }
          this.api.post('/Mails/sendPoll',{data:data}).subscribe((okay)=>{
            //crear registro de encuesta
            this.api.get('/Perdidos',true,{where:{tratoId:trato.id}}).subscribe((encuestas:any)=>{
              if(!encuestas.length){
                let perdido={
                  respuesta1:"0",
                  respuesta2:"0",
                  respuesta3:"...",
                  tratoId:trato.id
                }
                this.api.post('/Perdidos',perdido).subscribe((okay)=>{})
              }
            })
          },
            err=>{
              this.toast.showError("No se ha mandado la encuesta de trato perdido porque el email de el cliente no es valido")
            })

            console.log("buscar a ver si notificar")
                  this.api.get('/Tratos',true,{where:{clientId:trato.clientId}})
                  .subscribe((tratos:any)=>{
                    console.log("loas tratos del cliente",trato.clientId,tratos)
                    tratos.forEach(t => {
                      if(t.estado==1){
                        let data={
                          title:"Un cliente con antigüedad ha declinado el trato "+t.nombre,
                          content:`/fichatrato/${t.id}`,
                          timestamp:new Date().toISOString(),
                          seen:false,
                          usuarioId:8 //ID DEL ADMINISTRADOR CAMBIAR
                        }
                        this.api.post(`/Notifications`,data,true)
                          .subscribe((created)=>{ })
                      }
                    });
                  })

        }
          this.api.patch('/Tratos',trato).subscribe( (edited)=>{
            this.isFrecuent(trato.clientId)
            this.getTrato();
          })
        }
     }
  }


   selectImageOrder( file:any){
    this.file=file;
   }

  upload(){
    if(this.file==null || this.name==null || this.name==""){
      this.toast.showError("Datos incompletos")
    }
    else{
      let data:any={
        file:this.file,
        name:this.name,
        tratoId:this.id,
        definitive:false
      }

      this.api.post(`/Tratos/${this.id}/setFile`,data)
        .subscribe((uploaded)=>{
          this.toast.showSuccess("Archivo subido")
          this.getTrato()
          this.show(true)
      },err=>{
          this.toast.showError("Archivo muy grande!")
      })

      this.name=null;
      this.file=null;
      this.toUpload=false;
    }   
  }


  showPdf(id) { 
    let base:string=this.api.baseURL  
    const linkSource = base+id;
    const downloadLink = document.createElement("a");
    const fileName = name;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  setDef(archivo){
    archivo.definitive=!archivo.definitive;
    this.api.patch('/Archivos',archivo)
        .subscribe((uploaded)=>{
          this.toast.showSuccess("¡Archivo movido!")
          this.getTrato();
        },err=>{
          this.toast.showError("¡Error modificando el archivo!")
        })
  }

  show(def){
    if(def){
      this.trato.archivos=this.defFiles;
    }
    else{
      this.trato.archivos=this.noDefFiles;
    }
  }

  async isFrecuent(clientId){
    await this.api.get(`/Clients/${clientId}/getClient`).toPromise().then((client)=>{
     this.clientObj=client;
     let frecuente=0;
     let sixAgo=new Date();
     sixAgo.setDate(sixAgo.getDate()-180);
     this.clientObj.tratos.forEach(trato => {
        if(trato.estado==1){
          if(trato.fechaFin>sixAgo.toISOString()){
            frecuente++;
            if(frecuente>=3){
              this.frecuent=true;
              this.clientObj.frecuente=true;
            }
          }
        }
      });
      if(this.frecuent){
       this.frecuent=false;
       this.api.patch('/Clients',this.clientObj).subscribe((okay)=>{})
     }
   });
  }


  createSub(){
    if(this.subtarea.fechaFin==undefined || !this.subtarea.fechaFin){
      this.toast.showError("Debes ingresar una fecha")
      return
    }
    let inicio=this.hoyGuion.split("-")
    let i= new Date(inicio[2], inicio[1]-1, inicio[0]).toISOString();
    let mesSub=this.subtarea.fechaFin.split("-")[1]
    this.subtarea.fechaInicio=i;
    this.subtarea.tratoId=this.id
    if(this.subtarea.titulo=="" || this.subtarea.fechaFin=="" || this.subtarea.descripcion=="" ||
    this.subtarea.tratoId=="" ||this.subtarea.categoriaId==""){
      this.toast.showError("Debes llenar todos los campos")
      return
    }
    else if(this.subtarea.fechaFin<this.hoyGuion && mesSub<=inicio[1]){
      this.toast.showError("!La fecha límite ya pasó!")
      return
    }
    else{
      let fin=this.subtarea.fechaFin.split("-");
      let f= new Date(fin[2], fin[1] - 1, fin[0]).toISOString();
      this.efe=f;
      this.subtarea.fechaFin=f;
      console.log("sub",this.subtarea.fechaFin)
      if(this.subtarea.categoriaId==5){
        this.api.get(`/Subtareas`,true,{where:{tratoId:this.trato.id,categoriaId:5}})
        .subscribe((subs:any)=>{
          subs.forEach(s => {
            this.api.get(`/Cotizaciones`,true,{where:{subtareaId:s.id}})
            .subscribe((coti:any)=>{
              let cotiz=coti[0]
              cotiz.definitivo=false
              this.api.patch(`/Cotizaciones`,cotiz)
              .subscribe((okay)=>{})
            })
          });
          this.subtarea.fechaFin=this.efe;
          this.api.post('/Subtareas',this.subtarea)
        .subscribe((okay:any)=>{
          if(okay.categoriaId==5){
            let cotizacion:any={
              manoObra:0,
              administrativos:0,
              utilidad:0,
              impuestos:0,
              subtareaId:okay.id,
              definitivo:true,
              total:0
            }  
            this.api.post(`/Cotizaciones`,cotizacion)
            .subscribe((coti)=>{
            })  
          }
          this.subtarea={ fechaInicio:"",
          fechaFin:"",
          titulo:"",
          descripcion:"",
          estado:0,
          tratoId:"",
          categoriaId:""}
          this.getTrato()
          this.toast.showSuccess("Subtarea creada")
        })
        })
      }
      else{
        this.api.post('/Subtareas',this.subtarea)
        .subscribe((okay:any)=>{
          if(okay.categoriaId==5){
            let cotizacion:any={
              manoObra:0,
              administrativos:0,
              utilidad:0,
              impuestos:0,
              subtareaId:okay.id,
              definitivo:true,
              total:0
            }  
            this.api.post(`/Cotizaciones`,cotizacion)
            .subscribe((coti)=>{
            })  
          }
          this.subtarea={ fechaInicio:"",
          fechaFin:"",
          titulo:"",
          descripcion:"",
          estado:0,
          tratoId:"",
          categoriaId:""}
          this.getTrato()
          this.toast.showSuccess("Subtarea creada")
        })
      }
    }
  }

  cleanObject(){
    this.subtarea={ fechaInicio:"",
          fechaFin:"",
          titulo:"",
          descripcion:"",
          estado:0,
          tratoId:"",
          categoriaId:""}
  }

  fechaInput(){
    let inicio=this.hoyGuion.split("-")
    let mesSub=this.subtarea.fechaFin.split("-")[1]

    if(this.subtarea.fechaFin<this.hoyGuion && mesSub<=inicio[1]){
      this.toast.showError("La fecha límite ya pasó")
      this.subtarea.fechFin=""
      return
    }
  }


  private static setHoy():string{ //Obtener hoy en formato con guion (del ddatepicker)
    let hoy;
    hoy=new Date().toLocaleDateString();
    hoy=hoy.split('/');
      if(hoy[0].length<2){
        hoy[0]='0'+hoy[0]
      }
      if(hoy[1].length<2){
        hoy[1]='0'+hoy[1]
      }
    let hoyString=hoy[0]+'-'+hoy[1]+'-'+hoy[2]
    hoy=hoyString
    return hoyString;
  }

  getCategorias(){
    this.api.get('/CategoriaSubs',true)
    .subscribe((categorias)=>{
      this.categorias=categorias
    })  
  }

  gotCoti(sub){
    if(sub.categoriaId==5){this.router.navigate([`/cotizacion/${sub.tratoId}/${sub.id }`])}
  }

}
