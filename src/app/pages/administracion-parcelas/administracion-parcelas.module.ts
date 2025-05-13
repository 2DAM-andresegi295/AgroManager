import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministracionParcelasPageRoutingModule } from './administracion-parcelas-routing.module';

import { AdministracionParcelasPage } from './administracion-parcelas.page';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministracionParcelasPageRoutingModule,
    ComponentsModule,
],
  declarations: [AdministracionParcelasPage]
})
export class AdministracionParcelasPageModule {}
