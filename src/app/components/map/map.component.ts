import { GeolocaclizacionService } from './../../services/geolocalizacion/geolocaclizacion.service';
import { ParcelasService } from './../../services/parcelas/parcelas.service';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Loader } from '@googlemaps/js-api-loader';
import { IonContent, IonButton, IonCard, IonCardContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone:false,
})
export class MapComponent implements OnInit {
  @Input() isAdd:boolean=false;
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  @Output() marcadorCreado = new EventEmitter<google.maps.LatLngLiteral>();



  map: google.maps.Map | undefined;
  polygon: google.maps.Polygon | undefined;
  ultimoClickLatLng: google.maps.LatLngLiteral | null=null;
  marcadores: google.maps.Marker[]=[];
  primerMarcador: boolean=false;

  constructor( private geolocalizacion:GeolocaclizacionService) {

  }
  ngOnInit(): void {
    this.cargarMapa();
  }

  cargarMapa() {
    const loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      version: "weekly",
    });

    loader.load().then(async ()=>{
      const centro = await this.geolocalizacion.getGeolocalizacion();
      console.log(centro.lat+""+centro.lng);

      this.map=new google.maps.Map(this.mapElement.nativeElement,{
        center: centro,
        zoom: 17,
      });
      this.marcadores[0]=new google.maps.Marker({
        position: this.ultimoClickLatLng,
        map: this.map,
        animation: google.maps.Animation.DROP
      });

      if(this.isAdd){

        this.map.addListener('click',(event: google.maps.MapMouseEvent)=>{
          if (!event.latLng) return;

          this.ultimoClickLatLng=event.latLng.toJSON();

          marcador.setPosition(this.ultimoClickLatLng);
          console.log(this.ultimoClickLatLng);
          this.marcadorCreado.emit(this.ultimoClickLatLng);
        });
        let marcador=new google.maps.Marker({
          position: this.ultimoClickLatLng,
          map: this.map,
        });
      }
    });
  }

  dibujarParcela(coordenadasParcela: google.maps.LatLngLiteral[]){
    if (!this.map) return;

    this.polygon = new google.maps.Polygon({
      paths: coordenadasParcela,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: false, // Si quieres que sea editable
      draggable: false, // Si quieres que se pueda mover
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
      //this.marcadores[this.marcadores.length-1].setPosition(this.ultimoClickLatLng);
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
    console.log(this.marcadores)
  }

}
