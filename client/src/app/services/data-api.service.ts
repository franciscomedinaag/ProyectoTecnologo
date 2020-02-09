import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class DataApiService {
  constructor(private http: HttpClient, private authService: AuthService) {this.getToken();}
  books: Observable<any>;
  book: Observable<any>;

  public headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});
  public baseURL: string = "http://localhost:3000/api"
  public token: string = "";

  public getToken() {
    this.token = localStorage.getItem("accessToken")
  }

  private genLink(endPoint: string, useToken: boolean,filter:any=false): string {
    let link=this.baseURL+endPoint;
    let params=0;
    if(filter) { 
     link+= `${(params==0)?'?':'&'}filter=`+JSON.stringify(filter);
     params++;
   }
    if(!(!useToken || !(this.token.length > 0 && this.token != ""))) { 
     
      link+= `${(params==0)?'?':'&'}access_token=`+this.token;
      params++;
    }
    return link;
  }


  /**
   * Metodo get para conectarse con la api
   * @param endPoint string con el end pint a usar ej: "Usuarios/1"
   * @param useToken boolean para  intentar usar token en la peticion default: true
   */
  public get(endPoint: string, useToken:boolean = true,filter={}): Observable<object>{
    let link: string = this.genLink(endPoint, useToken,filter);
    return this.http.get<JSON>(link);
      // retry(this.retryAttempts),
      // catchError(err =>this.handleError(err, link))
  }

  /**
   * Metodo post para conectarse con la api
   * @param endPoint string con el end pint a usar ej: "Usuarios/1"
   * @param body object objeto para enviar al servidor
   * @param useToken boolean para  intentar usar token en la peticion default: true
   */
  public post(endPoint: string, body: object, useToken:boolean = true,filter={}): Observable<object>{
    let link: string = this.genLink(endPoint, useToken,filter);
    return this.http.post(link, body, { headers: this.headers })  
    .pipe(map(data => data));
  }
  
  public patch(endPoint: string, body: object, useToken:boolean = true,filter={}): Observable<object>{
    let link: string = this.genLink(endPoint, useToken,filter);
    return this.http.patch(link, body, { headers: this.headers })  
    .pipe(map(data => data));
  }
}