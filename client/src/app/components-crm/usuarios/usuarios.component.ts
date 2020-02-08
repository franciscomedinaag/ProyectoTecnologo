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
    this.api.get('/Usuarios',true,{where:{realm:'user',active:true}})
    .subscribe((usuarios)=>{
      this.activos=usuarios;
      this.vendedores=usuarios;
    })
    this.api.get('/Usuarios',true,{where:{realm:'user',active:false}})
    .subscribe((usuarios)=>{
      this.inactivos=usuarios;
    })
  }

}
