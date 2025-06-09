import { IonInputCustomEvent, InputInputEventDetail } from '@ionic/core';
import { AuthService } from './../../services/auth/auth.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from 'src/app/components/map/map.component';
import { ParcelasService } from 'src/app/services/parcelas/parcelas.service';
import { firstValueFrom } from 'rxjs';

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

  nombreParcela: any = null;
  tipoExplotacion: any = null;
  marcadorManual: boolean = true;
  especie: any = null;
  cabezasGanado: any = null;
  hidratacionSemana: any = null;
  litrosPorVez: any = null;
  alimentacionSemana: any = null;
  precioKilo: any = null;
  precioSupervision: any = null;
  frecuenciaVeterinario: any = null;
  frecuenciaDesaparasitacion: any = null;
  precioDesparasitacion: any = null;
  finalidad: any = null;
  frecuenciaRiego: any = null;
  precioLitro: any = null;
  frecuenciaDfertilizacion: any = null;
  precioFertilizacion: any = null;
  fechaRecoleccion: any = null;
  kilosPorVez: any = null;

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
    if (!this.primero && !this.marcadorManual) {
      this.primero = true;
      this.vertices[0] = this.ultimoClick;
      this.vertices.push({ lat: 0, lng: 0 });
    } else if (!this.marcadorManual) {
      this.vertices[this.vertices.length - 1] = this.ultimoClick;
      this.vertices.push({ lat: 0, lng: 0 });
    }

    if (!this.primero && this.marcadorManual) {
      if (this.mapadd) {
        this.primero = true;
        this.vertices[0] = this.ultimoClick;
        this.vertices.push({ lat: 0, lng: 0 });
        console.log(this.vertices[this.vertices.length - 1]);
        this.mapadd.ultimoClickLatLng = this.ultimoClick;
      }
    } else if (this.marcadorManual) {
      this.vertices[this.vertices.length - 1] = this.ultimoClick;
      this.vertices.push({ lat: 0, lng: 0 });
      if (this.mapadd) {
        this.mapadd.ultimoClickLatLng = this.ultimoClick;
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

      const usuario = await firstValueFrom(this.authService.usuario$);

      if (!usuario) {
        throw new Error('Usuario no autenticado');
      }

      if (this.tipoExplotacion === 'ganadera') {
        await this.parcelasService.addParcela({
          name: this.nombreParcela,
          idUsuario: usuario.uid,
          correo: usuario.email,
          vertices: this.vertices,
          tipoExplotacion: this.tipoExplotacion,
          especie: this.especie,
          cabezasGanado: this.cabezasGanado,
          finalidad: this.finalidad,
          fechaCreacion: new Date().toISOString(),
          fecha_sacrificio: this.fechaRecoleccion,
          gastosFijos: {
            hidratacion: {
              veces_semana: this.hidratacionSemana,
              litrosPorVez: this.litrosPorVez,
              precio_litro: this.precioLitro,
            },
            alimentacion: {
              veces_semana: this.alimentacionSemana,
              kilosPorVez: this.kilosPorVez,
              precio_kilo: this.precioKilo,
            },
            desparasitacion: {
              veces_ano: this.frecuenciaDesaparasitacion,
              precio_vez: this.precioDesparasitacion,
            },
            veterinario: {
              veces_ano: this.frecuenciaVeterinario,
              precio_vez: this.precioSupervision,
            },
          },
          gastosVariables: {},
        });
      } else if (this.tipoExplotacion === 'agricola') {
        await this.parcelasService.addParcela({
          name: this.nombreParcela,
          idUsuario: usuario.uid,
          correo: usuario.email,
          vertices: this.vertices,
          tipoExplotacion: this.tipoExplotacion,
          especie: this.especie,
          fechaCreacion: new Date().toISOString(),
          fecha_recoleccion: this.fechaRecoleccion,
          finanalidad: this.finalidad,
          gastosFijos: {
            riego: {
              veces_semana: this.frecuenciaRiego,
              litrosPorVez: this.litrosPorVez,
              precio_litro: this.precioLitro,
            },
            fertilizacion: {
              veces_ano: this.frecuenciaDfertilizacion,
              precio_vez: this.precioFertilizacion,
            },
            desparasitacion: {
              veces_ano: this.frecuenciaDesaparasitacion,
              precio_vez: this.precioDesparasitacion,
            },
            veterinario: {
              veces_ano: this.frecuenciaVeterinario,
              precio_vez: this.precioSupervision,
            },
          },
          gastosVariables: {},
        });
      }

      location.reload();
    } catch (error) {
      console.error(error);
    }
  }
  onManualInput($event: IonInputCustomEvent<InputInputEventDetail>) {
    this.marcadorManual = true;
  }
  get verticesReverso() {
    return [...this.vertices].reverse();
  }
  sePuedeAnadir(): boolean {
    let resultado = false;
    if (this.nombreParcela && this.tipoExplotacion && this.especie && true) {
    }
    return resultado;
  }
}
