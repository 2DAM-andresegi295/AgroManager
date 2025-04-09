import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParcelasPageRoutingModule } from './parcelas-routing.module';

import { ParcelasPage } from './parcelas.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParcelasPageRoutingModule,
    ComponentsModule
],
  declarations: [ParcelasPage]
})
export class ParcelasPageModule {}
