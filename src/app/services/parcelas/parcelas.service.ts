import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import Parcela from 'src/app/interfaces/parcela.interface';
import { Auth} from '@angular/fire/auth';


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

    const parcelaRef=collection(this.firestore,'parcelas');

    return addDoc(parcelaRef,parcela)
  }

  async getParcelasPorUsuario(idUsuario: string){
    const parcelasRef = collection(this.firestore, 'parcelas');
    const q = query(parcelasRef, where('idUsuario', '==', idUsuario));
    const querySnapshot = await getDocs(q);

    const parcelas = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return parcelas;

  }
}
