import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-tratos',
  templateUrl: './tratos.component.html',
  styleUrls: ['./tratos.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TratosComponent implements OnInit {

  private trato:any={
    nombre:null,
    descripcion:null,
    tipo:null,
    clienteId:null,
    vendedorId:null,
    estado:0,
    fechaFin:null,
    nota:" " ,
    reporte:" "
  }

  private tipos:any=[
    {
      id:1,
      tipo:"Residencial"
    },
    {
      id:2,
      tipo:"Empresarial"
    },
    {
      id:3,
      tipo:"Licitación"
    }  
  ]

  private clients:any;
  private vendedores:any;
  private tratos:any;
  private current:any;
  private fechaInicio:any;
  private fechaFin:any;

  private showAct:boolean=true;
  private full:any;
  private fullA:any;
  private fullI:any;

  private client:number;

  private clientObj:any={};
  private frecuent:boolean=false;

  private disclaimer:any={
    nombre:"",
    show:false,
    id:""
  };

  constructor(private api:DataApiService, 
    private auth:AuthService, private toast:ToastService) { }

  ngOnInit() {
    this.getClients()
    this.getUsers()
    this.current=this.auth.getCurrentUser().realm;
    this.getTratos()
  }

   getTratos(){
    if(this.current=="admin"){
     this.api.get('/Tratos/getTratos',true)
     .subscribe((tratos)=>{
      this.full=tratos;
      if(!this.showAct){
        this.tratos=[]
        this.full.forEach(t => {
          if(t.estado!=0){
            this.tratos.push(t);
              }
            });
          this.fullA=this.tratos;
      }
      else{
        this.tratos=[];
        this.full.forEach(t => {
        if(t.estado==0){
          this.tratos.push(t);
        }
        });
        this.fullI=this.tratos;
      }
        })   
      }

      else{
        let id=this.auth.getCurrentUser().id;
        let data={
          id:id
        }
        this.api.post('/Tratos/getTratosUsuario',{data:data})
        .subscribe((tratos)=>{
          this.full=tratos;
          if(!this.showAct){
            this.tratos=[]
            this.full.forEach(t => {
          if(t.estado!=0){
            this.tratos.push(t);
              }
            });
          this.fullA=this.tratos;
        }
        else{
          this.tratos=[];
          this.full.forEach(t => {
        if(t.estado==0){
          this.tratos.push(t);
        }
        });
        this.fullI=this.tratos;
        }

        this.tratos.forEach(trato => {
          for(let i = 0; i < trato.subtareas.length; i++) {
            for(let j = 0; j < trato.subtareas.length - 1; j++) {
                if(trato.subtareas[j].fechaFin < trato.subtareas[j + 1].fechaFin) {
                    let swap = trato.subtareas[j];
                    trato.subtareas[j] = trato.subtareas[j + 1];
                    trato.subtareas[j + 1] = swap;
                }
            }
          }
          let twoAgo=new Date();
          twoAgo.setDate(twoAgo.getDate()-60);
          if(trato.subtareas[0]){
            if(trato.subtareas[0].fechaFin<twoAgo.toISOString()){
              this.disclaimer.nombre=trato.nombre
              this.disclaimer.show=true
              this.disclaimer.id=trato.id
            }
          }

        });

        })  
      }
  }
      
  onSearchChange(searchValue: string) {  
        let filtered
        if(!this.showAct){
          filtered=this.fullA
        }
        else{
          filtered=this.fullI
        }
        this.tratos=[]
        filtered.forEach(trato => {
        if(trato.nombre.toLowerCase().indexOf(searchValue.toLowerCase())!=-1){
        this.tratos.push(trato);
        }
        });
  }

  filterClient(){
    if(this.client){
      let filtered
        if(!this.showAct){
          filtered=this.fullA
        }
        else{
          filtered=this.fullI
        }
        this.tratos=[]
        filtered.forEach(trato => {
          if(trato.clientId==this.client){
          this.tratos.push(trato);
          }
        });
    }
    else{
      this.getTratos()
    }
  }

  getClients(){
    this.api.get('/Clients',true)
      .subscribe((clients)=>{
        this.clients=clients;
      })
  }

  getUsers(){
    this.api.get('/Usuarios',true,{where:{realm:'user',active:true}})
    .subscribe((usuarios)=>{
      this.vendedores=usuarios;
    })
  }

  /*
    calcular hoy hace 6 meses
    buscar y contar tratos que fechaFin<hoyHace6meses
    si se contaron 3 o mas cliente frecuente
    */ 

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
   
   assign(trato, estado){
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
               console.log("terminable")
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
               else{trato.estado=2}
                 this.api.patch('/Tratos',trato).subscribe( (edited)=>{
                   this.isFrecuent(trato.clientId)
                   this.getTratos();
                   this.toast.showSuccess("Trato terminado")
                 })
               }
              }
            })
          }
        });
        if(!ready){
          this.toast.showWarning("El trato no cuenta con una cotización definitiva terminada")
        }
     }

     else{
      if(confirm(mess)){
        let fecha=new Date().toISOString();
        trato.fechaFin=fecha;
        if(trato.nota==""){trato.nota=" "}
        if(trato.reporte==""){trato.reporte=" "}
        if(estado){trato.estado=1}
        else{trato.estado=2
          let data={
            to: trato.cliente.email,
            subject: "Encuesta Trato Perdido",
            html:'Buen día, por parte de COR muebles te invitamos a llenar esta <a href="https://www.w3schools.com">encuesta</a> para mejorar nuestro servicio ¡Gracias!  '
          }
          this.api.post('/Mails/sendPoll',{data:data}).subscribe((okay)=>{
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
        }
  
          this.api.patch('/Tratos',trato).subscribe( (edited)=>{
            this.isFrecuent(trato.clientId)
            this.getTratos();
          })
        }
     }

  }

  saveTrato(){
    if(this.current=="user"){
      this.trato.vendedorId=this.auth.getCurrentUser().id;
    }
    if(this.trato.nombre==null || this.trato.descripcion==null || this.trato.tipo==null || 
    this.trato.clientId==null || this.trato.vendedorId==null){
      this.toast.showError("No se han llenado todos los campos")
    }
    else{
      this.fechaInicio=new Date().toISOString();
      this.trato.fechaInicio=this.fechaInicio;
      this.trato.fechaFin=this.fechaInicio;
      this.api.post('/Tratos',this.trato).subscribe((okay)=>{
  
        this.toast.showSuccess("Trato creado")
        this.trato={ nombre:null,
        descripcion:null,
        tipo:null,
        clienteId:null,
        vendedorId:null,
        estado:0,
        fechaFin:null,
        nota:" " ,
        reporte:" "};
        this.getTratos()
  
      },err=>{

        this.toast.showError("Error al subir el trato")
        this.trato={ nombre:null,
        descripcion:null,
        tipo:null,
        clienteId:null,
        vendedorId:null,
        estado:0,
        fechaFin:null,
        nota:" " ,
        reporte:" "};
  
      })
    }
  }

}
