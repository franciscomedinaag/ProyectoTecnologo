import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';
import { IfStmt } from '@angular/compiler';

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
  private anti:any=false;
  private antiquity:any="";
  private terminados:any=[];
  private attachment:any=" "
  private ext:any=" "
  private catalogos:any=[];

  private data:any={
    subject:" ",
    text:" ",
    to:" ",
    attachment:" "
  };

  constructor(private activated:ActivatedRoute, private api:DataApiService, private toast:ToastService) { }

  ngOnInit() {
    this.id=this.activated.snapshot.paramMap.get("id");
    this.getClient()
    this.getCat()
  }
  
  getClient(){
    let frecuente=0;
    this.api.get(`/Clients/${this.id}/getClient`)
      .subscribe((client)=>{
       this.client=client
       this.data.to=this.client.email
       this.terminados=[]
       this.client.tratos.forEach(trato => {
         if(trato.estado==1){
           this.terminados.push(trato.fechaFin)
         }
       });
       this.getAnti(this.terminados);
      this.isFrecuent();
      })
  }

  async isFrecuent(){

     let frecuente=0;
     let sixAgo=new Date();
     sixAgo.setDate(sixAgo.getDate()-180);
     this.client.tratos.forEach(trato => {
        if(trato.estado==1){
          if(trato.fechaFin>sixAgo.toISOString()){
            frecuente++;
          }
        }
      });
      if(frecuente<3){
       this.client.frecuente=false;
       this.assign(this.client);
       console.log("no")
      }
      else{
        this.client.frecuente=true;
        this.assign(this.client);
        console.log("si")
      }

  }

  getAnti(fechas:Array<string>){
    if(fechas.length){
      fechas.sort(); 
      let fecha=new Date().toISOString();
      this.antiquityCalc(fechas[0], fecha);
      this.anti=true;
    }
    else{
      this.anti=false;
    }
  }

  antiquityCalc(ultimo:String, hoy:String){
    let ult=new Date(ultimo.slice(0,10));
    let today=new Date(hoy.slice(0,10));

    var Difference_In_Time = today.getTime() - ult.getTime(); 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
    let bufferD=0;
    let bufferM=0;
    let dias=(Math.abs(Difference_In_Days))
    let meses=0;
    let años=0;
    for (let i=1;i<Math.abs(Difference_In_Days)+1;i++){
      if(bufferD==30){
        console.log("mes")
        bufferD=0;
        meses++;
        dias=dias-30;
        bufferM++;
        if(bufferM==12){
          bufferM=0;
          años++;
          meses=meses-12;
        }
      }
      bufferD++;
    }

    if(años){
      this.antiquity=años+" año, "
    }
    if(meses){
      this.antiquity=this.antiquity+meses+" meses, "
    }
    if(dias){
      this.antiquity=this.antiquity+dias+" dias. "
    }
  }


  assign(client:any){
    this.api.patch('/Clients',client).subscribe((edited)=>{
     })
  }

  validate(text){
    if(text!=null && text!=""){this.assign(this.client)}
    else{this.getClient();}
  }

  // sendMail(){
  //   this.api.get('/Mails/sendEmail').subscribe((okay)=>{
  //     console.log("se armo")
  //   },
  //   (err) => {
  //     console.log("Error: ",err)
  //   });
  // }

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

  selectImageOrder( doc:any){
    this.attachment=doc.base64File;
    this.ext=doc.fileExtention;
  }

  sendMail(data){
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
      this.data.to=this.client.email
    }
  }

  getCat(){
    this.api.get('/Catalogos')
    .subscribe((catalogos)=>{
      this.catalogos=catalogos;
    })
  }

}
