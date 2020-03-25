import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//CRM
import { LoginComponent } from './components-crm/login/login.component';
import { ClientesComponent } from './components-crm/clientes/clientes.component';
import { UsuariosComponent } from './components-crm/usuarios/usuarios.component';
import { InformeVenComponent } from './components-crm/informe-ven/informe-ven.component';
import { MiperfilComponent } from './components-crm/miperfil/miperfil.component';
import { GraficasComponent } from './components-crm/graficas/graficas.component';
import { FichaClienteComponent } from './components-crm/ficha-cliente/ficha-cliente.component';
import { CatalogosComponent } from './components-crm/catalogos/catalogos.component';
import { TratosComponent } from './components-crm/tratos/tratos.component';
import { FichaTratoComponent } from './components-crm/ficha-trato/ficha-trato.component';
import { SubtareasComponent } from './components-crm/subtareas/subtareas.component';
import { PreciosFijosComponent } from './components-crm/precios-fijos/precios-fijos.component';
import { CotizacionComponent } from './components-crm/cotizacion/cotizacion.component';
import { InformeAdminComponent } from './components-crm/informe-admin/informe-admin.component';

//sitio Web
import { InicioComponent } from './components-web/inicio/inicio.component';
import { ContactoComponent } from './components-web/contacto/contacto.component';
import { MueblesComponent } from './components-web/muebles/muebles.component';
import { NosotrosComponent } from './components-web/nosotros/nosotros.component';

const routes: Routes = [
  //CRM
  {path: 'login', component: LoginComponent},
  {path: 'clientes',component: ClientesComponent},
  {path: 'usuarios',component: UsuariosComponent},
  {path: 'informesven/:id',component: InformeVenComponent},
  {path: 'informesadmn/:id',component: InformeAdminComponent},
  {path: 'miperfil/:id',component: MiperfilComponent},
  {path: 'graficas',component: GraficasComponent},
  {path: 'fichaclient/:id',component: FichaClienteComponent},
  {path: 'catalogos',component: CatalogosComponent},
  {path: 'tratos',component: TratosComponent},
  {path: 'fichatrato/:id',component: FichaTratoComponent},
  {path: 'subtareas',component: SubtareasComponent},
  {path: 'preciosfijos',component: PreciosFijosComponent},
  {path: 'cotizacion/:tratoId/:subId',component: CotizacionComponent},

  //sitio Web
  {path: 'inicio',component: InicioComponent},
  {path: 'contacto',component: ContactoComponent},
  {path: 'muebles/:id',component: MueblesComponent},
  {path: 'nosotros',component: NosotrosComponent},

  //default
  {path: '',
      redirectTo: '/inicio',
      pathMatch: 'full'
  },
  {path: '**',
      redirectTo: '/inicio',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
