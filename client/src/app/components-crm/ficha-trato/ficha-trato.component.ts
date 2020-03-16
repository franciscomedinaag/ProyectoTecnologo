import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-ficha-trato',
  templateUrl: './ficha-trato.component.html',
  styleUrls: ['./ficha-trato.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FichaTratoComponent implements OnInit {

  private id:string;
  private trato:any={
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
  private desc:boolean=true;
  private toUpload:boolean=false;
  private name:string;
  private file:any;
  private defFiles:any=[];
  private noDefFiles:any=[];
  private defButton:boolean=false;

  private clientObj:any={};
  private frecuent:boolean=false;

  private subtarea:any={
    fechaInicio:"",
    fechaFin:"",
    titulo:"",
    descripcion:"",
    estado:0,
    tratoId:"",
    categoriaId:""
  }
  private hoyGuion:any;
  private categorias:any=[];

  constructor(private activated:ActivatedRoute, private api:DataApiService, private toast:ToastService) { }

  ngOnInit() {
    this.id=this.activated.snapshot.paramMap.get("id");
    this.hoyGuion=FichaTratoComponent.setHoy()
    this.getTrato();
    this.getCategorias();
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
      })
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
    let mess
      if(estado){mess='¿Desea cerrar el trato?'}
      else{mess='¿Desea dar por perdido el trato?'}

      if(confirm(mess)){
      let fecha=new Date().toISOString();
      trato.fechaFin=fecha;

      if(estado){
        trato.estado=1
        this.isFrecuent(this.trato.clientId);
      }
      else{trato.estado=2}

      this.api.patch('/Tratos',trato).subscribe((edited)=>{
        this.getTrato();
      })
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
          console.log("Uploaded: ",archivo)
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
     console.log("los tratos", this.clientObj.tratos);
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
       console.log("hacer frecuente al cliente")
       this.api.patch('/Clients',this.clientObj).subscribe((okay)=>{})
     }
     else{
       console.log("no hacerlo frecuente AUN")
     }
   });
  }


  createSub(){
    let inicio=this.hoyGuion.split("-")
    let i= new Date(inicio[2], inicio[1]-1, inicio[0]).toISOString();
    this.subtarea.fechaInicio=i;
    this.subtarea.tratoId=this.id
    if(this.subtarea.titulo=="" || this.subtarea.fechaFin=="" || this.subtarea.descripcion=="" ||
    this.subtarea.tratoId=="" ||this.subtarea.categoriaId==""){
      this.toast.showError("Debes llenar todos los campos")
      return
    }
    else if(this.subtarea.fechaFin<this.hoyGuion){
      this.toast.showError("!La fecha límite ya pasó!")
      return
    }
    else{
      let fin=this.subtarea.fechaFin.split("-");
      let f= new Date(fin[2], fin[1] - 1, fin[0]).toISOString();
      this.subtarea.fechaFin=f;
      this.api.post('/Subtareas',this.subtarea)
      .subscribe((okay)=>{
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

}
