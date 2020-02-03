import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {HttpClientModule} from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

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
    FooterWebsiteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DataApiService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
