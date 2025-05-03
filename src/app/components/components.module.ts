import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonMenuButton } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import{MapComponent} from './map/map.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MenuComponent, MapComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [MenuComponent, MapComponent],

})
export class ComponentsModule {}
