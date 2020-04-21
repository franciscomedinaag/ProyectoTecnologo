import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-crm',
  templateUrl: './navbar-crm.component.html',
  styleUrls: ['./navbar-crm.component.css']
})
export class NavbarCrmComponent implements OnInit {
  public user:any;

  constructor(public auth:AuthService, public router:Router) { }

  ngOnInit() {
    this.getUser();
  }
  
  onLogout():void{
    this.auth.logoutUser();
    this.router.navigate(['/login']);
  }
  
  getUser(){
    this.user=this.auth.getCurrentUser();
  }

}
