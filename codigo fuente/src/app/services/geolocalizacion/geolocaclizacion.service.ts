import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';



@Injectable({
  providedIn: 'root'
})
export class GeolocaclizacionService {

  constructor() { }
  async getGeolocalizacion() {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        const permissions = await Geolocation.checkPermissions();
        if (permissions.location !== 'granted') {
          await Geolocation.requestPermissions();
        }
      }

      const coordenadas: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      return {
        lat: coordenadas.coords.latitude,
        lng: coordenadas.coords.longitude
      };

    } catch (error) {
      console.error('Error al obtener geolocalización:', error);
      return null;
    }
  }
}
