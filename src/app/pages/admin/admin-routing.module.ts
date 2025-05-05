import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';
import { ListaParcelasComponent } from 'src/app/components/lista-parcelas/lista-parcelas.component';
import { ParcelasAdminComponent } from './parcelas-admin/parcelas-admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },
  {
    path:'parcelas/:uid',
    component: ParcelasAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
