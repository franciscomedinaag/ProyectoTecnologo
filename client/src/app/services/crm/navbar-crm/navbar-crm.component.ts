import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-crm',
  templateUrl: './navbar-crm.component.html',
  styleUrls: ['./navbar-crm.component.css']
})
export class NavbarCrmComponent implements OnInit {
  private user:any;

  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit() {
    this.getUser();
  }
  
  onLogout():void{
    console.log("logout")
    this.auth.logoutUser();
    this.router.navigate(['/login']);
  }
  
  getUser(){
    this.user=this.auth.getCurrentUser();
    console.log("tipo: ",this.user.realm)
  }

}
