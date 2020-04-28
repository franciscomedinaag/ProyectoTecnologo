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
            this.toast.showSuccess("Campo editado")
            this.getSitio()
            this.setImg=false
          })    
      }
      else{
        this.toast.showSuccess("Campo editado")
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
      this.carrusel.fullImagen=file
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
      this.api.post('/Carrusels/deleteFile',data)
      .subscribe((okay)=>{
        this.api.delete(`/Carrusels/${id}`)
        .subscribe((okay)=>{
          this.inicios=[]
          this.nosotros=[]
          this.getCar();
          this.toast.showSuccess("Eliminado con exito")
        })
      })
    }
  }

}
  