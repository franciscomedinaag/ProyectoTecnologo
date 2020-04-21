import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';
import { NavbarWebsiteComponent } from '../../services/website/navbar-website/navbar-website.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-muebles',
  templateUrl: './muebles.component.html',
  styleUrls: ['./muebles.component.css']
})
export class MueblesComponent implements OnInit {

  public categoriaId:any
  public categoria="CATEGORIA"
  public descripcion="Descripcion..."
  public evento={}
  public mobiliario:any=[]
  public mob:any={}


  constructor(public api:DataApiService, public activated:ActivatedRoute, public router:Router) { 
    this.router.events.subscribe((id:any)=>{
      if(!isNullOrUndefined(id.url)){
        this.categoriaId=id.url.split("/")[2]
        this.getTitulo()
      }
    })
  }

  ngOnInit() {
    this.categoriaId=this.activated.snapshot.paramMap.get("id");
    this.getTitulo()

  }

  getMuebles(){
    this.mobiliario=[]
    this.api.get(`/Mobiliarios`,false,{where:{categoria:this.categoria}})
    .subscribe((mobiliario)=>{
      this.mobiliario=mobiliario
      console.log("Categoria: ", this.categoria, this.mobiliario)
    })
  }

  getTitulo(){
    switch(this.categoriaId){
      case '1':{
        this.categoria="Escritorios"
        this.descripcion="Escritorios de alta calidad para las industrias"
        break
      }
      case '2':{
        this.categoria="Sillas"
        this.descripcion="Sillas de alta calidad para puestos ejecutivos"
        break
      }
      case '3':{
        this.categoria="Peninsulas"
        this.descripcion="Peninsulas y recepciones de alta calidad"
        break
      }
      case '4':{
        this.categoria="Cocinas"
        this.descripcion="Cocinas Integrales para tu residencia"
        break
      }
      case '5':{
        this.categoria="Archiveros"
        this.descripcion="La mejor calidad en archiveros para lo que necesites"
        break
      }
      case '6':{
        this.categoria="Ejecutivos"
        this.descripcion="Calidad premium en recepciones para ejecutivos"
        break
      }
      case '7':{
        this.categoria="Estantes"
        this.descripcion="Estantes para tu negocio"
        break
      }
      case '8':{
        this.categoria="Butacas"
        this.descripcion="Butacas para todo lo que necesites"
        break
      }
      case '9':{
        this.categoria="Otros"
        this.descripcion="Productos diferentes para tu necesidad"
        break
      }
    }
    this.getMuebles()
  }


}
