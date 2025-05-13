import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonicModule} from '@ionic/angular';
import { ParcelasService } from 'src/app/services/parcelas/parcelas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../map/map.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../components.module';

@Component({
  selector: 'app-lista-parcelas',
  templateUrl: './lista-parcelas.component.html',
  styleUrls: ['./lista-parcelas.component.scss'],
  imports: [CommonModule, IonicModule,ComponentsModule],
})
export class ListaParcelasComponent  implements OnInit {
  @Input() parcelas: any[]=[];
  @ViewChild('map') map: MapComponent | undefined;

  constructor(
    private parcelasService:ParcelasService,
    private router: Router
  ) {}

  async ngOnInit() {
    console.log(this.parcelas)
  }

  async eliminarParcela(parcelaId: string){
    await this.parcelasService.deleteParcela(parcelaId);
    location.reload();
  }

  administrarParcela(parcela: any){
    this.router.navigate(['parcelas/administracion-parcelas',parcela.id], {
      state: { parcela }  // Envía el objeto completo en el estado
    });
  }

}
