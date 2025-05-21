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

@Component({
  selector: 'app-administrador-parcelas',
  templateUrl: './administrador-parcelas.component.html',
  styleUrls: ['./administrador-parcelas.component.scss'],
  imports: [CommonModule, IonicModule, ComponentsModule],
})
export class AdministradorParcelasComponent implements OnInit {
  parcela: any;
  loading = false;
  error = null;

  // Configuración de visualización
  fieldLabels: Record<string, string> = {
    name: 'Nombre',
    tipoExplotacion: 'Tipo de Explotación',
    especie: 'Especie',
    cabezasGanado: 'Cabezas de Ganado',
    finalidad: 'Finalidad',
    fecha_sacrificio: 'Fecha de Sacrificio',
    fecha_recoleccion: 'Fecha de Recolección',
    // Puedes agregar más mapeos aquí
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private parcelasService: ParcelasService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.parcela = navigation?.extras.state;
  }

  ngOnInit() {}

  getTipoDisplay(tipo: string): string {
    return tipo === 'ganadera' ? 'Ganadera' : 'Agrícola';
  }

  getFinalidadDisplay(finalidad: string): string {
    const finalidades: Record<string, string> = {
      sacrificio: 'Para sacrificio',
      produccion_continua: 'Producción continua',
    };
    return finalidades[finalidad] || finalidad;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  async showActions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones de Parcela',
      buttons: [
        {
          text: 'Ver en Mapa',
          icon: 'map-outline',
          handler: () => this.showMap(),
        },
        {
          text: 'Calcular Costos',
          icon: 'calculator-outline',
          handler: () => this.calculateCosts(),
        },
        {
          text: 'Editar',
          icon: 'create-outline',
          handler: () => this.editParcela(),
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async showMap() {
    const modal = await this.modalCtrl.create({
      component: MapComponent,
      componentProps: {
        vertices: this.parcela.vertices,
        readOnly: true,
      },
    });
    await modal.present();
  }

  calculateCosts() {
    // Implementa tu lógica de cálculo de costos aquí
    console.log('Calculando costos...');
  }

  editParcela() {
    // Navegar a la página de edición
    console.log('Editando parcela...');
  }

  // Método para mostrar dinámicamente los gastos fijos
  displayGastosFijos(gastos: any): { label: string; value: any }[] {
    if (!gastos) return [];

    const gastosArray = [];
    for (const [key, value] of Object.entries(gastos)) {
      gastosArray.push({
        label: this.formatLabel(key),
        value: value,
      });
    }
    return gastosArray;
  }

  formatLabel(label: string): string {
    const labels: Record<string, string> = {
      hidratacion: 'Hidratación',
      alimentacion: 'Alimentación',
      desparasitacion: 'Desparasitación',
      veterinario: 'Veterinario',
      riego: 'Riego',
      fertilizacion: 'Fertilización',
    };
    return labels[label] || label;
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
  objectToArray(obj: any): Array<{key: string, value: any}> {
    if (!obj) return [];
    return Object.keys(obj).map(key => ({
      key,
      value: obj[key]
    }));
  }
}
