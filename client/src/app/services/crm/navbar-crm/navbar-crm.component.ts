import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { DataApiService } from '../../data-api.service';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-navbar-crm',
  templateUrl: './navbar-crm.component.html',
  styleUrls: ['./navbar-crm.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarCrmComponent implements OnInit {
  private user:any;
  notifications: any=[];
  public usuarios;
  public vendedorNoti:any;
  emailNoti: any;
    
    constructor(private auth:AuthService, private router:Router, private api:DataApiService, private toast: ToastService) {
      // this.notiServ.Init()
     }

  ngOnInit() {
    this.getUser();
    this.getNoti();
    this.getUsers();
  }
  
  onLogout():void{
    this.auth.logoutUser();
    this.router.navigate(['/login']);
  }
  
  getUser(){
    this.user=this.auth.getCurrentUser();
  }

  getUsers(){
    this.api.get(`/Usuarios`,true,{where:{realm:'user',active:true}})
    .subscribe((users)=>{
      this.usuarios=users
    })
  }

  getNoti(){
    if(this.auth.getCurrentUser()){
      this.api.get(`/Notifications`,true,{where:{usuarioId:this.user.id,seen:false}})
      .subscribe((notis:any)=>{
        // console.log("Notificaciones de mi compa el ", this.auth.getCurrentUser().id,": ",notis)
        this.notifications=notis
        this.notifications.forEach(n => {
          if(n.title.includes("desea contactar con un vendedor")){
            n.contactar=true
          }
          else{
            n.contactar=false
          }
        });
        setTimeout(()=>{this.getNoti()}, 10000);
      })
    }
  }

  setSeenNavigate(noti:any){
    noti.seen=true
    this.api.patch(`/Notifications`,noti,true)
    .subscribe((edited:any)=>{
      if(noti.title.includes("la cotización")){
        let data={
          title:"El administrador ya reviso tu cotización",
          content:noti.content,
          timestamp:new Date().toISOString(),
          seen:false,
          usuarioId:0
        }

        this.api.get(`/Tratos/${data.content.split('/')[2]}`,true)
        .subscribe((trato:any)=>{
          data.usuarioId=trato.vendedorId

          this.api.post(`/Notifications`,data,true)
          .subscribe((created)=>{
            this.toast.showSuccess("El vendedor ha sido notificado")
          })
        })	
      }
      else{
        this.router.navigate([edited.content])
      }
    })
  }

  setSeen(noti:any){
    noti.seen=true
    this.api.patch(`/Notifications`,noti,true)
    .subscribe((edited:any)=>{
    })
    this.emailNoti=noti.title
  }

  sendVendedorNoti(){
    this.api.get(`/Clients`,true,{where:{email:this.emailNoti.split(" ")[4]}})
    .subscribe((client)=>{
      console.log(client)
      let noti={
        title:`Comunicate con el cliente ${client[0].nombre} !`,
        content:`/fichaclient/${client[0].id}`,
        timestamp:new Date().toISOString(),
        seen:false,
        usuarioId:this.vendedorNoti
      }
      this.api.post(`/Notifications`,noti,true)
          .subscribe((created)=>{
            this.toast.showSuccess("El vendedor ha sido notificado")
          })
    })
  }


}
