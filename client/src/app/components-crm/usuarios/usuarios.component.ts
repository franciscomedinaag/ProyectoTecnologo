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
  admin:any={};
  meta:any={cantidad:0};
  user:any={};
  pass1:string;
  pass2:string;
  ready:boolean=false;
  fecha:any;

  there:boolean=false;
  cant:number=0;

  constructor(private api:DataApiService, private auth:AuthService, private router:Router, private toast:ToastService) { }

  ngOnInit() {
    this.getUsers();
    this.getAdmin();
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

  getAdmin(){
    this.api.get('/Usuarios',true,{where:{realm:'admin',active:true}})
    .subscribe((admin)=>{
      this.admin=admin[0]
    })
  }

  getMeta(){
    this.api.get('/Metas',true)
    .subscribe((meta)=>{
      this.meta=meta[0]
      if(!this.meta){
       this.there=false;
      }
      else{
       this.there=true;
      }
    },
    (err) => {console.log(err)})
  }

  assignMeta(meta:any){
    if(Number(meta.cantidad)){
      if(meta.cantidad>0){
        this.meta.fecha=new Date().toISOString();
        this.api.patch('/Metas',meta).subscribe((edited)=>{
          this.meta=edited
        })
      }
      else{
        this.toast.showError("Meta tiene que ser un valor positivo")
        this.getMeta();
      }
    }
    else{
      this.toast.showError("La meta tiene que ser una cantidad")
      this.getMeta();
    }
  }
  
  addMeta(cant:number){
    let meta={cantidad:cant,fecha:new Date().toISOString()}
    this.api.post('/Metas',meta).subscribe((added)=>{
      this.meta=added;
      this.there=true;
      this.showMeta=true;
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
      if(Number(this.user.telefono)){
        if(this.user.telefono.length<8 || this.user.telefono.length>=14){
          this.toast.showError("El telefono debe ser entre 8-12 caracteres");
          return;
        }
      }
      else{
        this.toast.showError("El telefono no es un numero");
        return
      }

      this.api.get(`/Usuarios`,true,{where:{email:this.user.email}})
      .subscribe((found:Array<any>)=>{
        console.log(found)
        if(found.length==0){
          console.log(this.user)
          this.api.post('/Usuarios',this.user)
          .subscribe((done)=>{
            this.toast.showSuccess("Usuario creado")
            this.user={}
            this.getUsers();
          },
          (err) => {
            this.toast.showError("Correo no valido")
          });
        }
        else{
          this.toast.showError("Este correo ya está registrado")
        }
      })

    }
    else{
      this.toast.showError("Las contraseñas no coinciden")
    }
  }

}
