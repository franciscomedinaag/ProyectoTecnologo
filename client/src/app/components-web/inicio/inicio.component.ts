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

  private sitio:any={}
  private carrusels:any=[{}]

  constructor(private api:DataApiService) { }

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
    .subscribe((carrusels)=>{
      this.carrusels=carrusels
    })
  }

}
