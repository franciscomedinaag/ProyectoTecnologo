import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-precios-fijos',
  templateUrl: './precios-fijos.component.html',
  styleUrls: ['./precios-fijos.component.css']
})
export class PreciosFijosComponent implements OnInit {

  public producto:any={
    clave:null,
    descripcion:null,
    imagen:null,
    precio:null,
    fr:null,
    fo:null,
    al:null,
    deleted:false
  }
  public visible:any={
    clave:null,
    descripcion:null,
    imagen:null,
    precio:null,
    fr:null,
    fo:null,
    al:null,
    deleted:false
  }

  public tablon:any={
    nombre:null,
    vertical:null,
    horizontal:null,
    precio:null,
    deleted:false
  }

  public productos:any=[];
  public tablones:any=[];

  public desc:boolean=true;
  public prec:boolean=true;
  public fr:boolean=true;
  public fo:boolean=true;
  public al:boolean=true;

  constructor(public api:DataApiService, public toast:ToastService) { }

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
          al:null,
          deleted:false
        }
        this.getProductos()
      })
    }
    else{
      this.toast.showError("Precio y las medidas deben ser solo numeros")
    }
  }

  getProductos(){
    this.api.get(`/ProductosFijos`,true,{where:{deleted:false}})
    .subscribe((productos)=>{
      this.productos=productos
    })
  }

  onDelete(producto){

    let data:any={
      id:producto.imagen
    }
    if(confirm("¿Deseas eliminar este producto?")){
      this.api.post('/ProductosFijos/deleteFile',data)
      .subscribe((okay)=>{
        producto.deleted=true
        this.api.patch(`/ProductosFijos`,producto)
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
    this.api.get(`/Tablones`,true,{where:{deleted:false}})
    .subscribe((tablones)=>{
      this.tablones=tablones
    })
  }

  deleteTab(tablon){
    if(confirm("¿Deseas eliminar este producto?")){
      tablon.deleted=true
      this.api.patch(`/Tablones/`, tablon).subscribe(()=>{
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
          this.tablon={deleted:false}
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
