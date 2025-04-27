import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private router: Router) { }

  // Login con email/password
  async login(email: string, password: string): Promise<any> {
    try {
      const result = await signInWithEmailAndPassword(this.auth,email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }
  // Registro con email/password
  async registrar(email: string, password: string): Promise<any> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth,email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
