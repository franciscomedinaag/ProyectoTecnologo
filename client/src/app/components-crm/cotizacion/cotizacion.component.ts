import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {

  private subtareaId:any;
  private tratoId:any;
  private cotNumber:any;
  private subtarea:any;
  private trato:any={
    nombre:""
  };

  constructor(private activated:ActivatedRoute, private api:DataApiService) { }

  ngOnInit() {
    this.subtareaId=this.activated.snapshot.paramMap.get("subId");
    this.tratoId=this.activated.snapshot.paramMap.get("tratoId");
    this.getCoti()
  }

  getCoti(){
    this.api.get(`/Subtareas`,true,{where:{tratoId:this.tratoId,categoriaId:5}})
    .subscribe((subtareas:Array<any>)=>{
      subtareas.forEach((sub, index) => {
        if(sub.id==this.subtareaId){
          this.cotNumber=index+1
          this.subtarea=sub
          this.api.get(`/Tratos/${sub.tratoId}`)
          .subscribe((trato:Array<any>)=>{
            this.trato=trato
          })
        }
      });
    })
  }

}
