import { Component, OnInit,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { ComponentsModule } from "../../../components/components.module";
import { IonHeader, IonButtons, IonContent, IonToolbar, IonTitle } from "@ionic/angular/standalone";
import { ListaParcelasComponent } from "../../../components/lista-parcelas/lista-parcelas.component";
import { CommonModule } from '@angular/common';
import { ParcelasService } from 'src/app/services/parcelas/parcelas.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'firebase/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parcelas-admin',
  templateUrl: './parcelas-admin.component.html',
  styleUrls: ['./parcelas-admin.component.scss'],
  imports: [IonTitle, IonToolbar, IonContent, IonButtons, IonHeader, ComponentsModule, ListaParcelasComponent, CommonModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcelasAdminComponent  implements OnInit {
parcelas: any;

  constructor(
      private parcelasService: ParcelasService,
      private route: ActivatedRoute
    ) {}

  async ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid') || '';
      this.parcelas = await this.parcelasService.getParcelasPorUsuario(uid);
    }

}
