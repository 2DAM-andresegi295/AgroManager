import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';
import Parcela from 'src/app/interfaces/parcela.interface';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root',
})
export class ParcelasService {
  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async addParcela(parcela:Parcela) {
    const user = await this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const parcelaRef=collection(this.firestore,'parcela');

    return addDoc(parcelaRef,parcela)
  }
}
