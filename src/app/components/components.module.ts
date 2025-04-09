import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import{MapComponent} from './map/map.component';

@NgModule({
  declarations: [MenuComponent, MapComponent],
  imports: [CommonModule, IonicModule],
  exports: [MenuComponent, MapComponent],

})
export class ComponentsModule {}
