import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-ficha-trato',
  templateUrl: './ficha-trato.component.html',
  styleUrls: ['./ficha-trato.component.css']
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
    reporte:" "
  };
  private desc:boolean=true;
  private toUpload:boolean=false;
  private name:string;
  private file:any;
  private defFiles:any=[];
  private noDefFiles:any=[];
  private defButton:boolean=false;

  constructor(private activated:ActivatedRoute, private api:DataApiService, private toast:ToastService) { }

  ngOnInit() {
    this.id=this.activated.snapshot.paramMap.get("id");
    this.getTrato();
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
    let mess
      if(estado){mess='¿Desea cerrar el trato?'}
      else{mess='¿Desea dar por perdido el trato?'    }

      if(confirm(mess)){
      let fecha=new Date().toISOString();
      trato.fechaFin=fecha;

      if(estado){trato.estado=1}
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

}
