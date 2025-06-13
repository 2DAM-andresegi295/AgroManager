import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddParcelaPage } from './add-parcela.page';

const routes: Routes = [
  {
    path: '',
    component: AddParcelaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddParcelaPageRoutingModule {}
