import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataApiService } from '../../services/data-api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-subtareas',
  templateUrl: './subtareas.component.html',
  styleUrls: ['./subtareas.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SubtareasComponent implements OnInit {

  private tratos:any=[]
  private categorias:any=[]
  private subtarea:any={
    fechaInicio:"",
    fechaFin:"",
    titulo:"",
    descripcion:"",
    estado:0,
    tratoId:"",
    categoriaId:""
  }
  private subtareas:any;
  private id:any;
  private full:any;

  constructor(private api:DataApiService, private auth:AuthService, private toast:ToastService) { }

  ngOnInit() {
    this.id=this.auth.getCurrentUser().id;
    this.getTratos()
    this.getCategorias()
    this.getSub()
    this.full=this.subtarea
  }

  getTratos(){
    this.api.get('/Tratos',true,{where:{estado:0,vendedorId:this.id}})
    .subscribe((tratos)=>{
      this.tratos=tratos
    })  
  }

  getCategorias(){
    this.api.get('/CategoriaSubs',true)
    .subscribe((categorias)=>{
      this.categorias=categorias
    })  
  }

  getSub(){
    let data={vendedorId:this.id}
    this.api.post('/Subtareas/getSubtareas', {data:data})
    .subscribe((subtareas)=>{
      this.subtareas=subtareas
      this.subtareas.forEach(s => {
        s.catName=this.categorias.find(x=>x.id==s.categoriaId).nombre
      });
    })
  }

  createSub(){
    this.subtarea.fechaInicio=new Date().toISOString();
    let fin=this.subtarea.fechaFin.split("-")
    let f= new Date(fin[2], fin[1] - 1, fin[0]).toISOString();
    this.subtarea.fechaFin=f;

    if(this.subtarea.titulo=="" || this.subtarea.fechaFin=="" || this.subtarea.descripcion=="" ||
      this.subtarea.tratoId=="" ||this.subtarea.categoriaId==""){
        this.toast.showError("Debes llenar todos los campos")
        return
    }
    else{
      this.api.post('/Subtareas',this.subtarea)
      .subscribe((okay)=>{
        this.subtarea={}
        this.getSub()
        this.toast.showSuccess("Subtarea creada")
      })
    }
  }

  seeFull(full){
    this.full=full
    console.log(this.full)
  }


}
