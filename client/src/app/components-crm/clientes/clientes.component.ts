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
    email:" ",
    frecuente:false
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
  private clientCheck:any;

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
    if(Number(this.client.telefono)){
      if(this.client.telefono.length<8 || this.client.telefono.length>=14){
        this.toast.showError("El telefono debe ser entre 8-12 caracteres");
        return;
      }
    }
    else{
      this.toast.showError("Telefono debe ser un numero")
      return;
    }
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
      .subscribe((clients:Array<any>)=>{
        this.clients=clients;
        //this.clients[clients.length-1]=clients[clients.length-1]
        this.filtered=this.clients;
        this.clientsWithEmail=this.filtered;
        this.clientsWithEmail.forEach(client => {
          this.isFrecuent(client)
          if(client.email.length<6){
            this.clientsWithEmail.pop(client);
          }
        });
      })
  }

  async isFrecuent(clienteIn){
    this.api.get(`/Clients/${clienteIn.id}/getClient`)
    .subscribe((client)=>{
      this.clientCheck=client;
      let frecuente=0;
      let sixAgo=new Date();
      sixAgo.setDate(sixAgo.getDate()-180);
      this.clientCheck.tratos.forEach(trato => {
         if(trato.estado==1){
           if(trato.fechaFin>sixAgo.toISOString()){
             frecuente++;
           }
         }
       });
       if(frecuente<3){
        this.clientCheck.frecuente=false;
        this.assign(this.clientCheck);
       }
       else{
         this.clientCheck.frecuente=true;
         this.assign(this.clientCheck);
       }
    })
 }

 assign(client:any){
  this.api.patch('/Clients',client).subscribe((edited)=>{
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
