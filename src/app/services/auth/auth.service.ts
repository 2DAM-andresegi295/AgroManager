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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioActual = new BehaviorSubject<User | null>(null);
  usuario$ = this.usuarioActual.asObservable();

  constructor(
    private auth: Auth,
    private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioActual.next(user);
    });
  }

  // Login con email/password
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
  // Registro con email/password
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

  getUsuario() {
    return this.usuarioActual.value?.uid || "";
  }
}
