import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    canActivateChild:[privateGuard()],
    path: 'parcelas',
    loadChildren: () => import('./pages/parcelas/parcelas.module').then( m => m.ParcelasPageModule)
  },
  {
    canActivateChild:[privateGuard()],
    path: 'add-parcela',
    loadChildren: () => import('./pages/add-parcela/add-parcela.module').then( m => m.AddParcelaPageModule)
  },
  {
    canActivateChild:[privateGuard()],
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
