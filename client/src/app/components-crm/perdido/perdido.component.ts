import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-perdido',
  templateUrl: './perdido.component.html',
  styleUrls: ['./perdido.component.css']
})
export class PerdidoComponent implements OnInit {

  public tratoId:any
  public encuesta:any={
    tratoId:0,
    respuesta1:0
  }
  public trato:any={
    nombre:"",
    vendedor:{}
  }

  public otro1:any=null

  constructor(public api:DataApiService, public toast:ToastService, public activated:ActivatedRoute, public router:Router) { }

  ngOnInit() {
    this.tratoId=this.activated.snapshot.paramMap.get("id");
    this.getEncuesta()
  }

  getEncuesta(){
    this.api.get('/Perdidos',false,{where:{tratoId:this.tratoId}})
    .subscribe((encuestas:any)=>{
      this.encuesta=encuestas[0]
      this.getTrato()
    })
  }

  getTrato(){
    this.api.get(`/Tratos/${this.encuesta.tratoId}/getTrato`,false)
    .subscribe((trato)=>{
      this.trato=trato
    })
  }

  sendAns(){
    if(this.encuesta.respuesta1=="0" || this.encuesta.respuesta2=="0"){
      this.toast.showError("Por favor rellena todos los campos")
      return
    }
    if(this.encuesta.respuesta1=="d" && this.otro1==null){
      this.toast.showError("Rellena el campo 'Otros'")
      return
    }
    if(this.encuesta.respuesta1=="d" && this.otro1!=null){
      this.encuesta.respuesta1=this.otro1
    }

    this.api.patch(`/Perdidos`,this.encuesta)
    .subscribe((done)=>{
      this.toast.showSuccess("Muchas gracias por su tiempo")
      this.router.navigate(["/inicio"])
    })
  }

}
