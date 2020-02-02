import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  constructor(private api:DataApiService) { }

  ngOnInit() {
    this.getClients(); 
  }

  getClients(){
    this.api.getAllClients()
    .subscribe((clients)=>console.log("productos: ", clients));
  }

}
