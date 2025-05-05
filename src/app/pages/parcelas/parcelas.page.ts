import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuComponent } from 'src/app/components/menu/menu.component';
import { IonContent } from '@ionic/angular/standalone';
import { ParcelasService } from 'src/app/services/parcelas/parcelas.service';
import { User } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-parcelas',
  templateUrl: './parcelas.page.html',
  styleUrls: ['./parcelas.page.scss'],
  standalone: false,
})
export class ParcelasPage implements OnInit {
  parcelas: any;

  constructor(
    private parcelasService: ParcelasService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const usuario = await new Promise<User | null>((resolve) => {
      const sub = this.authService.usuario$.subscribe((user) => {
        if (user) {
          resolve(user);
          sub.unsubscribe();
        }
      });
    });
    if (!usuario) {
      throw new Error('Usuario no autenticado');
    }
    this.parcelas = await this.parcelasService.getParcelasPorUsuario(
      usuario?.uid
    );
  }
}
