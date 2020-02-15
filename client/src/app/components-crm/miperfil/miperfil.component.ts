import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.component.html',
  styleUrls: ['./miperfil.component.css']
})
export class MiperfilComponent implements OnInit {

  private id:any;
  private usuario:any={};

  private pass:boolean=true;
  private user:boolean=true;
  private tel:boolean=true;
  private mail:boolean=true;
  private img:boolean=true;

  private pass1:string;
  private pass2:string;

  private selectedFile:File= null;

  private sendPass:any={newPassword:"",id:0};

  constructor(private activated:ActivatedRoute, private api:DataApiService, private toast:ToastService) { }

  ngOnInit() {
    this.id=this.activated.snapshot.paramMap.get("id");
    this.getUser()
  }

  getUser(){
    this.api.get('/Usuarios',true,{where:{id:this.id}})
      .subscribe((usuario)=>{
       this.usuario=usuario[0]
      })
  }
  
  assign(usuario:any){
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
      })
    }
    else{
      this.toast.showError("Las contraseñas no coinciden")
    }
  }

  selectImageOrder( img:any){
		console.log("img: ",img)
		this.api.post(`/Usuarios/${this.id}/setImage`,img).subscribe((res: any) => {
		this.toast.showSuccess("Se subio la imagen correctamente")
		},err => {
      console.log(err)
			this.toast.showError("No se subio la imagen correctamente")
		});
  }
  /*
  getImages(productId){
		this.globalId=productId
		this.api.get(`/Products/${productId}/getImages`).subscribe((images:any)=>{
			this.images = images.images;
		},err=>{
			console.log("error")
		})
  }
  */

  /*TODO
  selectImageOrder();
  y crear metodo en back para guardar la imagen que haga la relacion 
  sendGrid
  nodeMail
  */ 

  // updateProfileImage(event : any) {
  //   this.usuario.profileImage = event
  //   this.usuario.hasChangedProfileImage = true
  //   console.log("event: ",event)
  //   this.api.post("/Usuarios/"+this.id+"/changeProfileImage",this.usuario.profileImage,)
  // }
}
