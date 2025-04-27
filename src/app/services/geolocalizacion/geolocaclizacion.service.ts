import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';


@Injectable({
  providedIn: 'root'
})
export class GeolocaclizacionService {

  constructor() { }
  async getGeolocalizacion() {
    const coordenadas = await Geolocation.getCurrentPosition();

    const latLngLiteral: google.maps.LatLngLiteral = {
      lat: coordenadas.coords.latitude,
      lng: coordenadas.coords.longitude
    };

    return latLngLiteral;
  }
}
