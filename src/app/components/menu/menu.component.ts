import { Component, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  template: `
    <ion-menu [contentId]="contentId" [menuId]="contentId">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ title }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item
            *ngFor="let item of items"
            button
            (click)="navigateTo(item.url)">
            <ion-label>{{ item.text }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>
  `,
  standalone: false,
})
export class MenuComponent {
  @Input() contentId: string | undefined;
  @Input() title: string = 'Menú';
  @Input() items: { text: string, url: string }[] = [];

  constructor(private menuCtrl: MenuController) {}

  navigateTo(url: string) {
    this.menuCtrl.close(this.contentId).then(() => {
      window.location.href = url; // Solución definitiva para la navegación
    });
  }
}
