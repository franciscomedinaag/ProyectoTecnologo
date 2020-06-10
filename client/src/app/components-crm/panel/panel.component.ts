import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  public sitioEdit:any={
    numero:0,
    direccion:" ",
    cp:0,
    imagenInicio:" ",
    textoInicio:" ",
    fullInicio:{},
    mision:" ",
    vision:" ",
    compromiso:" ",
    visitas:0
  }
  public sitio:any={}
  public setImg=false
  public carrusel:any={
    titulo:"",
    subtitulo:"",
    imagen:" ",
    fullImagen:null, 
    type:0
  }
  public upload="inicio"
  public carrusels:any
  public inicios:any=[]
  public nosotros:any=[]

  public imageAdv=""
  public static x=0;
  public static y=0;

  constructor( public api:DataApiService, public toast:ToastService){}

  ngOnInit() {
    this.getSitio()
    this.getCar()
  }

  getSitio(){
    this.api.get(`/Sitios`,true)
    .subscribe((sitio:Array<any>)=>{
      this.sitioEdit=sitio[0]         
    })
  }

  setSitio(){
    if(!Number(this.sitioEdit.cp)){
        this.toast.showError("El codigo postal debe ser un numero")
        return
    }
    else{
      if(this.sitioEdit.cp.length>6 || this.sitioEdit.cp.length<5 ){
        this.toast.showError("El codigo postal debe ser de 5 caracteres")
        return
      }
    }

    if(!Number(this.sitioEdit.numero)){
      this.toast.showError("El telefono debe ser un numero")
      return
    }
    else{
      if(this.sitioEdit.numero.length>12 || this.sitioEdit.numero.length<8 ){
        this.toast.showError("El telefono debe ser entre 8 y 12 caracteres")
        return
      }
    }
    this.api.patch(`/Sitios`,this.sitioEdit)
    .subscribe((uploaded:any)=>{
      if(this.setImg){
          this.api.post(`/Sitios/${this.sitioEdit.id}/setInicio`,this.sitioEdit.fullInicio)
          .subscribe((okay)=>{
            this.toast.showSuccess("La información del sitio ya está actualizada")
            this.getSitio()
            this.setImg=false
          })    
      }
      else{
        this.toast.showSuccess("La información del sitio ya está actualizada")
        this.getSitio()
        this.setImg=false
      }
    })
  }

  selectImageOrder( file:any){
    if(this.upload=='inicio'){
      this.sitioEdit.fullInicio=file
      this.setImg=true
    }
    if(this.upload=='carrusel'){
      let x;
      let y;
      this.imageAdv=""
      let im='data:image/'+file.fileExtention.substr(1)+';base64,'+file.base64File;
      let image=new Image;
      image.src=im;
      image.onload=function(){
        x=image.width;
        y=image.height;
        PanelComponent.x=x;
        PanelComponent.y=y;
        console.log("medidas en func: ",PanelComponent.x,"+",PanelComponent.y)
      }

      setTimeout(()=>{
        this.carrusel.fullImagen=file
        this.toast.showInfo("Imagen seleccionada para el carrusel")
        console.log("medidas fuera de func: ",PanelComponent.x,"+",PanelComponent.y)
        if(PanelComponent.y>=PanelComponent.x){
          
          this.imageAdv="Por las dimensiones de la imagen, esta podría alterarse en a vista final"
        }
        if((PanelComponent.y*2.5)<PanelComponent.x){
         
          this.imageAdv="La imagen es demasiado larga, podría a alterarse en la vista final"
        }
        if((PanelComponent.y*1.5)>PanelComponent.x){
          
          this.imageAdv="La imagen es demasiado corta, podría a alterarse en la vista final"
        }
      }, 1000);
     
    }
  }



  createCar(){
    if(this.carrusel.fullImagen==null){
      this.toast.showError("No se ha seleccionado ninguna imagen")
      return
    }
    if(this.carrusel.titulo == "" || this.carrusel.subtitulo == ""){
      this.toast.showError("Debes ingresar titulo y subtitulo")
      return
    }
    this.api.post(`/Carrusels`, this.carrusel)
    .subscribe((okay:any)=>{
      this.api.post(`/Carrusels/${okay.id}/setCarrusel`,this.carrusel.fullImagen)
        .subscribe((okay)=>{
          this.toast.showSuccess("Imagen subida")
          this.carrusel={titulo:"",
          subtitulo:"",
          imagen:" ",
          fullImagen:null, 
          type:0}
          this.inicios=[]
          this.nosotros=[]
          this.getCar()
        })
    })
  }

  cleanObject(){
    this.carrusel={titulo:"",
          subtitulo:"",
          imagen:" ",
          fullImagen:null, 
          type:0}
  }

  getCar(){
    this.api.get(`/Carrusels`,true)
    .subscribe((carrusels:Array<any>)=>{  
      carrusels.forEach(c => {
        if(c.type){
          this.nosotros.push(c)
        }
        else{
          this.inicios.push(c)
        }
      });     
    })
  }

  deleteCar(fileId, id){
    let data:any={
      id:fileId
    }
    if(confirm("¿Desea eliminar este item?")){
      //this.api.post('/Carrusels/deleteFile',data)
      // .subscribe((okay)=>{
        this.api.delete(`/Carrusels/${id}`)
        .subscribe((okay)=>{
          this.inicios=[]
          this.nosotros=[]
          this.getCar();
          this.toast.showSuccess("Eliminado con exito")
        })
      // })
    }
  }

}
  