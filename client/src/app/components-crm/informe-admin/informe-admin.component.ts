import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { AuthService } from '../../services/auth.service';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-informe-admin',
  templateUrl: './informe-admin.component.html',
  styleUrls: ['./informe-admin.component.css']
})
export class InformeAdminComponent implements OnInit {

  public informes:any=[]
  public categorias:any=[0,0,0,0,0,0,0,0]
  public report:any={abiertos:0,
    cerrados:0,
    vencidos:0,
    total:0,
    finales:[],
    cuales:[],
    cual:2}
  public adminId:any
  public historico:any={
    abiertos:0,
    cerrados:0,
    vencidos:0,
    total:0,
    finales:[],
    cuales:[],
    cual:2
  }

  constructor( public api:DataApiService, public auth:AuthService, public activated:ActivatedRoute) { }

  ngOnInit() {
    this.adminId=this.activated.snapshot.paramMap.get("id");
    this.getCategorias()
    this.getInformes()
  }
  
  getInformes(){
    this.api.get(`/InformesAdmin`,true)
    .subscribe((informes)=>{
      this.informes=informes
      this.informes.forEach(informe => {
        var counts = {};
        for (var i = 0; i < informe.finales.length; i++) {
          var num = informe.finales[i];
          counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        let cuantas= Object.values(counts).sort()[ Object.values(counts).sort().length-1]
        let cual= (Object.values(counts).sort().length-1)-1

        if(cual<=0){
          informe.cual=2
        }
        else{
          informe.cual=(Object.values(counts).sort().length-1)-1
        }
        informe.cuantas=Object.values(counts).sort()[ Object.values(counts).sort().length-1]
        
      });
      this.getHistorico()
    })
  }
  
  getHistorico(){
    var counts = {};
    this.informes.forEach(informe => {
      this.historico.abiertos=(this.historico.abiertos+informe.abiertos) / (this.informes.length - 1) 
      this.historico.cerrados=(this.historico.cerrados+informe.cerrados) / (this.informes.length - 1) 
      this.historico.vencidos=(this.historico.vencidos+informe.vencidos) / (this.informes.length - 1) 
      this.historico.total=(this.historico.total+informe.total) / (this.informes.length - 1) 
      this.historico.cuales.push(informe.cual)
    });

    for (var i = 0; i < this.historico.cuales.length; i++) {
      var num = this.historico.cuales[i];
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    this.historico.cual= (Object.values(counts).sort().length-1) - 1
  }
  
  getCategorias(){
    this.api.get('/CategoriaSubs',true)
    .subscribe((categorias)=>{
      this.categorias=categorias
    })  
  }

}
