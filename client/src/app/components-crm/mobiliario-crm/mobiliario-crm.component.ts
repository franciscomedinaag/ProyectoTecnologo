import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-mobiliario-crm',
  templateUrl: './mobiliario-crm.component.html',
  styleUrls: ['./mobiliario-crm.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MobiliarioCrmComponent implements OnInit {

  private mobiliario:any=[]
  private mob:any={}
  private mueble={
    nombre:'',
    descripcion:'',
    imagen:' ',
    categoria:'',
    fullImagen:{}
  }
  private categorias=['Escritorios','Sillas','Peninsulas','Cocinas','Archiveros','Ejecutivos','Estantes','Butacas','Otros']
  private desc=true
  private nom=true
  private cat=true

  constructor(private api:DataApiService, private toast:ToastService) { }

  ngOnInit() {
    this.getMob()
  }

  getMob(){
    this.api.get(`/Mobiliarios`,true)
    .subscribe((mobiliario)=>{
      this.mobiliario=mobiliario
      console.log(this.mobiliario.length)
    })
  }

  selectImageOrder( file:any){
    this.mueble.fullImagen=file;
  }

  createCar(){
    console.log(this.mueble.fullImagen)
    if(this.mueble.nombre=='' || this.mueble.descripcion=='' || this.mueble.categoria=='' 
    || Object.keys(this.mueble.fullImagen).length==0){
      this.toast.showError("No puedes ingresar campos en blanco")
      return
    }
    this.api.post(`/Mobiliarios`, this.mueble)
    .subscribe((okay:any)=>{
      this.api.post(`/Mobiliarios/${okay.id}/setMobiliario`,this.mueble.fullImagen)
        .subscribe((okay)=>{
          this.toast.showSuccess("Mueble agregado")
          this.mueble={
            nombre:'',
            descripcion:'',
            imagen:'',
            categoria:'',
            fullImagen:{}
          }
          this.getMob()
        })
    })
  }

  validate(){
    if(this.mob.nombre=='' || this.mob.descripcion=='' || this.mob.categoria=='' ){
      this.toast.showError("No puedes ingresar campos en blanco")
      return
    }
    this.api.patch(`/Mobiliarios`, this.mob)
    .subscribe((done)=>{
      this.toast.showSuccess("Mueble modificado")
    })
  }

  deleteMob(fileId, id){
    let data:any={
      id:fileId
    }
    if(confirm("¿Desea eliminar este mueble?")){
      this.api.post('/Mobiliarios/deleteFile',data)
      .subscribe((okay)=>{
        this.api.delete(`/Mobiliarios/${id}`)
        .subscribe((okay)=>{
          this.getMob();
          this.toast.showSuccess("Eliminado con exito")
        })
      })
    }
  }

}
