import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SocioService } from '../../core/services/socio.service';
import { QuincenaService } from '../../core/services/quincena.service';
import { LecheService } from '../../core/services/leche.service';
import { ReporteService } from '../../core/services/reporte.service';
import { Quincena } from '../../core/models/models';

function hoyIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  readonly authService = inject(AuthService);
  private readonly socioService = inject(SocioService);
  private readonly quincenaService = inject(QuincenaService);
  private readonly lecheService = inject(LecheService);
  private readonly reporteService = inject(ReporteService);

  readonly hoy = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

  readonly quincena = signal<Quincena | null | undefined>(undefined);
  readonly sociosActivos = signal<number | null>(null);
  readonly litrosHoy = signal<number | null>(null);
  readonly adelantosPendientes = signal<number | null>(null);
  readonly fiadosPendientes = signal<number | null>(null);

  constructor() {
    this.quincenaService.actual().subscribe((q) => this.quincena.set(q));

    if (this.authService.tieneRol('ADMINISTRADOR', 'PRESIDENTE')) {
      this.socioService.listar().subscribe((socios) => this.sociosActivos.set(socios.length));
      this.reporteService.adelantosPendientes().subscribe((a) => this.adelantosPendientes.set(a.length));
    }

    if (this.authService.tieneRol('ADMINISTRADOR', 'PRESIDENTE', 'RECEPCIONISTA')) {
      this.lecheService.delDia(hoyIso()).subscribe((registros) => {
        const total = registros.reduce((suma, r) => suma + Number(r.litros), 0);
        this.litrosHoy.set(total);
      });
    }

    if (this.authService.tieneRol('ADMINISTRADOR', 'ENCARGADO_TIENDA')) {
      this.reporteService.fiadosPendientes().subscribe((f) => this.fiadosPendientes.set(f.length));
    }
  }
}
