import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { AuthService } from '../../services/auth.service';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-informe-ven',
  templateUrl: './informe-ven.component.html',
  styleUrls: ['./informe-ven.component.css']
})
export class InformeVenComponent implements OnInit {

  private informes:any=[]
  private report:any={}
  private vendedorId:any
  private historico:any={
    abiertos:0,
    cerrados:0,
    vencidos:0,
    total:0,
    intentos:0,
    clientes:0,
    tareas1:0,
    tareas2:0,
  }

  constructor( private api:DataApiService, private auth:AuthService, private activated:ActivatedRoute) { }

  ngOnInit() {
    this.vendedorId=this.activated.snapshot.paramMap.get("id");
    this.getInformes()
  }
  
  getInformes(){
    this.api.get(`/Informes`,true,{where:{vendedorId:this.vendedorId}})
    .subscribe((informes)=>{
      this.informes=informes
      this.getHistorico()
    })
  }
  
  getHistorico(){
    this.informes.forEach(informe => {
      this.historico.abiertos=(this.historico.abiertos+informe.abiertos) / (this.informes.length - 1) 
      this.historico.cerrados=(this.historico.cerrados+informe.cerrados) / (this.informes.length - 1) 
      this.historico.vencidos=(this.historico.vencidos+informe.vencidos) / (this.informes.length - 1) 
      this.historico.total=(this.historico.total+informe.total) / (this.informes.length - 1) 
      this.historico.intentos=(this.historico.intentos+informe.intentos) / (this.informes.length - 1) 
      this.historico.clientes=(this.historico.clientes+informe.clientes) / (this.informes.length - 1) 
      this.historico.tareas1=(this.historico.tareas1+informe.tareas1) / (this.informes.length - 1) 
      this.historico.tareas2=(this.historico.tareas2+informe.tareas2) / (this.informes.length - 1) 
    });
  }
}
