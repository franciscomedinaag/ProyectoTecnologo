import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent implements OnInit {

  private sitio:any={}
  private carrusels:any=[{}]
  private first={}

  constructor(private api:DataApiService) { }

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
