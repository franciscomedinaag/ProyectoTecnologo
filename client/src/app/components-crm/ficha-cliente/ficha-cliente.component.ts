import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';

@Component({
  selector: 'app-ficha-cliente',
  templateUrl: './ficha-cliente.component.html',
  styleUrls: ['./ficha-cliente.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FichaClienteComponent implements OnInit {

  private id:any;
  private client:any={};

  private neg:boolean=true;
  private emp:boolean=true;
  private gir:boolean=true;
  private pue:boolean=true;
  private ema:boolean=true;
  private est:boolean=true;

  private negociaciones:any=["Residencial","Empresarial","Licitacion"];
  private estados:any=["Jalisco","CDMX","Cd. Juárez","Nuevo León","Morelia","Veracruz"];


  constructor(private activated:ActivatedRoute, private api:DataApiService) { }

  ngOnInit() {
    this.id=this.activated.snapshot.paramMap.get("id");
    this.getClient()
  }

  
  getClient(){
    this.api.get('/Clients',true,{where:{id:this.id}})
      .subscribe((client)=>{
       this.client=client[0] 
      })
  }

  assign(client:any){
    this.api.patch('/Clients',client).subscribe((edited)=>{
      this.client=edited
     })
  }

  validate(text){
    if(text!=null && text!=""){this.assign(this.client)}
    else{this.getClient();}
  }

  sendMail(){
    this.api.get('/Mails/sendEmail').subscribe((okay)=>{
      console.log("se armo")
    },
    (err) => {
      console.log("Error: ",err)
    });
  }

}
