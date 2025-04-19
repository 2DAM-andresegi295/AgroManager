import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddParcelaPageRoutingModule } from './add-parcela-routing.module';

import { AddParcelaPage } from './add-parcela.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddParcelaPageRoutingModule,
    ComponentsModule
],
  declarations: [AddParcelaPage],
})
export class AddParcelaPageModule {}
