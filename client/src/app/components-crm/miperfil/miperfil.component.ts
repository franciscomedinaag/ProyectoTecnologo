import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.component.html',
  styleUrls: ['./miperfil.component.css']
})
export class MiperfilComponent implements OnInit {

  public id:any;
  public usuario:any={imagen:""};

  public pass:boolean=true;
  public user:boolean=true;
  public tel:boolean=true;
  public mail:boolean=true;
  public img:boolean=true;

  public pass1:string;
  public pass2:string;

  public selectedFile:File= null;

  public sendPass:any={newPassword:"",id:0};

  constructor(public activated:ActivatedRoute, public api:DataApiService, 
    public toast:ToastService, public router:Router, public auth:AuthService) { }

  ngOnInit() {
    this.id=this.activated.snapshot.paramMap.get("id");
    this.getUser()
  }

  async getUser(){
    await this.api.get('/Usuarios',true,{where:{id:this.id}}).toPromise()
      .then((usuario)=>{
       this.usuario=usuario[0]      
      })
  }
  
  assign(usuario:any){
    if(Number(this.usuario.telefono)){
      if(this.usuario.telefono.length<8 || this.usuario.telefono.length>=14){
        this.toast.showError("El telefono debe ser entre 8-12 caracteres");
        this.getUser()
        return;
      }
    }
    else{
      this.toast.showError("El telefono debe ser un numero");
      this.getUser()
      return;
    }
    this.api.patch('/Usuarios',usuario).subscribe((edited)=>{
      this.usuario=edited
     })
  }

  validatePass(pass1:string, pass2:string){

    this.sendPass.id=this.id;
    this.sendPass.newPassword=pass1;

    if(pass1==pass2){
      this.api.post('/Usuarios/setPass',{sendPass:this.sendPass},true,null)
      .subscribe((done)=>{
        this.toast.showSuccess("Contraseña cambiada satisfactoriamente")
        this.onLogout()
      })
    }
    else{
      this.toast.showError("Las contraseñas no coinciden")
    }
  }

  onLogout():void{
    this.auth.logoutUser();
    this.router.navigate(['/login']);
  }

  selectImageOrder( img:any){
    console.log("Imagen: ",img)
    if(this.usuario.imagen==" " || this.usuario.imagen=="" || this.usuario.imagen==null){
		this.api.post(`/Usuarios/${this.id}/setImage`,img).subscribe((res: any) => {
    this.toast.showSuccess("Se subio la imagen correctamente")
    this.usuario=res;
    this.img=true;
		},err => {
      console.log(err)
			this.toast.showError("No se pudo subir la imagen")
    });
  }
  else{
    this.api.post(`/Usuarios/${this.id}/changeProfileImage`,img).subscribe((res:any)=>{
      this.toast.showSuccess("Se editó la imagen correctamente")
      this.usuario=res;
      this.img=true;
    },err => {
      console.log(err)
			this.toast.showError("No se pudo editar la imagen ")
    })
  }
  }
  
}
