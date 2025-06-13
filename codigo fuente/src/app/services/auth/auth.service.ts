import { getDocs, query, where } from 'firebase/firestore';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Firestore, collection, doc, docData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioActual = new BehaviorSubject<User | null>(null);
  usuario$ = this.usuarioActual.asObservable();

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioActual.next(user);
    });
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async registrar(email: string, password: string): Promise<any> {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async isAdmin(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;

    const administradoresRef = collection(this.firestore, 'administradores');
    const q = query(administradoresRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    return querySnapshot.size>0
  }
}
