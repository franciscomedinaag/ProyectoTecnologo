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

  private usuario:any;
  private id:number;
  private sendPass:any={newPassword:"",id:0};
  private pass:boolean=true;
  private user:boolean=true;
  private pass1:string;
  private pass2:string;

  private chartLabels=[]
  private chartData=[{data:[],label:''}]

  private mesesTwelveBefore=[]
  private meses=['Enero','Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  private indexMes:any;

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }
  ];

  constructor(private auth:AuthService, private api:DataApiService, private toast:ToastService) { }

  ngOnInit() {
    this.usuario=this.auth.getCurrentUser();
    this.getChartData(1);
  }

  getChartData(option:number){
    switch(option){
      case 1:{
        this.graficas1()
        break
      }
      case 2:{
        break
      }
      case 3:{
        break
      }
      case 4:{
        break
      }
      case 5:{
        break
      }
      case 6:{
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
    console.log("chartLabels: ",this.chartLabels)
    this.barChartLabels=this.chartLabels
  }

  graficas1(){
    this.setMonths()
        let año=Number(new Date().toISOString().split('-')[0])
        console.log(año)
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
          console.log("chartData", this.chartData)
          this.barChartData=this.chartData
          this.barChartData[0].label="Tratos en ultimos 12 meses"
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
