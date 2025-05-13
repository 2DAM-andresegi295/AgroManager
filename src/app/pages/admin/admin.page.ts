import { Component, OnInit } from '@angular/core';
import Parcela from 'src/app/interfaces/parcela.interface';
import { ParcelasService } from 'src/app/services/parcelas/parcelas.service';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false,
})
export class AdminPage implements OnInit {

  parcelas: any[] = [];
  listaUsuarios: {
    correo: any;
    numeroP: number;
    uid: string
  }[] = [];

  constructor(
    private parcelasServices: ParcelasService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.parcelas = await this.parcelasServices.getTodasLasParcelas();
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.parcelas.forEach((parcela) => {
      const usuarioExistente = this.listaUsuarios.find(
        (usuario) => usuario.correo === parcela.correo
      );

      if (usuarioExistente) {
        usuarioExistente.numeroP += 1;
      } else {
        this.listaUsuarios.push({
          correo: parcela.correo,
          numeroP: 1,
          uid: parcela.idUsuario
        });
      }
    });
  }
  irListaPartcelas(uid: string) {
    this.router.navigate(['admin', 'parcelas', uid]);
  }

  irHome(){
    this.router.navigate(['home']);
  }
  eliminarTodasLasParcelas(uid: string) {

  }
}
