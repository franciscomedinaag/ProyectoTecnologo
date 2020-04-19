import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent implements OnInit {

  public sitio:any={}
  public carrusels:any=[{}]
  public first={imagen:null, titulo:null, subtitulo:null}

  constructor(public api:DataApiService) { }

  ngOnInit() {
    this.getNosotros()
    this.getCarrusel()
  }

  getNosotros(){
    this.api.get(`/Sitios`,false)
    .subscribe((sitio)=>{
      this.sitio=sitio[0]
    })
  }

  getCarrusel(){
    this.api.get(`/Carrusels`,false,{where:{type:1}})
    .subscribe((carrusels:any)=>{
      this.first=carrusels[0]
      this.carrusels=carrusels
      this.carrusels.shift()
      console.log(this.carrusels)
    })
  }

}
