import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { User } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ParcelasService } from 'src/app/services/parcelas/parcelas.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-finanzas',
  templateUrl: './finanzas.page.html',
  styleUrls: ['./finanzas.page.scss'],
  standalone: false,
})
export class FinanzasPage implements OnInit, AfterViewInit {
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;

  parcelas: any[] = [];
  datos: any[] = [];
  selectedExplotacion: any;
  chart!: Chart;
  chartReady = false;
  estadisticas: any;
  vistaSeleccionada: 'mensual' | 'explotacion' = 'explotacion';


  constructor(
    private parcelasService: ParcelasService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
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
    }

    this.parcelas = await this.parcelasService.getParcelasPorUsuario(
      usuario.uid
    );
    console.log(this.parcelas);

    this.datos = this.parcelas;
    this.selectedExplotacion = this.datos[0];

    this.chartReady = true;
    this.renderChart();
  }

  ngAfterViewInit() {
  if (this.chartReady && this.selectedExplotacion) {
    this.seleccionarVista(this.vistaSeleccionada);
  }
}

  cambiarExplotacion(explotacion: any) {
  this.selectedExplotacion = explotacion;

  if (this.chart) {
    this.chart.destroy();
  }

  if (this.vistaSeleccionada === 'mensual') {
    this.renderChartVariablesPorMes();
  } else {
    this.renderChart();
  }
}

  renderChart() {
  if (!this.selectedExplotacion) return;

  const labels: string[] = [];
  const data: number[] = [];

  const exp = this.selectedExplotacion;

  let totalFijos = 0;

  for (const key in exp.gastosFijos) {
    const gasto = exp.gastosFijos[key];
    let total = 0;

    if (gasto.precio_vez && gasto.veces_ano) {
      total = +gasto.precio_vez * +gasto.veces_ano;
    } else if (gasto.precio_kilo && gasto.kilosPorVez && gasto.veces_semana) {
      total = (+gasto.precio_kilo * +gasto.kilosPorVez * +gasto.veces_semana * 52) / 12;
    } else if (gasto.precio_litro && gasto.litrosPorVez && gasto.veces_semana) {
      total = (+gasto.precio_litro * +gasto.litrosPorVez * +gasto.veces_semana * 52) / 12;
    }

    labels.push(key);
    data.push(total);
    totalFijos += total;
  }

  // Gastos variables
  const variablesArray = Array.isArray(exp.gastosVariables)
    ? exp.gastosVariables.map((g: any) => g.importe)
    : [];

  const totalVariables = variablesArray.reduce((acc: number, val: number) => acc + val, 0);
  labels.push('Variables');
  data.push(totalVariables);

  const backgroundColors = labels.map((label, i) =>
    label === 'Variables'
      ? 'rgba(255, 99, 132, 0.6)'
      : `rgba(${(i * 50) % 255}, ${(i * 80) % 255}, ${(i * 100) % 255}, 0.6)`
  );

  this.chart = new Chart(this.barChartCanvas.nativeElement, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Gastos (€)',
          data,
          backgroundColor: backgroundColors,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  // Estadísticas detalladas
  const totalGastos = totalFijos + totalVariables;
  const media = data.length > 0 ? totalGastos / data.length : 0;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const desviacionEstandar = Math.sqrt(
    data.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / data.length
  );

  this.estadisticas = {
    totalFijos,
    totalVariables,
    totalGastos,
    media,
    max,
    min,
    desviacionEstandar,
  };
}

  renderChartVariablesPorMes() {
  const gastosPorMes: { [key: string]: number } = {};

  const explotacion = this.selectedExplotacion;
  if (!explotacion || !explotacion.gastosVariables) return;

  for (const gasto of explotacion.gastosVariables) {
    const fecha = new Date(gasto.fecha);
    const mes = fecha.toLocaleString('default', { month: 'long' });
    const anio = fecha.getFullYear();
    const key = `${mes} ${anio}`;
    gastosPorMes[key] = (gastosPorMes[key] || 0) + gasto.importe;
  }

  const mesesOrdenados = Object.keys(gastosPorMes).sort((a, b) => {
    const [mesA, anioA] = a.split(' ');
    const [mesB, anioB] = b.split(' ');
    const fechaA = new Date(`${mesA} 1, ${anioA}`);
    const fechaB = new Date(`${mesB} 1, ${anioB}`);
    return fechaA.getTime() - fechaB.getTime();
  });

  const data = mesesOrdenados.map((mes) => gastosPorMes[mes]);

  if (this.chart) {
    this.chart.destroy();
  }

  this.chart = new Chart(this.barChartCanvas.nativeElement, {
    type: 'bar',
    data: {
      labels: mesesOrdenados,
      datasets: [
        {
          label: 'Gastos variables por mes (€)',
          data,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Importe (€)' },
        },
        x: {
          title: { display: true, text: 'Mes' },
        },
      },
    },
  });
}

  seleccionarVista(vista: any) {
  if (vista !== 'mensual' && vista !== 'explotacion') return;

  this.vistaSeleccionada = vista;

  if (this.chart) {
    this.chart.destroy();
  }

  if (vista === 'mensual') {
    this.renderChartVariablesPorMes();
  } else {
    this.renderChart();
  }
}


}
