import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { DataApiService } from '../../data-api.service';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-navbar-crm',
  templateUrl: './navbar-crm.component.html',
  styleUrls: ['./navbar-crm.component.css']
})
export class NavbarCrmComponent implements OnInit {
  private user:any;
  notifications: any=[];

    
    constructor(private auth:AuthService, private router:Router, private api:DataApiService, private toast: ToastService) {
      // this.notiServ.Init()
     }

  ngOnInit() {
    this.getUser();
    this.getNoti();
  }
  
  onLogout():void{
    this.auth.logoutUser();
    this.router.navigate(['/login']);
  }
  
  getUser(){
    this.user=this.auth.getCurrentUser();
  }

  getNoti(){
    if(this.auth.getCurrentUser()){
      this.api.get(`/Notifications`,true,{where:{usuarioId:this.user.id,seen:false}})
      .subscribe((notis)=>{
        // console.log("Notificaciones de mi compa el ", this.auth.getCurrentUser().id,": ",notis)
        this.notifications=notis
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

}
