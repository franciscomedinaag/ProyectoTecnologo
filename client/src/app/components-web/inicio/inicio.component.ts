import { Component, OnInit } from '@angular/core';
import { NavbarWebsiteComponent } from '../../services/website/navbar-website/navbar-website.component';
import { FooterWebsiteComponent } from '../../services/website/footer-website/footer-website.component';
import { DataApiService } from '../../services/data-api.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public sitio:any={}
  public carrusels:any=[{}]
  public first={imagen:null, titulo:null, subtitulo:null}

  constructor(public api:DataApiService) { }

  ngOnInit() {
    this.getInicio()
    this.getCarrusel()
  }

  getInicio(){
    this.api.get(`/Sitios`,false)
    .subscribe((sitio)=>{
      this.sitio=sitio[0]
    })
  }

  getCarrusel(){
    this.api.get(`/Carrusels`,false,{where:{type:0}})
    .subscribe((carrusels:any)=>{
      this.first=carrusels[0]
      this.carrusels=carrusels
      this.carrusels.shift()
      // console.log(this.carrusels)
    })
  }

}
