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

  public subtareaId:any;
  public tratoId:any;
  public cotNumber:any;
  public subtarea:any;
  public tablones:any;
  public productosFijos:any;
  public productosCreados:any;
  public total:number=0;
  public trato:any={
    nombre:""
  };
  public cotizacion:any={};
  public producto:any={
    descripcion:null,
    cantidad:null,
    tablonId:null,
    cantTablones:null,
    montoHerrajes:null,
    productoFijoId:null,
    cotizacionId:null
  }

  constructor(public activated:ActivatedRoute, public api:DataApiService, public toast:ToastService) { }

  ngOnInit() {
    this.subtareaId=this.activated.snapshot.paramMap.get("subId");
    this.tratoId=this.activated.snapshot.paramMap.get("tratoId");
    this.getCoti() //trae la subtarea, el trato y la cotizacione
    this.getTablones()
    this.getFijos()
  }

  getCoti(){
    this.api.get(`/Subtareas`,true,{where:{tratoId:this.tratoId,categoriaId:5}})
    .subscribe((subtareas:Array<any>)=>{
      subtareas.forEach((sub, index) => {
        if(sub.id==this.subtareaId){
          this.cotNumber=index+1
          this.subtarea=sub
        }
      });
      this.api.get(`/Cotizaciones`,true,{where:{subtareaId:this.subtareaId}})
      .subscribe((coti)=>{
        this.cotizacion=coti[0]
        this.api.get(`/Tratos/${this.tratoId}`)
        .subscribe((trato:Array<any>)=>{
          this.trato=trato
        })
        this.getCreados()
      })
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
      this.productosCreados.forEach(p => {
        if(p.tablonId==0){p.unitario=p.productoFijo.precio}
        else{p.unitario=p.productoFijo.precio + (p.tablon.precio * p.cantTablones)}
        p.neto=p.unitario*p.cantidad
        this.total=this.total+p.neto
      });
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
      this.getCreados()
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

   onDeleteCreated(id){
     console.log(id)
    if(confirm("¿Deseas quitar este producto de la cotizacion?")){
     this.api.delete(`/ProductosCreados/${id}`)
     .subscribe((deleted)=>{
       this.getCreados()
     })
    }
   }

   addConcept(){
     if(!(Number(this.cotizacion.manoObra)) || !(Number(this.cotizacion.administrativos)) || !(Number(this.cotizacion.utilidad)) ||
     !(Number(this.cotizacion.impuestos))){
       this.toast.showError("Debes ingresar numeros mayores a 0")
       return
     }
     if(this.cotizacion.manoObra<=0 || this.cotizacion.administrativos<=0 || this.cotizacion.utilidad<=0 ||this.cotizacion.impuestos<=0 )
     {
      this.toast.showError("No puedes ingresar valores negativos")
      return
     }
     if(this.cotizacion.impuestos>100){
      this.toast.showError("El porcentaje de impuestos no puede ser mayor al 100")
      return
     }
     this.api.patch(`/Cotizaciones`,this.cotizacion)
     .subscribe((edited)=>{
       this.toast.showSuccess("Conceptos editados")
       this.cotizacion=edited
     })
   }

   finish(){
     if(this.productosCreados.length>0){
       if(this.cotizacion.manoObra>0 || this.cotizacion.administrativos>0 || this.cotizacion.utilidad>0 ||this.cotizacion.impuestos>0){
        this.subtarea.estado=1
        this.api.patch(`/Subtareas`,this.subtarea)
        .subscribe((okay)=>{
          this.cotizacion.total=this.total
          this.api.patch(`/Cotizaciones`,this.cotizacion)
          .subscribe((edited)=>{
            this.toast.showSuccess("Cotización terminada con exito")
            this.cotizacion=edited
          })
        })
       }
       else{
        this.toast.showError("Debes ingresar conceptos")
       }
     }
     else{
      this.toast.showError("No tienes productos añadidos")
     }
   }

}
