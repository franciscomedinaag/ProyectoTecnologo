import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-ficha-trato',
  templateUrl: './ficha-trato.component.html',
  styleUrls: ['./ficha-trato.component.css']
})
export class FichaTratoComponent implements OnInit {

  private id:string;
  private trato:any={
    nombre:null,
    descripcion:null,
    tipo:null,
    clienteId:null,
    vendedorId:null,
    estado:0,
    fechaFin:null,
    nota:" " 
  };
  private desc:boolean=true;

  constructor(private activated:ActivatedRoute, private api:DataApiService, private toast:ToastService) { }

  ngOnInit() {
    this.id=this.activated.snapshot.paramMap.get("id");
    this.getTrato();
  }

  getTrato(){
    this.api.get(`/Tratos/${this.id}/getTrato`)
      .subscribe((trato)=>{
       this.trato=trato
      })
  }

  assignDesc(trato){
    this.api.patch(`/Tratos`,trato)
      .subscribe((trato)=>{
      })
  }

  assignNota(trato){
    if(trato.nota!=""){
      trato.estado=0;
      this.api.patch(`/Tratos`,trato)
        .subscribe((trato)=>{
          this.toast.showSuccess("Trato reabierto")
      })     
    }
    else{
     this.toast.showError("La nota está vacia")
    }
  }

  assign(trato, estado){
    let mess
      if(estado){
        mess='¿Desea cerrar el trato?'
      }
      else{
        mess='¿Desea dar por perdido el trato?'
      }

      if(confirm(mess)){
      let fecha=new Date().toISOString();
      trato.fechaFin=fecha;

      if(estado){trato.estado=1}
      else{trato.estado=2}

      this.api.patch('/Tratos',trato).subscribe((edited)=>{
        this.getTrato();
      })
    }
  }

}
