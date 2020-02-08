import { Component, OnInit } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  //private user:any={};

  constructor(private api:DataApiService, 
    private auth:AuthService,
    private router:Router,
    private toastr:ToastService) { }

  ngOnInit() {
    // this.user=this.auth.getCurrentUser();
    // if(this.user.active==false){
    //   this.toastr.showError('Su cuenta se encuentra inactiva');
    //   this.auth.logoutUser();
    //   this.router.navigate(['/login']);
    //}
  }

}
