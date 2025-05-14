import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParcelasPage } from './parcelas.page';
import { AdministradorParcelasComponent } from 'src/app/components/administrador-parcelas/administrador-parcelas.component';

const routes: Routes = [
  {
    path: '',
    component: ParcelasPage
  },
  {
    path:'administrar/:id',
    component: AdministradorParcelasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParcelasPageRoutingModule {}
