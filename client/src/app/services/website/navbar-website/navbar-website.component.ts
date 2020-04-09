import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar-website',
  templateUrl: './navbar-website.component.html',
  styleUrls: ['./navbar-website.component.css']
})
export class NavbarWebsiteComponent implements OnInit {

  public categoria:any="CATEGORIA"
  public descripcion:any="Descripcion ..."

  constructor() { }

  ngOnInit() {
  }

  getTitulo(categoriaId){
    switch(categoriaId){
      case '1':{
        this.categoria="ESCRITORIOS"
        this.descripcion="Escritorios de alta calidad para las industrias"
        break
      }
      case '2':{
        this.categoria="SILLAS"
        this.descripcion="Sillas de alta calidad para puestos ejecutivos"
        break
      }
      case '3':{
        this.categoria="PENINSULAS"
        this.descripcion="Peninsulas y recepciones de alta calidad"
        break
      }
      case '4':{
        this.categoria="COCINAS"
        this.descripcion="Cocinas Integrales para tu residencia"
        break
      }
      case '5':{
        this.categoria="ARCHIVEROS"
        this.descripcion="La mejor calidad en archiveros para lo que necesites"
        break
      }
      case '6':{
        this.categoria="EJECUTIVOS"
        this.descripcion="Calidad premium en recepciones para ejecutivos"
        break
      }
      case '7':{
        this.categoria="ESTANTES"
        this.descripcion="Estantes para tu negocio"
        break
      }
      case '8':{
        this.categoria="BUTACAS"
        this.descripcion="Butacas para todo lo que necesites"
        break
      }
      case '9':{
        this.categoria="OTROS"
        this.descripcion="Productos diferentes para tu necesidad"
        break
      }
    }
  }

}
