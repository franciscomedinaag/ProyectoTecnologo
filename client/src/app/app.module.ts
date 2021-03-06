import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import{BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

//EXT
import {ToastrModule} from 'ngx-toastr';
import {NgSelectModule} from '@ng-select/ng-select';
import {DpDatePickerModule} from 'ng2-date-picker';
import {ChartsModule} from 'ng2-charts';

//CRM
import { LoginComponent } from './components-crm/login/login.component';
import { ClientesComponent } from './components-crm/clientes/clientes.component';
import { InformeVenComponent } from './components-crm/informe-ven/informe-ven.component';
import { MiperfilComponent } from './components-crm/miperfil/miperfil.component';
import { GraficasComponent } from './components-crm/graficas/graficas.component';
import { UsuariosComponent } from './components-crm/usuarios/usuarios.component';
import { ToastService } from './services/toast.service';
import { FileChooserComponent } from './components-crm/file-chooser/file-chooser.component';
import { ProfileImageEditorComponent } from './components-crm/profile-image-editor/profile-image-editor.component';
import { FichaClienteComponent } from './components-crm/ficha-cliente/ficha-cliente.component';
import { CatalogosComponent } from './components-crm/catalogos/catalogos.component';
import { TratosComponent } from './components-crm/tratos/tratos.component';

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
import { FichaTratoComponent } from './components-crm/ficha-trato/ficha-trato.component';
import { SubtareasComponent } from './components-crm/subtareas/subtareas.component';
import { PreciosFijosComponent } from './components-crm/precios-fijos/precios-fijos.component';
import { CotizacionComponent } from './components-crm/cotizacion/cotizacion.component';
import { InformeAdminComponent } from './components-crm/informe-admin/informe-admin.component';
import { PanelComponent } from './components-crm/panel/panel.component';
import { MobiliarioCrmComponent } from './components-crm/mobiliario-crm/mobiliario-crm.component';
import { HereMapComponent } from './components-web/here-map/here-map.component';
import { PerdidoComponent } from './components-crm/perdido/perdido.component';
import { CerradoComponent } from './components-crm/cerrado/cerrado.component';

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
    UsuariosComponent,
    InformeVenComponent,
    MiperfilComponent,
    GraficasComponent,
    FileChooserComponent,
    ProfileImageEditorComponent,
    FichaClienteComponent,
    CatalogosComponent,
    TratosComponent,
    FichaTratoComponent,
    SubtareasComponent,
    PreciosFijosComponent,
    CotizacionComponent,
    InformeAdminComponent,
    PanelComponent,
    MobiliarioCrmComponent,
    HereMapComponent,
    PerdidoComponent,
    CerradoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule,
    BrowserAnimationsModule,  
    FormsModule,
    DpDatePickerModule,
    ToastrModule.forRoot(),
    ChartsModule
  ],
  providers: [DataApiService, AuthService,ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
