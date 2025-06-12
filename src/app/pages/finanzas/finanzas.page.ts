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

    if (this.datos.length > 0) {
      this.selectedExplotacion = this.datos[0];

      // Asegurarse de esperar al ViewChild:
      setTimeout(() => {
        this.chartReady = true;
        this.seleccionarVista(this.vistaSeleccionada);
      });
    }
  }

  ngAfterViewInit() {
    if (this.selectedExplotacion) {
      setTimeout(() => {
        this.chartReady = true;
        this.seleccionarVista(this.vistaSeleccionada);
      }, 0);
    }
  }

  cambiarExplotacion(explotacion: any) {
    this.selectedExplotacion = explotacion;

    if (this.chart) {
      this.chart.destroy();
    }

    this.seleccionarVista(this.vistaSeleccionada);
  }

  renderChart() {
    if (!this.selectedExplotacion) return;

    const exp = this.selectedExplotacion;
    const fechaCreacion = new Date(exp.fechaCreacion);
    const hoy = new Date();

    const labels: string[] = [];
    const data: number[] = [];

    // 1. Gastos fijos acumulados por tipo
    for (const tipo in exp.gastosFijos) {
      const gasto = exp.gastosFijos[tipo];

      let total = 0;

      const diffMs = hoy.getTime() - fechaCreacion.getTime();
      const semanas = diffMs / (1000 * 60 * 60 * 24 * 7);
      const meses = semanas / 4.345;
      const años = semanas / 52;

      if (gasto.veces_ano && gasto.precio_vez) {
        total += gasto.veces_ano * años * gasto.precio_vez;
      } else if (
        gasto.veces_semana &&
        gasto.precio_litro &&
        gasto.litrosPorVez
      ) {
        total +=
          semanas *
          gasto.veces_semana *
          gasto.litrosPorVez *
          gasto.precio_litro;
      } else if (gasto.veces_semana && gasto.precio_kilo && gasto.kilosPorVez) {
        total +=
          semanas * gasto.veces_semana * gasto.kilosPorVez * gasto.precio_kilo;
      }

      labels.push(tipo);
      data.push(parseFloat(total.toFixed(2)));
    }

    const gastosVariables = Array.isArray(exp.gastosVariables)
      ? exp.gastosVariables
      : [];
    let totalVariables = 0;

    for (const gasto of gastosVariables) {
      if (!gasto.fecha) continue;

      const fechaGasto = new Date(gasto.fecha);
      if (fechaGasto < fechaCreacion || fechaGasto > hoy) continue;

      totalVariables += gasto.importe;
    }

    labels.push('Variables');
    data.push(parseFloat(totalVariables.toFixed(2)));

    // 3. Crear la gráfica
    if (this.chart) this.chart.destroy();

    const backgroundColors = labels.map((label, i) =>
      label === 'Variables'
        ? 'rgba(255, 99, 132, 0.6)'
        : `rgba(${(i * 60) % 255}, ${(i * 120) % 255}, ${(i * 180) % 255}, 0.6)`
    );

    const canvas = this.barChartCanvas.nativeElement;
    this.ajustarResolucionCanvas(canvas);

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Gastos acumulados desde creación (€)',
            data,
            backgroundColor: backgroundColors,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            minBarLength: 5,
            maxBarThickness: 60,
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

    const dataFijos = data.slice(0, data.length - 1);
    const dataVariables = [data[data.length - 1]];

    this.estadisticas = this.calcularEstadisticasAvanzadas(
      dataFijos,
      dataVariables
    );
  }
  calcularEstadisticasAvanzadas(dataFijos: number[], dataVariables: number[]) {
    const totalFijos = dataFijos.reduce((a, b) => a + b, 0);
    const totalVariables = dataVariables.reduce((a, b) => a + b, 0);
    const totalGastos = totalFijos + totalVariables;

    const media = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    const max = (arr: number[]) => (arr.length ? Math.max(...arr) : 0);
    const min = (arr: number[]) => (arr.length ? Math.min(...arr) : 0);

    const mediaFijos = media(dataFijos);
    const mediaVariables = media(dataVariables);

    const porcentaje = (valor: number, total: number) =>
      total ? (valor / total) * 100 : 0;

    return {
      totalFijos,
      totalVariables,
      totalGastos,
      mediaFijos,
      mediaVariables,
      maxFijos: max(dataFijos),
      maxVariables: max(dataVariables),
      minFijos: min(dataFijos),
      minVariables: min(dataVariables),

      porcentajeFijos: porcentaje(totalFijos, totalGastos),
      porcentajeVariables: porcentaje(totalVariables, totalGastos),
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

    const canvas = this.barChartCanvas.nativeElement;
    this.ajustarResolucionCanvas(canvas);
    this.chart = new Chart(canvas, {
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
            minBarLength: 5,
            maxBarThickness: 60,
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
    if (!['mensual', 'explotacion', 'semanal', 'anual'].includes(vista)) return;

    this.vistaSeleccionada = vista;

    if (this.chart) {
      this.chart.destroy();
    }

    switch (vista) {
      case 'mensual':
        this.renderChartVariablesPorPeriodo('mes');
        break;
      case 'semanal':
        this.renderChartVariablesPorPeriodo('semana');
        break;
      case 'anual':
        this.renderChartVariablesPorPeriodo('año');
        break;
      default:
        this.renderChart();
    }
  }

  ajustarResolucionCanvas(canvas: HTMLCanvasElement) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }
  estimarGastosFijos(
    gastosFijos: any,
    periodo: 'semana' | 'mes' | 'año',
    fechaInicioStr: string
  ): number {
    if (!gastosFijos || !fechaInicioStr) return 0;

    const fechaInicio = new Date(fechaInicioStr);
    const hoy = new Date();

    const diffEnMs = hoy.getTime() - fechaInicio.getTime();
    const semanas = diffEnMs / (1000 * 60 * 60 * 24 * 7);
    const meses = semanas / 4.345;
    const años = semanas / 52;

    let total = 0;

    for (const tipo in gastosFijos) {
      const gf = gastosFijos[tipo];

      if (gf.veces_ano && gf.precio_vez) {
        const veces =
          (gf.veces_ano *
            (periodo === 'año' ? años : periodo === 'mes' ? meses : semanas)) /
          (periodo === 'año' ? 1 : periodo === 'mes' ? 12 : 52);
        total += veces * gf.precio_vez;
      }

      if (gf.veces_semana && gf.precio_litro && gf.litrosPorVez) {
        const veces = gf.veces_semana * semanas;
        total += veces * gf.litrosPorVez * gf.precio_litro;
      }

      if (gf.veces_semana && gf.precio_kilo && gf.kilosPorVez) {
        const veces = gf.veces_semana * semanas;
        total += veces * gf.kilosPorVez * gf.precio_kilo;
      }
    }

    return parseFloat(total.toFixed(2));
  }

  getSemanaDelAño(fecha: Date): number {
    const primerDiaAño = new Date(fecha.getFullYear(), 0, 1);
    const diasPasados = Math.floor(
      (fecha.getTime() - primerDiaAño.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((diasPasados + primerDiaAño.getDay() + 1) / 7);
  }
  renderChartVariablesPorPeriodo(periodo: 'semana' | 'mes' | 'año') {
    const explotacion = this.selectedExplotacion;
    if (!explotacion || !explotacion.fechaCreacion) return;

    const fechaInicio = new Date(explotacion.fechaCreacion);
    const hoy = new Date();
    const gastosVariables = Array.isArray(explotacion.gastosVariables)
      ? explotacion.gastosVariables
      : [];

    const gastosPorPeriodo: { [key: string]: number } = {};
    const labels: string[] = [];

    let cursor = new Date(fechaInicio);
    while (cursor <= hoy) {
      let key: string;
      const siguiente = new Date(cursor);

      if (periodo === 'semana') {
        const semana = this.getSemanaDelAño(cursor);
        key = `Semana ${semana} ${cursor.getFullYear()}`;
        siguiente.setDate(cursor.getDate() + 7);
      } else if (periodo === 'mes') {
        key = `${cursor.toLocaleString('default', {
          month: 'long',
        })} ${cursor.getFullYear()}`;
        siguiente.setMonth(cursor.getMonth() + 1);
      } else {
        key = `${cursor.getFullYear()}`;
        siguiente.setFullYear(cursor.getFullYear() + 1);
      }

      labels.push(key);
      gastosPorPeriodo[key] = 0;
      cursor = siguiente;
    }

    for (const gasto of gastosVariables) {
      const fecha = new Date(gasto.fecha);
      let key: string;

      if (periodo === 'semana') {
        key = `Semana ${this.getSemanaDelAño(fecha)} ${fecha.getFullYear()}`;
      } else if (periodo === 'mes') {
        key = `${fecha.toLocaleString('default', {
          month: 'long',
        })} ${fecha.getFullYear()}`;
      } else {
        key = `${fecha.getFullYear()}`;
      }

      if (gastosPorPeriodo[key] === undefined) {
        gastosPorPeriodo[key] = 0;
        labels.push(key);
      }

      gastosPorPeriodo[key] += gasto.importe;
    }

    const fijoEstimado = this.estimarGastoFijoPorPeriodo(
      explotacion.gastosFijos,
      periodo
    );

    for (const key of labels) {
      gastosPorPeriodo[key] += fijoEstimado;
    }

    const data = labels.map((key) =>
      parseFloat(gastosPorPeriodo[key].toFixed(2))
    );

    if (this.chart) {
      this.chart.destroy();
    }

    const canvas = this.barChartCanvas.nativeElement;
    this.ajustarResolucionCanvas(canvas);

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: `Gasto total (${periodo})`,
            data,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            minBarLength: 5,
            maxBarThickness: 60,
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
            title: {
              display: true,
              text: periodo.charAt(0).toUpperCase() + periodo.slice(1),
            },
          },
        },
      },
    });
  }

  estimarGastoFijoPorPeriodo(
    gastosFijos: any,
    periodo: 'semana' | 'mes' | 'año'
  ) {
    let total = 0;

    for (const tipo in gastosFijos) {
      const g = gastosFijos[tipo];

      if (g.veces_ano && g.precio_vez) {
        const veces =
          periodo === 'año'
            ? g.veces_ano
            : periodo === 'mes'
            ? g.veces_ano / 12
            : g.veces_ano / 52;
        total += veces * g.precio_vez;
      }

      if (g.veces_semana && g.precio_litro && g.litrosPorVez) {
        const veces =
          periodo === 'semana'
            ? g.veces_semana
            : periodo === 'mes'
            ? g.veces_semana * 4.345
            : g.veces_semana * 52;
        total += veces * g.litrosPorVez * g.precio_litro;
      }

      if (g.veces_semana && g.precio_kilo && g.kilosPorVez) {
        const veces =
          periodo === 'semana'
            ? g.veces_semana
            : periodo === 'mes'
            ? g.veces_semana * 4.345
            : g.veces_semana * 52;
        total += veces * g.kilosPorVez * g.precio_kilo;
      }
    }

    return total;
  }
}
