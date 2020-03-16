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

  constructor(private api:DataApiService, private toast:ToastService) { }

  ngOnInit() {
  }

  createProduct(){
    if(this.producto.clave==null || this.producto.descripcion==null || this.producto.imagen==null || this.producto.precio==null || 
      this.producto.fr==null || this.producto.fo==null || this.producto.al==null){
        this.toast.showError("Debes rellenar todos los campos")
        return
    }

    if(Number(this.producto.precio) && Number(this.producto.fr) && Number(this.producto.fo) && Number(this.producto.al))
    {
      this.api.post(`/ProductosFijos`,this.producto)
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
      })
    }
    else{
      this.toast.showError("Precio y las medidas deben ser solo numeros")
    }
  }

}
