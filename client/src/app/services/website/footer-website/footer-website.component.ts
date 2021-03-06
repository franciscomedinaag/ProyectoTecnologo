import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../data-api.service';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-footer-website',
  templateUrl: './footer-website.component.html',
  styleUrls: ['./footer-website.component.css']
})
export class FooterWebsiteComponent implements OnInit {

  public datos:any={}
  public mail:any={
    telefono:null,
    correo:null,
    nombre:null,
    mensaje:null,
    asunto:null,
    fecha:null
  }

  constructor(public api:DataApiService, public toast:ToastService) { }

  ngOnInit() {
    this.getInfo()
  }

  getInfo(){
    this.api.get(`/Sitios`,false)
    .subscribe((datos)=>{
      this.datos=datos[0]
    })
  }

  sendMail(){
    if(this.validation()){
      console.log("OK")
      this.mail.fecha=new Date().toISOString()
      this.api.post(`/Clients/checkIfExist`,{data:this.mail},false)
      .subscribe((created)=>{
        this.toast.showSuccess("Correo mandado con exito, responderemos la antes posible")
        this.sendNoti(this.mail.nombre+" | "+this.mail.correo)
        this.mail={
          telefono:null,
          correo:null,
          nombre:null,
          mensaje:null,
          asunto:null,
          fecha:null
        }
      })
    }
  }

  sendNoti(clienteTitle){
    let data={
      title:"El cliente "+clienteTitle+" desea contactar con un vendedor",
      content:`/clientes`,
      timestamp:new Date().toISOString(),
      seen:false,
      usuarioId:0
    }
   
    this.api.get(`/Usuarios`,false,{where:{realm:'admin'}})
    .subscribe((admin)=>{
      data.usuarioId=admin[0].id
      this.api.post(`/Notifications`,data)
      .subscribe((created)=>{
        console.log("El administrador ha sido notificado")
      })
    })

  }

  validation():boolean{
    if(this.mail.mensaje==null || this.mail.correo==null || this.mail.telefono==null|| this.mail.nombre==null || this.mail.asunto==null){
      this.toast.showError("Debes rellenar todos los campos")
      return false
    }
    else if(!Number(this.mail.telefono)){
      this.toast.showError("Telefono debe ser un numero")
      return false
    }
    else if(this.mail.telefono.length<8 || this.mail.telefono.length>12 ){
      this.toast.showError("Telefono debe ser entre 8 y 12 caracteres")
      return false
    }
    else if(!this.validateEmail(this.mail.correo) ){
      this.toast.showError("Ingresa un correo válido")
      return false
    }
    else{
      return true
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
