import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth:AuthService, private router:Router) { }

  public user:any ={
    email:"",
    password:""
  };

  ngOnInit() {
  }

  onLogin(){
    return this.auth.loginuser(this.user.email,this.user.password)
      .subscribe(succes=>{
        this.auth.setUser(succes.user);
        let token=succes.id;
        this.auth.setToken(token);
        this.router.navigate(["/clientes"])
      }, err=>{
        console.log(err)
      })
  }

}
