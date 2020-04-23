import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { DataApiService } from '../../data-api.service';

@Component({
  selector: 'app-navbar-crm',
  templateUrl: './navbar-crm.component.html',
  styleUrls: ['./navbar-crm.component.css']
})
export class NavbarCrmComponent implements OnInit {
  private user:any;
  notifications: any=[];

    
    constructor(private auth:AuthService, private router:Router, private api:DataApiService) {
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
    this.api.get(`/Notifications`,true,{where:{usuarioId:this.user.id,seen:false}})
    .subscribe((notis)=>{
      console.log("Notificaciones de mi compa el ", this.user.id,": ",notis)
      this.notifications=notis
      setTimeout(()=>{this.getNoti()}, 10000);
    })
  }

  setSeenNavigate(noti:any){
    noti.seen=true
    this.api.patch(`/Notifications`,noti,true)
    .subscribe((edited:any)=>{
      this.router.navigate([edited.content])
    })
  }

}
