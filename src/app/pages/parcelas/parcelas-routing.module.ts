import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParcelasPage } from './parcelas.page';

const routes: Routes = [
  {
    path: '',
    component: ParcelasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParcelasPageRoutingModule {}
