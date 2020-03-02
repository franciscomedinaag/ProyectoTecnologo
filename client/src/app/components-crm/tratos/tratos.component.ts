import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-tratos',
  templateUrl: './tratos.component.html',
  styleUrls: ['./tratos.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TratosComponent implements OnInit {

  private trato:any={
    nombre:null,
    descripcion:null,
    tipo:null,
    clienteId:null,
    vendedorId:null,
    estado:0,
      fechaFin:null //abierto
  }

  private tipos:any=[
    {
      id:1,
      tipo:"Residencial"
    },
    {
      id:2,
      tipo:"Empresarial"
    },
    {
      id:3,
      tipo:"Licitación"
    }  
  ]

  private clients:any;
  private vendedores:any;
  private tratos:any;
  private current:any;
  private fechaInicio:any;
  private fechaFin:any;

  private showAct:boolean=true;
  private full:any;
  private fullA:any;
  private fullI:any;

  private client:number;

  constructor(private api:DataApiService, 
    private auth:AuthService, private toast:ToastService) { }

  ngOnInit() {
    this.getClients()
    this.getUsers()
    this.current=this.auth.getCurrentUser().realm;
    this.getTratos()

  }

   getTratos(){
    if(this.current=="admin"){
     this.api.get('/Tratos/getTratos',true)
     .subscribe((tratos)=>{
      this.full=tratos;
      if(!this.showAct){
        this.tratos=[]
        this.full.forEach(t => {
          if(t.estado!=0){
            this.tratos.push(t);
              }
            });
          this.fullA=this.tratos;
      }
      else{
        this.tratos=[];
        this.full.forEach(t => {
        if(t.estado==0){
          this.tratos.push(t);
        }
        });
        this.fullI=this.tratos;
      }
        })   
      }

      else{
        let id=this.auth.getCurrentUser().id;
        let data={
          id:id
        }
        this.api.post('/Tratos/getTratosUsuario',{data:data})
        .subscribe((tratos)=>{
          console.log(tratos)
          this.full=tratos;
          if(!this.showAct){
            this.tratos=[]
            this.full.forEach(t => {
          if(t.estado!=0){
            this.tratos.push(t);
              }
            });
          this.fullA=this.tratos;
        }
        else{
          this.tratos=[];
          this.full.forEach(t => {
        if(t.estado==0){
          this.tratos.push(t);
        }
        });
        this.fullI=this.tratos;
      }
        })  
      }
  }
      
  onSearchChange(searchValue: string) {  
        let filtered
        if(!this.showAct){
          filtered=this.fullA
        }
        else{
          filtered=this.fullI
        }
        this.tratos=[]
        filtered.forEach(trato => {
        if(trato.nombre.toLowerCase().indexOf(searchValue.toLowerCase())!=-1){
        this.tratos.push(trato);
        }
        });
  }

  filterClient(){
    if(this.client){
      let filtered
        if(!this.showAct){
          filtered=this.fullA
        }
        else{
          filtered=this.fullI
        }
        this.tratos=[]
        filtered.forEach(trato => {
          if(trato.clientId==this.client){
          this.tratos.push(trato);
          }
        });
    }
    else{
      this.getTratos()
    }
  }

  getClients(){
    this.api.get('/Clients',true)
      .subscribe((clients)=>{
        this.clients=clients;
      })
  }

  getUsers(){
    this.api.get('/Usuarios',true,{where:{realm:'user',active:true}})
    .subscribe((usuarios)=>{
      this.vendedores=usuarios;
    })
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
        this.getTratos();
      })
    }
  }

  saveTrato(){
    if(this.current=="user"){
      this.trato.vendedorId=this.auth.getCurrentUser().id;
    }
    if(this.trato.nombre==null || this.trato.descripcion==null || this.trato.tipo==null || 
    this.trato.clientId==null || this.trato.vendedorId==null){
      this.toast.showError("No se han llenado todos los campos")
    }
    else{
      this.fechaInicio=new Date().toISOString();
      this.trato.fechaInicio=this.fechaInicio;
      this.trato.fechaFin=this.fechaInicio;
      this.api.post('/Tratos',this.trato).subscribe((okay)=>{
  
        this.toast.showSuccess("Trato creado")
        this.trato={ nombre:null,
        descripcion:null,
        tipo:null,
        clienteId:null,
        vendedorId:null,
        estado:0,
        fechaFin:null};
        this.getTratos()
  
      },err=>{

        this.toast.showError("Error al subir el trato")
        this.trato={ nombre:null,
        descripcion:null,
        tipo:null,
        clienteId:null,
        vendedorId:null,
        estado:0,
        fechaFin:null};
  
      })
    }
  }

}
