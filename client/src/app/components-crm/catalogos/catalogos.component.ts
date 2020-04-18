import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit {

  private catalogue:string=" "
  private file:string=" "
  private ext:string=" "
  private send:boolean=true
  private newFile:any={}
  private catalogos:any;
  private editing:any;

  constructor(private api:DataApiService,private toast:ToastService) { }

  ngOnInit() {
    this.getCat();
  }

  getCat(){
    this.api.get('/Catalogos')
    .subscribe((catalogos)=>{
      this.catalogos=catalogos;
    })
  }

  selectImageOrder( file:any){
    this.file=file.base64File;
    this.ext=file.fileExtention;
    this.newFile=file;
  }

  upload(){
    if(this.ext=='.pdf'){
    if(this.file.length>5 && this.catalogue.length>1){
       let data:any={
         newFile:this.newFile,
         nombre:this.catalogue
       }
        this.api.post('/Catalogos/setFile',data)
        .subscribe((uploaded)=>{
          this.toast.showSuccess("Catalogo subido")
          this.getCat();
        },err=>{
          this.toast.showError("¡Documento muy grande!")
        })
      }
      else{
        this.toast.showError("No se han llenado todos los campos");
      } 
    }
    else{
      this.toast.showError("Debe ser PDF")
    }
  }


  deleteCat(fileId,id){
    
    let data:any={
      id:fileId
    }
    if(confirm("¿Desea eliminar la nota?")){
      this.api.post('/Catalogos/deleteFile',data)
      .subscribe((okay)=>{
        this.api.delete(`/Catalogos/${id}`)
        .subscribe((okay)=>{
          this.getCat();
          this.toast.showSuccess("Eliminado con exito")
        })
      })
    }
  }


  showPdf(id) {
    
    let base:string=this.api.baseURL
    
    const linkSource = base+id;
    const downloadLink = document.createElement("a");
    const fileName = name+'.pdf';

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();

  }

  setEdit(c){
    this.editing=c;
  }

  assign(){
    if(this.catalogue.length>2){
      this.editing.nombre=this.catalogue
      this.api.patch('/Catalogos',this.editing)
        .subscribe((okay)=>{
          this.getCat();
          this.catalogue=" ";
          this.toast.showSuccess("Nombre editado")
        })
    }
    else{
      this.toast.showError("El nombre debe ser mas largo")
    }
  }


}
