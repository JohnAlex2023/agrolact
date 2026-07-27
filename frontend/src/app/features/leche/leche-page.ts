import { Component, computed, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LecheService } from '../../core/services/leche.service';
import { SocioService } from '../../core/services/socio.service';
import { QuincenaService } from '../../core/services/quincena.service';
import { AuthService } from '../../core/services/auth.service';
import { Quincena, RegistroLeche, Socio } from '../../core/models/models';

type Jornada = 'manana' | 'tarde';
type EstadoCelda = 'idle' | 'guardando' | 'guardado' | 'error';
type Modo = 'dia' | 'quincena';

interface CeldaLitros {
  litros: number | null;
  registroId: string | null;
  valorGuardado: number | null;
  estado: EstadoCelda;
  mensajeError?: string;
}

interface FilaGrilla {
  socio: Socio;
  manana: CeldaLitros;
  tarde: CeldaLitros;
}

interface FilaQuincena {
  socio: Socio;
  dias: Record<string, { manana: CeldaLitros; tarde: CeldaLitros }>;
}

function celdaVacia(): CeldaLitros {
  return { litros: null, registroId: null, valorGuardado: null, estado: 'idle' };
}

function celdaDesde(registro: RegistroLeche | undefined): CeldaLitros {
  if (!registro) return celdaVacia();
  const litros = Number(registro.litros);
  return { litros, registroId: registro.id, valorGuardado: litros, estado: 'guardado' };
}

function hoyIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function rangoFechas(inicioIso: string, finIso: string): string[] {
  const fechas: string[] = [];
  let actual = new Date(inicioIso.slice(0, 10) + 'T00:00:00');
  const final = new Date(finIso.slice(0, 10) + 'T00:00:00');
  while (actual <= final) {
    fechas.push(actual.toISOString().slice(0, 10));
    actual = new Date(actual.getTime() + 24 * 60 * 60 * 1000);
  }
  return fechas;
}

@Component({
  selector: 'app-leche-page',
  imports: [SlicePipe, RouterLink],
  templateUrl: './leche-page.html',
  styleUrl: './leche-page.scss',
})
export class LechePage {
  private readonly lecheService = inject(LecheService);
  private readonly socioService = inject(SocioService);
  private readonly quincenaService = inject(QuincenaService);
  readonly authService = inject(AuthService);

  readonly modo = signal<Modo>('dia');
  readonly fecha = signal(hoyIso());
  readonly busqueda = signal('');
  readonly cargando = signal(true);
  readonly quincenaActual = signal<Quincena | null | undefined>(undefined);

  // ─── Vista de un dia ────────────────────────────────────────────
  readonly filas = signal<FilaGrilla[]>([]);

  readonly filasFiltradas = computed(() => this.filtrarPorTexto(this.filas(), (f) => f.socio));

  readonly totalManana = computed(() => this.filas().reduce((s, f) => s + (f.manana.litros ?? 0), 0));
  readonly totalTarde = computed(() => this.filas().reduce((s, f) => s + (f.tarde.litros ?? 0), 0));
  readonly totalGeneral = computed(() => this.totalManana() + this.totalTarde());
  readonly registrosGuardados = computed(
    () => this.filas().filter((f) => f.manana.registroId).length + this.filas().filter((f) => f.tarde.registroId).length,
  );

  // ─── Vista de la quincena completa ──────────────────────────────
  readonly filasQuincena = signal<FilaQuincena[]>([]);
  readonly filasQuincenaFiltradas = computed(() => this.filtrarPorTexto(this.filasQuincena(), (f) => f.socio));

  readonly diasQuincena = computed(() => {
    const q = this.quincenaActual();
    return q ? rangoFechas(q.fecha_inicio, q.fecha_fin) : [];
  });

  readonly granTotalQuincena = computed(() =>
    this.filasQuincena().reduce((s, f) => s + this.totalPorSocio(f), 0),
  );

  constructor() {
    this.quincenaService.actual().subscribe((q) => this.quincenaActual.set(q));
    this.cargar();
  }

  private filtrarPorTexto<T>(lista: T[], socioDe: (item: T) => Socio): T[] {
    const texto = this.busqueda().trim().toLowerCase();
    if (!texto) return lista;
    return lista.filter((item) => {
      const s = socioDe(item);
      return s.nombres.toLowerCase().includes(texto) || s.cedula.includes(texto);
    });
  }

  cambiarModo(modo: Modo): void {
    this.modo.set(modo);
    if (modo === 'dia') this.cargar();
    else this.cargarQuincena();
  }

  cambiarFecha(fecha: string): void {
    this.fecha.set(fecha);
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    forkJoin([this.socioService.listar(), this.lecheService.delDia(this.fecha())]).subscribe({
      next: ([socios, registros]) => {
        const filas = socios.map((socio) => ({
          socio,
          manana: celdaDesde(registros.find((r) => r.socio_id === socio.id && r.jornada === 'MANANA')),
          tarde: celdaDesde(registros.find((r) => r.socio_id === socio.id && r.jornada === 'TARDE')),
        }));
        this.filas.set(filas);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  cargarQuincena(): void {
    const q = this.quincenaActual();
    if (!q) return;

    this.cargando.set(true);
    forkJoin([this.socioService.listar(), this.lecheService.porQuincena(q.id)]).subscribe({
      next: ([socios, registros]) => {
        const dias = this.diasQuincena();
        const filas: FilaQuincena[] = socios.map((socio) => {
          const diasMap: FilaQuincena['dias'] = {};
          for (const dia of dias) {
            diasMap[dia] = {
              manana: celdaDesde(
                registros.find((r) => r.socio_id === socio.id && r.fecha.slice(0, 10) === dia && r.jornada === 'MANANA'),
              ),
              tarde: celdaDesde(
                registros.find((r) => r.socio_id === socio.id && r.fecha.slice(0, 10) === dia && r.jornada === 'TARDE'),
              ),
            };
          }
          return { socio, dias: diasMap };
        });
        this.filasQuincena.set(filas);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  totalPorSocio(fila: FilaQuincena): number {
    return Object.values(fila.dias).reduce((s, d) => s + (d.manana.litros ?? 0) + (d.tarde.litros ?? 0), 0);
  }

  sumaDia(dia: string): number {
    return this.filasQuincena().reduce((s, f) => s + (f.dias[dia].manana.litros ?? 0) + (f.dias[dia].tarde.litros ?? 0), 0);
  }

  formatearDia(diaIso: string): string {
    return new Date(diaIso + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
  }

  // ─── Guardado compartido ────────────────────────────────────────

  private persistir(
    socioId: string,
    celdaActual: CeldaLitros,
    fecha: string,
    jornada: Jornada,
    valorTexto: string,
    onCambio: (cambios: Partial<CeldaLitros>) => void,
  ): void {
    const texto = valorTexto.trim();
    if (texto === '') return;

    const numero = Number(texto.replace(',', '.'));

    if (isNaN(numero) || numero < 0) {
      onCambio({ estado: 'error', mensajeError: 'Valor invalido' });
      return;
    }

    const valor = Math.round(numero);

    if (celdaActual.valorGuardado === valor) return;

    onCambio({ litros: valor, estado: 'guardando' });
    const jornadaBackend = jornada === 'manana' ? 'MANANA' : 'TARDE';

    if (celdaActual.registroId) {
      this.lecheService.corregir(celdaActual.registroId, valor, 'Editado desde la grilla de registro').subscribe({
        next: () => onCambio({ litros: valor, valorGuardado: valor, estado: 'guardado' }),
        error: (err) => onCambio({ estado: 'error', mensajeError: err.error?.message ?? 'Error al guardar' }),
      });
    } else {
      this.lecheService.registrar({ socio_id: socioId, fecha, jornada: jornadaBackend, litros: valor }).subscribe({
        next: (registro) =>
          onCambio({ litros: valor, valorGuardado: valor, registroId: registro.id, estado: 'guardado' }),
        error: (err) => onCambio({ estado: 'error', mensajeError: err.error?.message ?? 'Error al guardar' }),
      });
    }
  }

  private actualizarCelda(socioId: string, jornada: Jornada, cambios: Partial<CeldaLitros>): void {
    this.filas.update((filas) =>
      filas.map((f) => (f.socio.id === socioId ? { ...f, [jornada]: { ...f[jornada], ...cambios } } : f)),
    );
  }

  private actualizarCeldaQuincena(socioId: string, dia: string, jornada: Jornada, cambios: Partial<CeldaLitros>): void {
    this.filasQuincena.update((filas) =>
      filas.map((f) =>
        f.socio.id === socioId
          ? { ...f, dias: { ...f.dias, [dia]: { ...f.dias[dia], [jornada]: { ...f.dias[dia][jornada], ...cambios } } } }
          : f,
      ),
    );
  }

  // ─── Vista de un dia: eventos ───────────────────────────────────

  guardarCelda(fila: FilaGrilla, jornada: Jornada, valorTexto: string): void {
    this.persistir(fila.socio.id, fila[jornada], this.fecha(), jornada, valorTexto, (cambios) =>
      this.actualizarCelda(fila.socio.id, jornada, cambios),
    );
  }

  onBlur(fila: FilaGrilla, jornada: Jornada, event: FocusEvent): void {
    this.guardarCelda(fila, jornada, (event.target as HTMLInputElement).value);
  }

  onKeydown(event: KeyboardEvent, indice: number, jornada: Jornada): void {
    const enfocar = (i: number, j: Jornada) => {
      const el = document.getElementById(`celda-${j}-${i}`) as HTMLInputElement | null;
      el?.focus();
      el?.select();
    };

    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
        event.preventDefault();
        enfocar(indice + 1, jornada);
        break;
      case 'ArrowUp':
        event.preventDefault();
        enfocar(indice - 1, jornada);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (jornada === 'tarde') enfocar(indice, 'manana');
        else enfocar(indice - 1, 'tarde');
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (jornada === 'manana') enfocar(indice, 'tarde');
        else enfocar(indice + 1, 'manana');
        break;
    }
  }

  onPaste(event: ClipboardEvent, indiceInicial: number, jornada: Jornada): void {
    const texto = event.clipboardData?.getData('text') ?? '';
    if (!texto.includes('\n') && !texto.includes('\t') && !texto.includes('\r')) return;

    event.preventDefault();
    const valores = texto
      .split(/\r?\n/)
      .map((v) => v.split('\t')[0].trim())
      .filter((v) => v.length > 0);

    const visibles = this.filasFiltradas();
    valores.forEach((valorTexto, offset) => {
      const fila = visibles[indiceInicial + offset];
      if (fila) setTimeout(() => this.guardarCelda(fila, jornada, valorTexto), offset * 120);
    });
  }

  // ─── Vista de quincena: eventos ─────────────────────────────────

  guardarCeldaQuincena(fila: FilaQuincena, dia: string, jornada: Jornada, valorTexto: string): void {
    this.persistir(fila.socio.id, fila.dias[dia][jornada], dia, jornada, valorTexto, (cambios) =>
      this.actualizarCeldaQuincena(fila.socio.id, dia, jornada, cambios),
    );
  }

  onBlurQuincena(fila: FilaQuincena, dia: string, jornada: Jornada, event: FocusEvent): void {
    this.guardarCeldaQuincena(fila, dia, jornada, (event.target as HTMLInputElement).value);
  }

  onKeydownQuincena(event: KeyboardEvent, i: number, j: number, jornada: Jornada): void {
    const totalDias = this.diasQuincena().length;
    const totalFilas = this.filasQuincenaFiltradas().length;

    const enfocar = (fila: number, dia: number, jor: Jornada) => {
      const el = document.getElementById(`qcelda-${jor}-${fila}-${dia}`) as HTMLInputElement | null;
      el?.focus();
      el?.select();
    };

    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
        event.preventDefault();
        enfocar(i + 1, j, jornada);
        break;
      case 'ArrowUp':
        event.preventDefault();
        enfocar(i - 1, j, jornada);
        break;
      case 'ArrowLeft': {
        event.preventDefault();
        let colIndex = j * 2 + (jornada === 'tarde' ? 1 : 0) - 1;
        let fila = i;
        if (colIndex < 0) {
          fila -= 1;
          colIndex = totalDias * 2 - 1;
        }
        enfocar(fila, Math.floor(colIndex / 2), colIndex % 2 === 0 ? 'manana' : 'tarde');
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        let colIndex = j * 2 + (jornada === 'tarde' ? 1 : 0) + 1;
        let fila = i;
        if (colIndex >= totalDias * 2) {
          fila += 1;
          colIndex = 0;
        }
        if (fila < totalFilas) {
          enfocar(fila, Math.floor(colIndex / 2), colIndex % 2 === 0 ? 'manana' : 'tarde');
        }
        break;
      }
    }
  }

  onPasteQuincena(event: ClipboardEvent, i: number, j: number, jornada: Jornada): void {
    const texto = event.clipboardData?.getData('text') ?? '';
    if (!texto.includes('\n') && !texto.includes('\t') && !texto.includes('\r')) return;

    event.preventDefault();
    const valores = texto
      .split(/\r?\n/)
      .map((v) => v.split('\t')[0].trim())
      .filter((v) => v.length > 0);

    const visibles = this.filasQuincenaFiltradas();
    const dias = this.diasQuincena();
    const dia = dias[j];
    if (!dia) return;

    valores.forEach((valorTexto, offset) => {
      const fila = visibles[i + offset];
      if (fila) setTimeout(() => this.guardarCeldaQuincena(fila, dia, jornada, valorTexto), offset * 120);
    });
  }
}
