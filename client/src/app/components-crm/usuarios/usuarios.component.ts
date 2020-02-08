import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(private api:DataApiService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(){
    this.api.get('/Usuarios',true,{where:{realm:'user'}})
    .subscribe((usuarios)=>{
      console.log("los usuarios", usuarios)
    })
  }

}
