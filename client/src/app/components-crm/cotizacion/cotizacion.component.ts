import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CotizacionComponent implements OnInit {

  private subtareaId:any;
  private tratoId:any;
  private cotNumber:any;
  private subtarea:any;
  private tablones:any;
  private productosFijos:any;
  private productosCreados:any;
  private trato:any={
    nombre:""
  };
  private cotizacion:any={};
  private producto:any={
    descripcion:null,
    cantidad:null,
    tablonId:null,
    cantTablones:null,
    montoHerrajes:null,
    productoFijoId:null,
    cotizacionId:null
  }

  constructor(private activated:ActivatedRoute, private api:DataApiService, private toast:ToastService) { }

  ngOnInit() {
    this.subtareaId=this.activated.snapshot.paramMap.get("subId");
    this.tratoId=this.activated.snapshot.paramMap.get("tratoId");
    this.getCoti() //trae la subtarea, el trato y la cotizacione
    this.getTablones()
    this.getFijos()
    this.getCreados()
  }

  getCoti(){
    this.api.get(`/Subtareas`,true,{where:{tratoId:this.tratoId,categoriaId:5}})
    .subscribe((subtareas:Array<any>)=>{
      subtareas.forEach((sub, index) => {
        if(sub.id==this.subtareaId){
          this.cotNumber=index+1
          this.subtarea=sub

          this.api.get(`/Tratos/${sub.tratoId}`)
          .subscribe((trato:Array<any>)=>{
            this.trato=trato
          })

          this.api.get(`/Cotizaciones`,true,{where:{subtareaId:this.subtareaId}})
          .subscribe((coti)=>{
            this.cotizacion=coti[0]
          })
        }
      });
    })
  }

  getTablones(){
    this.api.get(`/Tablones`)
    .subscribe((tabs:any)=>{
      this.tablones=tabs
    })
  }

  getFijos(){
    this.api.get(`/ProductosFijos`)
    .subscribe((fijos:any)=>{
      this.productosFijos=fijos
    })
  }

  // {where:{cotizacionId:this.cotizacion.id}}

  getCreados(){
    let data={cotizacionId:this.cotizacion.id}
    this.api.post(`/ProductosCreados/getCreados`,{data:data})
    .subscribe((creados:any)=>{
      this.productosCreados=creados
      console.log("creados",creados)
    })
  }

  addProduct(){
    this.producto.cotizacionId=this.cotizacion.id
    if(this.producto.descripcion==null  || this.producto.productoFijoId==null){
        this.toast.showError("Debes llenar todos los campos")
        return
      }
    if(this.producto.tablonId==null || this.producto.tablonId=="" || this.producto.tablonId==" "){
      this.producto.tablonId=0
      this.producto.cantTablones=0
    }

    if(!(Number(this.producto.cantidad)) || !(Number(this.producto.montoHerrajes))){
      this.toast.showError("Monto de herrajes y cantidades deben ser numeros mayores a 0")
      return
    }
    this.api.post(`/ProductosCreados`,this.producto)
    .subscribe((created)=>{
      this.toast.showSuccess("Producto añadido a la cotización")
      this.producto={
        descripcion:null,
        cantidad:null,
        tablonId:null,
        cantTablones:null,
        montoHerrajes:null,
        productoFijoId:null,
        cotizacionId:null
      }
    }) 
   }

}
