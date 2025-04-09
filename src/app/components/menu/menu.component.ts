import { Component, OnInit, ViewChild } from '@angular/core';
import { IonMenu } from '@ionic/angular';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false,
})
export class MenuComponent  implements OnInit {
  @ViewChild(IonMenu) ionMenu!: IonMenu;

  constructor() { }

  ngOnInit() {}
  abrirMenuLateral() {
    this.ionMenu.open();
  }
}
