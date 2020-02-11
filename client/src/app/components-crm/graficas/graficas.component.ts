import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';
import { MiperfilComponent } from '../miperfil/miperfil.component';


@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {

  private usuario:any;
  private id:number;
  private sendPass:any={newPassword:"",id:0};
  private pass:boolean=true;
  private user:boolean=true;
  private pass1:string;
  private pass2:string;

  constructor(private auth:AuthService, private api:DataApiService, private toast:ToastService) { }

  ngOnInit() {
    this.usuario=this.auth.getCurrentUser();
  }

  validatePass(pass1:string, pass2:string){
    this.sendPass.id=this.usuario.id;
    this.sendPass.newPassword=pass1;

    if(pass1==pass2){
      this.api.post('/Usuarios/setPass',{sendPass:this.sendPass},true,null)
      .subscribe((done)=>{
        this.toast.showSuccess("Contraseña cambiada satisfactoriamente")
      })
    }
    else{
      this.toast.showError("Las contraseñas no coinciden")
    }
  }

  assign(usuario:any){
    this.api.patch('/Usuarios',usuario).subscribe((edited)=>{
      this.usuario=edited
     })
  }

}
