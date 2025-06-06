import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {
  usuario = {
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage: string = '';




  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }
  async registrar() {
    if (this.usuario.password !== this.usuario.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...'
    });
    await loading.present();

    try {
      const result = await this.authService.registrar(
        this.usuario.email,
        this.usuario.password,
      );

      this.router.navigate(['/login']);
    } catch (error) {
      this.errorMessage = this.traducirError((error as { code: string }).code);
    } finally {
      loading.dismiss();
    }
  }
  traducirError(codigo: string): string {
    switch (codigo) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado';
      case 'auth/invalid-email':
        return 'Correo electrónico no válido';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      default:
        return 'Error al registrarse. Intenta nuevamente';
    }
  }
  get passwordMismatch(): boolean {
  return (
    !!this.usuario.password &&
    !!this.usuario.confirmPassword &&
    this.usuario.password !== this.usuario.confirmPassword
  );
}


}
