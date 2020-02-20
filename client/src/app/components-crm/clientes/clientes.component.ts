import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClientesComponent implements OnInit {

  private fecha:any;
  private client:any={
    telefono:" ",
    correo:" ",
    puesto:" ",
    empresa:" ",
    giro:" ",
    estado:" ", 
    email:" "
  };
  private clients:any=[];
  private filtered:any=[];
  private estados:any=["Jalisco","CDMX","Cd. Juárez","Nuevo León","Morelia","Veracruz"];
  private negociaciones:any=["Residencial","Empresarial","Licitacion"];

  constructor(private api:DataApiService, 
    private auth:AuthService,
    private router:Router,
    private toast:ToastService) { }

  ngOnInit() {
   this.getClients();
  }

  saveClient(){
      if(this.client.nombre==null || this.client.negociacion==null){
        this.toast.showError("Nombre y tipo son campos obligatorios");
        return;
      }
      this.fecha=new Date().toISOString();
      this.client.registro=this.fecha;
      this.client.cantTratos=0;
      this.client.real=false;

      this.api.post('/Clients',this.client)
      .subscribe((done)=>{
        this.toast.showSuccess("Cliente registrado")
        this.client={}
        this.getClients();
      },
      (err) => {
        this.toast.showError("Los datos introducidos son incorrectos")
      });
  }

  getClients(){
    this.api.get('/Clients',true)
      .subscribe((clients)=>{
        this.clients=clients;
        this.filtered=this.clients;
      })
  }

  onSearchChange(searchValue: string): void {  
    this.filtered=[];
    this.clients.forEach(client => {
      if(client.nombre.toLowerCase().indexOf(searchValue.toLowerCase())!=-1){
        this.filtered.push(client);
      }
    });
  }

}
