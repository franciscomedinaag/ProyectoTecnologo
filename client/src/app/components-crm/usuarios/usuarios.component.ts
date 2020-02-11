import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  activos:any=[];
  inactivos:any=[];
  vendedores:any=[];
  showAct:boolean=true;
  showMeta:boolean=true;
  admin:any={meta:"number"};
  user:any={};
  pass1:string;
  pass2:string;
  ready:boolean=false;
  fecha:any;

  constructor(private api:DataApiService, private auth:AuthService, private router:Router, private toast:ToastService) { }

  ngOnInit() {
    this.getUsers();
    this.getMeta();
  }

  getUsers(){
    this.activos=[];
    this.inactivos=[];
    this.vendedores=[];
    if(this.showAct){
      this.api.get('/Usuarios',true,{where:{realm:'user',active:true}})
      .subscribe((usuarios)=>{
        this.activos=usuarios;
        this.vendedores=this.activos;
      })
    }
    else{
    this.api.get('/Usuarios',true,{where:{realm:'user',active:false}})
    .subscribe((usuarios)=>{
      this.inactivos=usuarios;
      this.vendedores=this.inactivos;
    })
    }
  }

  getMeta(){
    this.api.get('/Usuarios',true,{where:{realm:'admin',active:true}})
    .subscribe((admin)=>{
      this.admin=admin[0]
    })
  }

  assign(admin:any){
    this.api.patch('/Usuarios',admin).subscribe((edited)=>{
      this.admin=edited
     })
  }

  changeState(user:any, state:boolean){
    user.active=state;
    this.api.patch('/Usuarios',user).subscribe((edited)=>{
     this.getUsers(); 
    })
  }

  vista(show:boolean){
    if(show){
      this.showAct=true;
      this.getUsers();
      this.vendedores=this.activos;
    }
    else{
      this.showAct=false;
      this.getUsers();
      this.vendedores=this.inactivos;
    }
  }

  saveUser(){
    this.fecha=new Date().toISOString();
    if(this.pass1==this.pass2){
      this.user.password=this.pass1
      this.user.registro=this.fecha
      this.user.imagen=" "
      this.user.meta=0
      this.user.realm="user"
      this.api.post('/Usuarios',this.user)
      .subscribe((done)=>{
        this.toast.showSuccess("Usuario creado")
        this.getUsers();
      },
      (err) => {this.toast.showError("Datos incorrectos")});
      }
    else{
      this.toast.showError("Las contraseñas no coinciden")
    }
  }

}
