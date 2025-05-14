import { IonInputCustomEvent, InputInputEventDetail } from '@ionic/core';
import { AuthService } from './../../services/auth/auth.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'firebase/auth';
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

  nombreParcela: any;
  tipoExplotacion: any=null;
  marcadorManual: boolean = true;
especie: any;
cabezasGanado: any;
hidratacionSemana: any;
litrosPorVez: any;
alimentacionSemana: any;
precioKilo: any;
precioSupervision: any;
frecuenciaVeterinario: any;
frecuenciaDesaparasitacion: any;
precioDesparasitacion: any;
finalidad: any;
frecuenciaRiego: any;
precioLitro: any;
frecuenciaDfertilizacion: any;
precioFertilizacion: any;
fechaRecoleccion: any;
kilosPorVez: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private parcelasService: ParcelasService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  onMarcadorCreado(vertice: google.maps.LatLngLiteral) {
    this.marcadorManual = false;
    this.ultimoClick = vertice;
    this.cdRef.detectChanges();
  }

  agregarVertice() {
    if (!this.primero&&!this.marcadorManual) {
      this.primero = true;
      this.vertices[0] = this.ultimoClick;
      this.vertices.push({ lat: 0, lng: 0 });
    } else if(!this.marcadorManual){
      this.vertices[this.vertices.length - 1] = this.ultimoClick;
      this.vertices.push({ lat: 0, lng: 0 });
    }

    if(!this.primero&&this.marcadorManual){
      if(this.mapadd){
        this.primero = true;
        this.vertices[0] = this.ultimoClick;
        this.vertices.push({ lat: 0, lng: 0 });
        console.log(this.vertices[this.vertices.length-1]);
        this.mapadd.ultimoClickLatLng=this.ultimoClick
      }
    }else if(this.marcadorManual){
      this.vertices[this.vertices.length - 1] = this.ultimoClick;
      this.vertices.push({ lat: 0, lng: 0 });
      if(this.mapadd){
        this.mapadd.ultimoClickLatLng=this.ultimoClick
      }
    }

    console.log(this.vertices);

    this.cdRef.detectChanges();
    this.mapadd?.guardarMarcador();

    this.ultimoClick = { lat: 0, lng: 0 };
  }
  async crearParcela() {
    try {
      this.vertices[this.vertices.length - 1] = this.vertices[0];

      // Espera a que el usuario esté cargado
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

      await this.parcelasService.addParcela({
        name: this.nombreParcela,
        idUsuario: usuario.uid,
        correo: usuario.email,
        vertices: this.vertices,
        tipoExplotacion: this.tipoExplotacion,
      });
      location.reload();
    } catch (error) {
      console.error(error);
    }
  }
  onManualInput($event: IonInputCustomEvent<InputInputEventDetail>) {
    this.marcadorManual=true;
  }
  get verticesReverso() {
    return [...this.vertices].reverse();
  }
}
