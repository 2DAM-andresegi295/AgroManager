import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class ParcelasService {

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth) { }

    async addParcela(nombre: string, coordenadas: google.maps.LatLngLiteral[], tipo:string) {
      const user = await this.afAuth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');

      return this.firestore.collection('parcelas').add({
        userId: user.uid,
        nombre,
        coordenadas,
        tipo,
        fechaCreacion: new Date(),
      });
    }
}
