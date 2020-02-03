import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-crm',
  templateUrl: './navbar-crm.component.html',
  styleUrls: ['./navbar-crm.component.css']
})
export class NavbarCrmComponent implements OnInit {

  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit() {
  }

  onLogout():void{
    console.log("logout")
    this.auth.logoutUser();
    this.router.navigate(['/login']);
  }

}
