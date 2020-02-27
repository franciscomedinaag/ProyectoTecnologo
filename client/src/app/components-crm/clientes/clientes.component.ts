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
  private data:any={
    subject:" ",
    text:" ",
    to:" ",
    attachment:" "
  };

  private clients:any=[];
  private filtered:any=[];
  private estados:any=["Jalisco","CDMX","Cd. Juárez","Nuevo León","Morelia","Veracruz"];
  private negociaciones:any=["Residencial","Empresarial","Licitacion"];
  private clientsWithEmail:any=[];
  private catalogos:any=[];
  private attachment:any=" "
  private ext:any=" "
  private cat:boolean=null;

  constructor(private api:DataApiService, 
    private auth:AuthService,
    private router:Router,
    private toast:ToastService) { }

  ngOnInit() {
   this.getClients();
   this.getCat();
  }

  getCat(){
    this.api.get('/Catalogos')
    .subscribe((catalogos)=>{
      this.catalogos=catalogos;
    })
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
        this.clientsWithEmail=clients;

        this.clientsWithEmail.forEach(client => {
          if(client.email.length<5){
            this.clientsWithEmail.pop(client);
          }
        });

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

  sendMail(data){
    if(data.to!=" "){
    data.to=ClientesComponent.formatTo(data.to);
    }
    if(data.subject==" " || data.to==" "){
     this.toast.showError("No se han llenado todos los campos");
    }
    else{
      data.attachment=this.attachment;
      data.ext=this.ext;
      if(data.ext==" "){
        let base=this.api.baseURL
        data.attachment=base+data.attachment;
      }
      
      this.api.post('/Mails/sendEmail',{data:data}).subscribe((okay)=>{
        this.toast.showSuccess("Correo mandado con exito")
        this.attachment=" ";
        this.ext=" ";
      },
      (err) => {
        this.toast.showError("Revisa tu conexión de red")
      });

      this.data={}
    }
  }


  private static formatTo(contacts){
    let lista:string="";

    contacts.forEach(contact => {
      lista=lista+contact+", "
    });
    return lista.slice(0,lista.length-2);
  }

  selectImageOrder( doc:any){
    this.attachment=doc.base64File;
    this.ext=doc.fileExtention;
  }

}
