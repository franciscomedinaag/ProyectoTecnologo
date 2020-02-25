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

  private note:any={};

  constructor(private activated:ActivatedRoute, private api:DataApiService) { }

  ngOnInit() {
    this.id=this.activated.snapshot.paramMap.get("id");
    this.getClient()
  }

  
  getClient(){
    this.api.get(`/Clients/${this.id}/getClient`)
      .subscribe((client)=>{
       this.client=client
       console.log(this.client) 
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

  createNote(note){
    note.fecha=new Date().toISOString();
    note.clientId=this.client.id; 
    this.api.post('/Notas',note).subscribe((noted)=>{
      this.note={}
      this.getClient();
    })
  }

  deleteNote(id){
    if(confirm("¿Desea eliminar la nota?")){
      this.api.delete(`/Notas/${id}`).subscribe((okay)=>{
        this.getClient();
      })
    }

  }

}
