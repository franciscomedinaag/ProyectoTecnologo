import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.component.html',
  styleUrls: ['./miperfil.component.css']
})
export class MiperfilComponent implements OnInit {

  private id:any;
  private usuario:any={};

  private pass:boolean=true;
  private user:boolean=true;
  private tel:boolean=true;
  private mail:boolean=true;

  private pass1:string;
  private pass2:string;

  private sendPass:any={newPassword:"",id:0};

  constructor(private activated:ActivatedRoute, private api:DataApiService, private toast:ToastService) { }

  ngOnInit() {
    this.id=this.activated.snapshot.paramMap.get("id");
    this.getUser()
  }

  getUser(){
    this.api.get('/Usuarios',true,{where:{id:this.id}})
      .subscribe((usuario)=>{
       this.usuario=usuario[0]
      })
  }
  
  assign(usuario:any){
    this.api.patch('/Usuarios',usuario).subscribe((edited)=>{
      this.usuario=edited
     })
  }

  validatePass(pass1:string, pass2:string){

    this.sendPass.id=this.id;
    this.sendPass.newPassword=pass1;

    if(pass1==pass2){
      this.api.post('/Usuarios/setPass',{sendPass:this.sendPass},true,null)
      .subscribe((done)=>{
        this.toast.showSuccess("Contraseña cambiada satisfactoriamente")
      })
    }
    else{
      this.toast.showError("Las contraseñas no coinciden")
    }
  }

}
