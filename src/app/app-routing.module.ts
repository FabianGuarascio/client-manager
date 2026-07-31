import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ClienteFormComponent } from './features/clientes/cliente-form/cliente-form.component';
import { AuthGuard } from './core/guards/auth.guard';

// TODO(Fase 6): reemplazar 'clientes' por ClienteListComponent cuando exista
// el listado; 'clientes/nuevo' va a quedar como ruta separada para el alta.
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'clientes', component: ClienteFormComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
