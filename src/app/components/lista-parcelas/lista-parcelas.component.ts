import { Component, OnInit, ViewChild } from '@angular/core';
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
  parcelas: any[]=[];
  uid: string="";
  @ViewChild('map') map: MapComponent | undefined;

  constructor(
    private parcelasService:ParcelasService,
    private activatedRoute: ActivatedRoute,
    private route:Router
  ) {}

  async ngOnInit() {
    this.uid = this.activatedRoute.snapshot.paramMap.get('uid') || '';
    this.parcelas = await this.parcelasService.getParcelasPorUsuario(this.uid);
    console.log(this.parcelas)

    if(this.parcelas.length==0){
      this.route.navigateByUrl('/admin')
    }
  }

  async eliminarParcela(parcelaId: string){
    await this.parcelasService.deleteParcela(parcelaId);
    location.reload();
  }

}
