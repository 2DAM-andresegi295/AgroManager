import { AuthService } from './../../services/auth/auth.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from 'src/app/components/map/map.component';
import { ParcelasService } from 'src/app/services/parcelas/parcelas.service';

@Component({
  selector: 'app-add-parcela',
  templateUrl: './add-parcela.page.html',
  styleUrls: ['./add-parcela.page.scss'],
  standalone: false,
})
export class AddParcelaPage implements OnInit {
  @ViewChild('mapadd') mapadd: MapComponent | undefined;

  vertices: google.maps.LatLngLiteral[] = [{ lat: 0, lng: 0 }];
  primero: boolean = false;
  ultimoClick: google.maps.LatLngLiteral = { lat: 0, lng: 0 };

  constructor(
    private cdRef: ChangeDetectorRef,
    private parcelasService: ParcelasService,
    private authService: AuthService
  ) {}

  ngOnInit() {}
  onMarcadorCreado(vertice: google.maps.LatLngLiteral) {
    this.ultimoClick = vertice;

    this.cdRef.detectChanges();
  }

  agregarVertice() {
    this.cdRef.detectChanges();
    if(!this.primero){
      this.primero=true
      this.vertices[0]=this.ultimoClick;
      this.vertices.push({ lat: 0, lng: 0 });
    }else{
      this.vertices[this.vertices.length-1]=this.ultimoClick;
      this.vertices.push({ lat: 0, lng: 0 });
    }
    console.log(this.vertices);



    this.cdRef.detectChanges();
    this.mapadd?.guardarMarcador();

    this.ultimoClick = { lat: 0, lng: 0 };
  }
  async crearParcela() {
    try {
      this.vertices[this.vertices.length-1]=this.vertices[0];

      // Espera a que el usuario esté cargado
      const usuario = await new Promise<string | null>((resolve) => {
        const sub = this.authService.usuario$.subscribe(user => {
          if (user) {
            resolve(user.uid);
            sub.unsubscribe();
          }
        });
      });

      if (!usuario) {
        throw new Error('Usuario no autenticado');
      }

      await this.parcelasService.addParcela({
        name: 'prueba',
        idUsuario: usuario,
        vertices: this.vertices,
        tipoExplotacion: 'prueba',
      });

      location.reload();
    } catch (error) {
      console.error(error);
    }
  }

}
