import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DataApiService } from '../../services/data-api.service';
import { ToastService } from '../../services/toast.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {

  public usuario:any;
  public id:number;
  public sendPass:any={newPassword:"",id:0};
  public pass:boolean=true;
  public user:boolean=true;
  public pass1:string;
  public pass2:string;

  public chartLabels=[]
  public chartData=[{data:[],label:''}]

  public mesesTwelveBefore=[]
  public meses=['Enero','Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  public indexMes:any;
  public showCats=false
  public showComents=false
  public categorias=[]

  public barChartOptions: ChartOptions = {
    responsive: true
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
  ];
  public otros: any;
  public comentarios: any=[];

  constructor(public auth:AuthService, public api:DataApiService, public toast:ToastService) { }

  ngOnInit() {
    this.usuario=this.auth.getCurrentUser();
    this.getChartData(1);
  }

  getChartData(option:number){
    this.barChartLabels=[]
    this.barChartData=[{data:[],label:''},{data:[],label:''}]
    this.showCats=false
    this.otros=[]
    this.comentarios=[]
    this.showComents=false

    switch(option){
      case 1:{
        this.chartData=[{data:[],label:''}]
        this.graficas1()
        break
      }
      case 2:{
        this.graficas2()
        break
      }
      case 3:{
        this.chartData[0]={data:[0,0,0,0,0,0,0,0,0,0,0,0],label:'WE'}
        this.barChartData[0]={data:[0,0,0,0,0,0,0,0,0,0,0,0],label:'WE'}
        this.graficas3()
        break
      }
      case 4:{
        this.graficas4()
        break
      }
      case 5:{
        this.graficas5()
        break
      }
      case 6:{
        this.graficas6()
        break
      }
    }
  }

  setMonths(){
    let mes=new Date().toLocaleDateString().split('/')[1]
    this.indexMes=Number(mes)-1

    this.meses.forEach((m,index) => {
      if(this.indexMes==-1){
        this.indexMes=11
      }
      this.mesesTwelveBefore[index]=this.meses[this.indexMes]
      this.indexMes-=1  
    });

    this.chartLabels=['Abiertos','Cerrados','Perdidos']
    console.log(this.mesesTwelveBefore)
    this.barChartLabels=this.chartLabels
  }

  graficas1(){
    this.setMonths()
        let año=Number(new Date().toISOString().split('-')[0])
        this.api.get(`/Tratos`,true)
        .subscribe((tratos:any)=>{
          tratos.forEach((t,index) => {
            /*
              Contar tratos abierts
            */
              if(Number(t.fechaInicio.split('-')[0])==año){
                //trato inicio este año
                if( isNaN(this.chartData[0].data[0]) ){ this.chartData[0].data[0]=1 }
                else{ this.chartData[0].data[0]+=1 }
              }
              else if(Number(t.fechaInicio.split('-')[0])==año-1) {
                //trato inicio año pasado
                let mesesPasado=[]
                mesesPasado=this.meses
                mesesPasado=mesesPasado.slice(this.indexMes+1, 12)
                
                if(mesesPasado.includes(this.meses[t.fechaInicio.split('-')[1]-1])){
                  if( isNaN(this.chartData[0].data[0]) ){ this.chartData[0].data[0]=1 }
                  else{ this.chartData[0].data[0]+=1 }
                }
              }

            /*
              Contar cerrados y perdidos
            */
           if(Number(t.fechaFin.split('-')[0])==año){
            //trato termino este año
            if(t.estado==1){
              if( isNaN(this.chartData[0].data[1]) ){ this.chartData[0].data[1]=1 }
              else{ this.chartData[0].data[1]+=1 }
            } 
            else if(t.estado==2){
              if( isNaN(this.chartData[0].data[2]) ){ this.chartData[0].data[2]=1 }
              else{ this.chartData[0].data[2]+=1 }
            }
          }
          else if(Number(t.fechaFin.split('-')[0])==año-1) {
            //trato termino año pasado
            let mesesPasado=[]
            mesesPasado=this.meses
            mesesPasado=mesesPasado.slice(this.indexMes+1, 12)
            
            if(mesesPasado.includes(this.meses[t.fechaFin.split('-')[1]-1])){
              if(t.estado==1){
                if( isNaN(this.chartData[0].data[1]) ){ this.chartData[0].data[1]=1 }
                else{ this.chartData[0].data[1]+=1 }
              } 
              else if(t.estado==2){
                if( isNaN(this.chartData[0].data[2]) ){ this.chartData[0].data[2]=1 }
                else{ this.chartData[0].data[2]+=1 }
              }
            }
          }
          });
          this.barChartData=this.chartData
          this.barChartData[0].label="Tratos en ultimos 12 meses"
        })
  }

  graficas2(){
    this.barChartData[0].label='Subtarea actual de los tratos activos'
    let data={
      estado:0
    }
    this.api.post(`/Tratos/getTratosEstado`,{data:data})
    .subscribe((abiertos:any)=>{
      this.barChartLabels=[]
      abiertos.forEach((t, index) => {
        this.barChartLabels.push(t.nombre)
        this.barChartData[0].data.push(t.subtareas[t.subtareas.length - 1].categoriaId)
      });
      
      this.api.get(`/CategoriaSubs`,true)
      .subscribe((cats:any)=>{
        this.showCats=true
        this.categorias=cats
      })

      console.log("graficos 2", this.barChartData[0].data)
    })
  }

  graficas3(){
    this.barChartData[0].label="Monto vendido en los ultimos 12 meses"
    this.setMonths()
    this.barChartLabels=this.mesesTwelveBefore.reverse()

    let año=Number(new Date().toISOString().split('-')[0])
    let mes=Number(new Date().toISOString().split('-')[1])

    this.api.get(`/Tratos`,true)
    .subscribe((tratos:any)=>{
      tratos.forEach((t,index) => {
        /*
          Contar cerrados 
        */
       if(Number(t.fechaFin.split('-')[0])==año && t.estado==1){
        //trato termino este año
          this.sold(t.id,(this.chartData[0].data.length-1)-(mes-Number(t.fechaFin.split('-')[1])))  
      }
      else if(Number(t.fechaFin.split('-')[0])==año-1) {
        //trato termino año pasado
        let mesesPasado=[]
        mesesPasado=this.meses
        mesesPasado=mesesPasado.slice(this.indexMes+1, 12)
        
        if(mesesPasado.includes(this.meses[t.fechaFin.split('-')[1]-1])){
          if(t.estado==1){
            if((t.fechaFin.split('-')[1]-1)>this.meses.indexOf(this.mesesTwelveBefore[0])){
              this.sold(t.id,(t.fechaFin.split('-')[1]-1)-(this.meses.indexOf(this.mesesTwelveBefore[0]))) 
            }
          } 
        }
      }
      });
      // this.barChartData=this.chartData
      console.log("aqui?")
    })
    console.log("this.barChartData[0].data en la funcion 3", this.barChartData[0].data)

    return
  }

  sold(tratoId:number, i){
    this.api.get(`/Tratos/${tratoId}/getSold`)
    .subscribe((vendido:any)=>{
      this.chartData[0].data[i]+= vendido.vendido
      this.barChartData[0].data[i]+=vendido.vendido
      console.log("this.barChartData[0].data", this.barChartData[0].data)
    })
  }

  graficas4(){
    this.barChartData[0].label='Motivo de venta'
    this.barChartData[1].label='Desempeño productos'
    this.barChartLabels=['Buen precio - Excelente', 'Mejor que competencia - Bueno', 'Atencion - Regular', 'Otro - Deficiente']
    this.api.get(`/Cerrados`,true)
    .subscribe((cerrados:any)=>{
      console.log(cerrados)
      
      cerrados.forEach(c => {
        /*
        respuesta 1
        */
        if(c.respuesta1=='a'){
          if(typeof this.barChartData[0].data[0]=='number'){
            // this.barChartData[0].data[0]+=1
            let x:any=this.barChartData[0].data[0]
            x+=1
            this.barChartData[0].data[0]=x
          }
          else{
            this.barChartData[0].data[0]=1
          }
        }
        else if(c.respuesta1=='b'){
          if(typeof this.barChartData[0].data[1]=='number'){
            // this.barChartData[0].data[1]+=1
            let x:any=this.barChartData[0].data[1]
            x+=1
            this.barChartData[0].data[1]=x
          }
          else{
            this.barChartData[0].data[1]=1
          }
        }
        else if(c.respuesta1=='c'){
          if(typeof this.barChartData[0].data[2]=='number'){
            let x:any=this.barChartData[0].data[2]
            x+=1
            this.barChartData[0].data[2]=x
          }
          else{
            this.barChartData[0].data[2]=1
          }
        }
        else{
          if(typeof this.barChartData[0].data[3]=='number'){
            // this.barChartData[0].data[3]+=1
            let x:any=this.barChartData[0].data[3]
            x+=1
            this.barChartData[0].data[3]=x
          }
          else{
            this.barChartData[0].data[3]=1
          }
         this.otros.push(c.respuesta1)
        }


        /*
        respuesta 2
        */
       if(c.respuesta2=='a'){
        if(typeof this.barChartData[1].data[0]=='number'){
          // this.barChartData[1].data[0]+=1
          let x:any=this.barChartData[1].data[0]
          x+=1
          this.barChartData[1].data[0]=x
        }
        else{
          this.barChartData[1].data[0]=1
        }
      }
      else if(c.respuesta2=='b'){
        if(typeof this.barChartData[1].data[1]=='number'){
          // this.barChartData[1].data[1]+=1
          let x:any=this.barChartData[1].data[1]
          x+=1
          this.barChartData[1].data[1]=x
        }
        else{
          this.barChartData[1].data[1]=1
        }
      }
      else if(c.respuesta2=='c'){
        if(typeof this.barChartData[1].data[2]=='number'){
          // this.barChartData[1].data[2]+=1
          let x:any=this.barChartData[1].data[2]
          x+=1
          this.barChartData[1].data[2]=x
        }
        else{
          this.barChartData[1].data[2]=1
        }
      }
      else{
        //otros
        if(typeof this.barChartData[1].data[3]=='number'){
          // this.barChartData[1].data[3]+=1
          let x:any=this.barChartData[1].data[3]
          x+=1
          this.barChartData[1].data[3]=x
        }
        else{
          this.barChartData[1].data[3]=1
        }
      }

      /*
        respuesta 3
      */
      this.comentarios.push(c.respuesta3)
      this.showComents=true
      });
    })
  }


  graficas5(){
    this.barChartData[0].label='Motivo de cancelación'
    this.barChartData[1].label='Atencion del vendedor'
    this.barChartLabels=['Precio Alto - Excelente', 'Mejor $ competencia - Bueno', 'Falta atencion - Regular', 'Otro - Deficiente']
    this.api.get(`/Perdidos`,true)
    .subscribe((perdidos:any)=>{
      console.log(perdidos)
      
      perdidos.forEach(c => {
        /*
        respuesta 1
        */
        if(c.respuesta1=='a'){
          if(typeof this.barChartData[0].data[0]=='number'){
            // this.barChartData[0].data[0]+=1
            let x:any=this.barChartData[0].data[0]
            x+=1
            this.barChartData[0].data[0]=x
          }
          else{
            this.barChartData[0].data[0]=1
          }
        }
        else if(c.respuesta1=='b'){
          if(typeof this.barChartData[0].data[1]=='number'){
            // this.barChartData[0].data[1]+=1
            let x:any=this.barChartData[0].data[1]
            x+=1
            this.barChartData[0].data[1]=x
          }
          else{
            this.barChartData[0].data[1]=1
          }
        }
        else if(c.respuesta1=='c'){
          if(typeof this.barChartData[0].data[2]=='number'){
            // this.barChartData[0].data[2]+=1
            let x:any=this.barChartData[0].data[2]
            x+=1
            this.barChartData[0].data[2]=x
          }
          else{
            this.barChartData[0].data[2]=1
          }
        }
        else{
          if(typeof this.barChartData[0].data[3]=='number'){
            // this.barChartData[0].data[3]+=1
            let x:any=this.barChartData[0].data[3]
            x+=1
            this.barChartData[0].data[3]=x
          }
          else{
            this.barChartData[0].data[3]=1
          }
          this.otros.push(c.respuesta1)
        }

        /*
        respuesta 2
        */
       if(c.respuesta2=='a'){
        if(typeof this.barChartData[1].data[0]=='number'){
          // this.barChartData[1].data[0]+=1
          let x:any=this.barChartData[1].data[0]
            x+=1
            this.barChartData[1].data[0]=x
        }
        else{
          this.barChartData[1].data[0]=1
        }
      }
      else if(c.respuesta2=='b'){
        if(typeof this.barChartData[1].data[1]=='number'){
          // this.barChartData[1].data[1]+=1
          let x:any=this.barChartData[1].data[1]
            x+=1
            this.barChartData[1].data[1]=x
        }
        else{
          this.barChartData[1].data[1]=1
        }
      }
      else if(c.respuesta2=='c'){
        if(typeof this.barChartData[1].data[2]=='number'){
          // this.barChartData[1].data[2]+=1
          let x:any=this.barChartData[1].data[2]
            x+=1
            this.barChartData[1].data[2]=x
        }
        else{
          this.barChartData[1].data[2]=1
        }
      }
      else{
        if(typeof this.barChartData[1].data[3]=='number'){
          // this.barChartData[1].data[3]+=1
          let x:any=this.barChartData[1].data[3]
            x+=1
            this.barChartData[1].data[3]=x
        }
        else{
          this.barChartData[1].data[3]=1
        }
      }

      /*
        respuesta 3
      */
     this.comentarios.push(c.respuesta3)
     this.showComents=true

      });
    })
  }

  graficas6(){
    //CONTAR COTIZACIONES
    this.barChartData[0].label='Intentos de cotizacion por trato'

    let countEachTrato=[1]
    this.api.get(`/Subtareas/getSubtareasCoti`,true)
    .subscribe((subs:any)=>{
      for(let i = 1; i<subs.length;i++){
        if(subs[i].tratoId!=subs[i-1].tratoId){
          if(isNaN(countEachTrato[countEachTrato.length])){
            countEachTrato[countEachTrato.length]=1
          }
          else{
            countEachTrato[countEachTrato.length]+=1
          }
        }
        else{
          if(isNaN(countEachTrato[countEachTrato.length-1])){
            countEachTrato[countEachTrato.length-1]=1
          }
          else{
            countEachTrato[countEachTrato.length-1]+=1
          }
        }
      }

      this.barChartData[0].data[0]=0
      console.log(countEachTrato.sort((a, b) => a - b))
      countEachTrato.sort((a, b) => a - b).forEach(intento => {
        if(!this.barChartLabels.includes(intento +' intento(s)')){
          this.barChartLabels.push(intento+' intento(s)')
          //NUEVO ELEMENTO
          this.barChartData[0].data[this.barChartData[0].data.length]=0
        }
      //SUMARLE AL ULTIMO ELEMENTO
        let x:any=this.barChartData[0].data[this.barChartData[0].data.length-1]
          x+=1
          this.barChartData[0].data[this.barChartData[0].data.length-1]=x
      });

      this.barChartData[0].data.shift()

    })
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
