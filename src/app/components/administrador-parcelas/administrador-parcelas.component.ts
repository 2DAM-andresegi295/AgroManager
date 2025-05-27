import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ParcelasService } from '../../services/parcelas/parcelas.service';
import {
  ActionSheetController,
  IonicModule,
  ModalController,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../components.module';
import { MapComponent } from '../map/map.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-administrador-parcelas',
  templateUrl: './administrador-parcelas.component.html',
  styleUrls: ['./administrador-parcelas.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
  ],
})
export class AdministradorParcelasComponent implements OnInit {
  parcela: any;
  editable = false;
  id: string | null = '';

  mostrarModalGasto = false;

  nuevoGasto = {
    tipo: '',
    importe: null,
    fecha: '',
  };

  constructor(
    private route: ActivatedRoute,
    private parcelasService: ParcelasService
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.parcela = await this.parcelasService.getParcelaById(this.id);
    }
    console.log(this.parcela);
  }

  cambiarModo() {
    this.editable = !this.editable;
  }

  guardarCambios() {
    this.editable = false;
    console.log('Parcela guardada:', this.parcela);
    if (this.id) {
      this.parcelasService.actualizarParcela(this.id, this.parcela);
    }
  }
  anadirGastosVariables() {
    this.nuevoGasto = {
      tipo: '',
      importe: null,
      fecha: new Date().toISOString(),
    };
    this.mostrarModalGasto = true;
  }
  cerrarModal() {
    this.mostrarModalGasto = false;
  }

  guardarGastoVariable() {
    const { tipo, importe, fecha } = this.nuevoGasto;
    if (!tipo || importe == null || !fecha) {
      alert('Por favor, completa todos los campos');
      return;
    }

    if (!Array.isArray(this.parcela.gastosVariables)) {
      this.parcela.gastosVariables = [];
    }

    this.parcela.gastosVariables.push({ tipo, importe, fecha });
    this.mostrarModalGasto = false;
    if (this.id) {
      this.parcelasService.actualizarParcela(this.id, this.parcela);
    }

    console.log('Gasto añadido:', this.parcela.gastosVariables);
  }
  eliminarGastoVariable(index: number) {
    this.parcela.gastosVariables.splice(index, 1);
    if (this.id) {
      this.parcelasService.actualizarParcela(this.id, this.parcela);
    }
  }
}
