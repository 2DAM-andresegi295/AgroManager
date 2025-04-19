import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuComponent } from 'src/app/components/menu/menu.component';

@Component({
  selector: 'app-parcelas',
  templateUrl: './parcelas.page.html',
  styleUrls: ['./parcelas.page.scss'],
  standalone:false,
})
export class ParcelasPage implements OnInit {
  @ViewChild(MenuComponent) appMenu!: MenuComponent;


  constructor() { }

  ngOnInit() {
  }

  abrirMenuLateral() {
    //this.appMenu.abrirMenuLateral();
  }
}
