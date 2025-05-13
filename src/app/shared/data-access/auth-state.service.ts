import { inject, Injectable } from "@angular/core";
import { Auth, authState, signOut } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn:'root'
})
export class AuthStateService{
  private _auth=inject(Auth);
  private _router=inject(Router);

  get authState$(): Observable<any>{
    return authState(this._auth)
  }

  async logOut() {
    try {
      await signOut(this._auth);
      localStorage.clear();
      sessionStorage.clear();
      this._router.navigateByUrl('/home');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
