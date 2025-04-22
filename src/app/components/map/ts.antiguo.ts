import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Loader } from '@googlemaps/js-api-loader';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone:false,
})
export class MapComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  @Output() clickParcela=new EventEmitter<void>();

  map: google.maps.Map | undefined;
  polygon: google.maps.Polygon | undefined;

  // Coordenadas de ejemplo para una parcela (lat, lng)
  parcelCoordinates: google.maps.LatLngLiteral[] = [
    { lat: 19.4326, lng: -99.1332 },  // Esquina noroeste
    { lat: 19.4326, lng: -99.1232 },  // Esquina noreste
    { lat: 19.4226, lng: -99.1232 },  // Esquina sureste
    { lat: 19.4226, lng: -99.1332 },  // Esquina suroeste
    { lat: 19.4326, lng: -99.1332 }   // Cierra el polígono
  ];

  constructor() { }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    const loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      version: "weekly",
    });

    loader.load().then(() => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: this.calculateCenter(this.parcelCoordinates),
        zoom: 15,
      });

      this.drawParcel();
    });
  }

  drawParcel() {
    if (!this.map) return;

    this.polygon = new google.maps.Polygon({
      paths: this.parcelCoordinates,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: false, // Si quieres que sea editable
      draggable: false, // Si quieres que se pueda mover
      map: this.map
    });

    this.polygon.addListener('click', () => {
      this.clickParcela.emit(); // Emitir el evento al hacer clic en la parcela
    });


    // Ajustar el zoom para que se vea toda la parcela
    const bounds = new google.maps.LatLngBounds();
    this.parcelCoordinates.forEach(coord => {
      bounds.extend(coord);
    });
    this.map.fitBounds(bounds);
  }

  calculateCenter(coords: google.maps.LatLngLiteral[]): google.maps.LatLngLiteral {
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
