import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-precios-fijos',
  templateUrl: './precios-fijos.component.html',
  styleUrls: ['./precios-fijos.component.css']
})
export class PreciosFijosComponent implements OnInit {

  private producto:any={
    clave:null,
    descripcion:null,
    imagen:null,
    precio:null,
    fr:null,
    fo:null,
    al:null
  }
  private visible:any={
    clave:null,
    descripcion:null,
    imagen:null,
    precio:null,
    fr:null,
    fo:null,
    al:null
  }

  private tablon:any={
    nombre:null,
    vertical:null,
    horizontal:null,
    precio:null
  }

  private productos:any=[];
  private tablones:any=[];

  private desc:boolean=true;
  private prec:boolean=true;
  private fr:boolean=true;
  private fo:boolean=true;
  private al:boolean=true;

  constructor(private api:DataApiService, private toast:ToastService) { }

  ngOnInit() {
    this.getProductos()
    this.getTabs()
  }

  createProduct(){
    if(this.producto.clave==null || this.producto.descripcion==null || this.producto.imagen==null || this.producto.precio==null || 
      this.producto.fr==null || this.producto.fo==null || this.producto.al==null){
        this.toast.showError("Debes rellenar todos los campos y subir una imagen")
        return
    }
    if(Number(this.producto.precio) && Number(this.producto.fr) && Number(this.producto.fo) && Number(this.producto.al))
    {
      this.api.post(`/ProductosFijos/setProduct`,this.producto)
      .subscribe((created)=>{
        this.toast.showSuccess("Producto creado")
        this.producto={
          clave:null,
          descripcion:null,
          imagen:null,
          precio:null,
          fr:null,
          fo:null,
          al:null
        }
        this.getProductos()
      })
    }
    else{
      this.toast.showError("Precio y las medidas deben ser solo numeros")
    }
  }

  getProductos(){
    this.api.get(`/ProductosFijos`,true)
    .subscribe((productos)=>{
      this.productos=productos
    })
  }

  onDelete(fileId, id){

    let data:any={
      id:fileId
    }
    if(confirm("¿Deseas eliminar este producto?")){
      this.api.post('/ProductosFijos/deleteFile',data)
      .subscribe((okay)=>{
        this.api.delete(`/ProductosFijos/${id}`)
        .subscribe(()=>{
          this.getProductos()
        })
      })
    }
  }

  selectImageOrder( img:any){
    this.producto.imagen=img
  }

  validate(){
    this.api.patch(`/ProductosFijos`,this.visible)
    .subscribe((edited)=>{})
  }

  getTabs(){
    this.api.get(`/Tablones`)
    .subscribe((tablones)=>{
      this.tablones=tablones
    })
  }

  deleteTab(id){
    if(confirm("¿Deseas eliminar este producto?")){
      this.api.delete(`/Tablones/${id}`).subscribe(()=>{
        this.getTabs()
      })
    }
  }

  createTab(){
    if(this.tablon.nombre==null || this.tablon.precio==null || this.tablon.horizontal==null || this.tablon.vertical==null){
        this.toast.showError("Debes rellenar todos los campos")
        return
    }
    if(Number(this.tablon.precio) && Number(this.tablon.horizontal) && Number(this.tablon.vertical)) {
      if(this.tablon.precio<=0 || this.tablon.horizontal<=0 || this.tablon.vertical<=0){
        this.toast.showError("Precio y medidas deben ser mayores de 0")
        return
      }
      else{
        this.api.post(`/Tablones`, this.tablon)
        .subscribe((okay)=>{
          console.log(okay)
          this.tablon={}
          this.toast.showSuccess("Tablon creado")
          this.getTabs()
        })
      }
    }
    else{
      this.toast.showError("Precio y medidas deben ser numeros mayores de 0")
    }
  }

}
