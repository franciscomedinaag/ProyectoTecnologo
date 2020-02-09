import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';

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


  constructor(private api:DataApiService) { }

  ngOnInit() {
    this.getUsers();
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
  

}
