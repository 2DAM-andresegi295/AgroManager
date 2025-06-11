import { AuthService } from './../../services/auth/auth.service';
import { GeolocaclizacionService } from './../../services/geolocalizacion/geolocaclizacion.service';
import { ParcelasService } from './../../services/parcelas/parcelas.service';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone:false,
})
export class MapComponent implements OnInit {
  @Input() isAdd:boolean=false;
  @Input() centroExterno:google.maps.LatLngLiteral|null=null;
  @Input() parcelaExterna: google.maps.LatLngLiteral[]=[]
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  @Output() marcadorCreado = new EventEmitter<google.maps.LatLngLiteral>();

  map: google.maps.Map | undefined;
  polygon: google.maps.Polygon | undefined;
  ultimoClickLatLng: google.maps.LatLngLiteral | null=null;
  marcadores: google.maps.Marker[]=[];
  primerMarcador: boolean=false;
  parcelas: any[] = [];

  constructor(
    private geolocalizacion:GeolocaclizacionService,
    private parcelasService:ParcelasService,
    private authService:AuthService
  ) {

  }
  async ngOnInit() {
    await this.cargarMapa();
    if(this.parcelaExterna.length>0){
      this.dibujarParcela(this.parcelaExterna);
    }else{
      this.authService.usuario$.subscribe(async user => {
        if (user) {
          this.parcelas = await this.parcelasService.getParcelasPorUsuario(user.uid);
          console.log(this.parcelas);

          this.parcelas.forEach(parcela => {
            this.dibujarParcela(parcela.vertices);
          });
        }
      });
    }
  }

  cargarMapa(): Promise<void> {
    return new Promise((resolve) => {
      const loader = new Loader({
        apiKey: environment.googleMapsApiKey,
        version: "weekly",
      });

      loader.load().then(async () => {
        let centro :any;
        if(this.centroExterno!=null){
           centro= this.calcularCentroParcela(this.parcelaExterna);
        }else{
          centro = await this.geolocalizacion.getGeolocalizacion();
        }
        console.log(`Centro del mapa: ${centro.lat}, ${centro.lng}`);

        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          center: centro,
          zoom: 15,
          mapTypeId: 'hybrid',
          disableDefaultUI: true,
        });

        // Inicializa marcador principal si hay posición
        if (this.ultimoClickLatLng) {
          this.marcadores[0] = new google.maps.Marker({
            position: this.ultimoClickLatLng,
            map: this.map,
            animation: google.maps.Animation.DROP
          });
        }

        if (this.isAdd) {
          const marcador = new google.maps.Marker({
            position: this.ultimoClickLatLng,
            map: this.map,
          });

          this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (!event.latLng) return;

            this.ultimoClickLatLng = event.latLng.toJSON();
            marcador.setPosition(this.ultimoClickLatLng);
            console.log('Marcador creado en:', this.ultimoClickLatLng);
            this.marcadorCreado.emit(this.ultimoClickLatLng);
          });
        }

        resolve();
      });
    });
  }


  dibujarParcela(coordenadasParcela: google.maps.LatLngLiteral[]){
    if (!this.map) return;
    console.log('Dibujando parcela con:', coordenadasParcela);

    this.polygon = new google.maps.Polygon({
      paths: coordenadasParcela,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: false,
      draggable: false,
      map: this.map
    });
  }

  guardarMarcador(){
    if(this.primerMarcador){
      this.marcadores[this.marcadores.length-1]=new google.maps.Marker({
        position: this.ultimoClickLatLng,
        map: this.map,
        animation: google.maps.Animation.DROP
      });
    }
    else{
      this.marcadores[0]=new google.maps.Marker({
        position: this.ultimoClickLatLng,
        map: this.map,
        animation: google.maps.Animation.DROP
      });
      this.marcadores[0].setPosition(this.ultimoClickLatLng);
      this.primerMarcador=true;
    }
  }
  calcularCentroParcela(coords: google.maps.LatLngLiteral[]): google.maps.LatLngLiteral {
    let lat = 0, lng = 0;
    coords.forEach(coord => {
      lat += coord.lat;
      lng += coord.lng;
    });
    return {
      lat: lat / coords.length,
      lng: lng / coords.length
    };
  }

}
