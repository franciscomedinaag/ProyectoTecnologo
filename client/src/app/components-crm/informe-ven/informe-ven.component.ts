import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-informe-ven',
  templateUrl: './informe-ven.component.html',
  styleUrls: ['./informe-ven.component.css']
})
export class InformeVenComponent implements OnInit {

  private informes:any=[]
  private report:any={}
  private vendedorId:any

  constructor( private api:DataApiService, private auth:AuthService) { }

  ngOnInit() {
    this.vendedorId=this.auth.getCurrentUser().id
    this.getInformes()
  }

  getInformes(){
    this.api.get(`/Informes`,true,{where:{vendedorId:this.vendedorId}})
    .subscribe((informes)=>{
      this.informes=informes
    })
  }

}
