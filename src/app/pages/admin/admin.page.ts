import { Component, OnInit } from '@angular/core';
import Parcela from 'src/app/interfaces/parcela.interface';
import { ParcelasService } from 'src/app/services/parcelas/parcelas.service';

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
  }[] = [];

  constructor(private parcelasServices:ParcelasService) {

  }

  async ngOnInit() {
    this.parcelas= await this.parcelasServices.getTodasLasParcelas();
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.parcelas.forEach((parcela) => {
        // Busca si el usuario ya existe en listaUsuarios
        const usuarioExistente = this.listaUsuarios.find(
            (usuario) => usuario.correo === parcela.correo
        );

        if (usuarioExistente) {
            // Si existe, suma 1 a su numeroP
            usuarioExistente.numeroP += 1;
        } else {
            // Si no existe, agrégalo con numeroP = 1 (o parcela.numeroP si lo tienes)
            this.listaUsuarios.push({
                correo: parcela.correo,
                numeroP: 1, // O usa parcela.numeroP si necesitas otro valor inicial
            });
        }
    });
}
}


