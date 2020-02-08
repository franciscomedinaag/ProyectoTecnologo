import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import{BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {HttpClientModule} from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';

//CRM
import { LoginComponent } from './components-crm/login/login.component';
import { ClientesComponent } from './components-crm/clientes/clientes.component';

//sitio Web
import { InicioComponent } from './components-web/inicio/inicio.component';
import { ContactoComponent } from './components-web/contacto/contacto.component';
import { MueblesComponent } from './components-web/muebles/muebles.component';
import { NosotrosComponent } from './components-web/nosotros/nosotros.component';

//servicios 
import { NavbarCrmComponent } from './services/crm/navbar-crm/navbar-crm.component';
import { FooterCrmComponent } from './services/crm/footer-crm/footer-crm.component';
import { NavbarWebsiteComponent } from './services/website/navbar-website/navbar-website.component';
import { FooterWebsiteComponent } from './services/website/footer-website/footer-website.component';
import { DataApiService } from './services/data-api.service';
import { AuthService } from './services/auth.service';
import { UsuariosComponent } from './components-crm/usuarios/usuarios.component';
import { ToastService } from './services/toast.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClientesComponent,
    InicioComponent,
    ContactoComponent,
    MueblesComponent,
    NosotrosComponent,
    NavbarCrmComponent,
    FooterCrmComponent,
    NavbarWebsiteComponent,
    FooterWebsiteComponent,
    UsuariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,  
    FormsModule,
    ToastrModule.forRoot()
  ],
  providers: [DataApiService, AuthService,ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
