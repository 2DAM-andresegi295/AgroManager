import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinanzasPageRoutingModule } from './finanzas-routing.module';

import { FinanzasPage } from './finanzas.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinanzasPageRoutingModule,
    ComponentsModule
],
  declarations: [FinanzasPage]
})
export class FinanzasPageModule {}
