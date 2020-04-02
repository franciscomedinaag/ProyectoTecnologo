import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  title:string="Que pedo con el mapa"
  lat:number=51.6712
  lang:number=7.80900

  
  
  constructor() { }
  
  ngOnInit() {
    
  }
  
}
