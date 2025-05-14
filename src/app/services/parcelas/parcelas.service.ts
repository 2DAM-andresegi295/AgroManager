import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import Parcela from 'src/app/interfaces/parcela.interface';
import { Auth, User } from '@angular/fire/auth';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ParcelasService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async addParcela(parcela: any) {
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
    } else {
      const parcelaRef = collection(this.firestore, 'parcelas');
      return addDoc(parcelaRef, parcela);
    }
  }

  async getParcelasPorUsuario(idUsuario: string) {
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
    } else {
      const parcelasRef = collection(this.firestore, 'parcelas');
      const q = query(parcelasRef, where('idUsuario', '==', idUsuario));
      const querySnapshot = await getDocs(q);

      const parcelas = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return parcelas;
    }
  }
  async getTodasLasParcelas() {
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
    } else {
      const parcelasRef = collection(this.firestore, 'parcelas');
      const querySnapshot = await getDocs(parcelasRef);

      const parcelas = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return parcelas;
    }
  }

  async deleteParcela(parcelaId: string) {
    const parcelaDocRef = doc(this.firestore, 'parcelas', parcelaId);
    return deleteDoc(parcelaDocRef);
  }

  async deleteParcelasPorUsuario(idUsuario: string) {
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
    } else {
      const parcelasRef = collection(this.firestore, 'parcelas');
      const q = query(parcelasRef, where('idUsuario', '==', idUsuario));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(this.firestore, 'parcelas', docSnapshot.id))
      );

      return Promise.all(deletePromises);
    }
  }
}
