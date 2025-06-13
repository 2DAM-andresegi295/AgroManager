import { authState } from '@angular/fire/auth';
import { AuthStateService } from './../../shared/data-access/auth-state.service';
import { Component, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false,
})
export class MenuComponent {

  @Input() contentId: string | undefined;
  @Input() title: string = 'Menú';
  @Input() items: { text: string, url: string }[] = [];

  constructor(
    private menuCtrl: MenuController,
    private authStateService:AuthStateService) {}

  navigateTo(url: string) {
    this.menuCtrl.close(this.contentId).then(() => {
      window.location.href = url;
    });
  }

  async cerrarSesion() {
    await this.authStateService.logOut();
  }
}
