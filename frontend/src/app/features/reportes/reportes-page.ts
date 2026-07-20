import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReporteService, ProduccionTotalItem } from '../../core/services/reporte.service';
import { SocioService } from '../../core/services/socio.service';
import { AuthService } from '../../core/services/auth.service';
import { Adelanto, Liquidacion, Socio, VentaTienda } from '../../core/models/models';

function hoyIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function primerDiaMesIso(): string {
  const hoy = new Date();
  return new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10);
}

@Component({
  selector: 'app-reportes-page',
  imports: [ReactiveFormsModule],
  templateUrl: './reportes-page.html',
})
export class ReportesPage {
  private readonly fb = inject(FormBuilder);
  private readonly reporteService = inject(ReporteService);
  private readonly socioService = inject(SocioService);
  readonly authService = inject(AuthService);

  readonly socios = signal<Socio[]>([]);
  readonly produccionTotal = signal<ProduccionTotalItem[]>([]);
  readonly estadoCuenta = signal<Liquidacion[]>([]);
  readonly socioEstadoCuenta = signal('');
  readonly adelantosPendientes = signal<Adelanto[]>([]);
  readonly fiadosPendientes = signal<VentaTienda[]>([]);

  readonly formRango = this.fb.nonNullable.group({
    desde: [primerDiaMesIso(), Validators.required],
    hasta: [hoyIso(), Validators.required],
  });

  constructor() {
    this.socioService.listar().subscribe((socios) => this.socios.set(socios));

    if (this.authService.tieneRol('ADMINISTRADOR', 'PRESIDENTE')) {
      this.consultarProduccion();
      this.reporteService.adelantosPendientes().subscribe((a) => this.adelantosPendientes.set(a));
    }

    this.reporteService.fiadosPendientes().subscribe((f) => this.fiadosPendientes.set(f));
  }

  consultarProduccion(): void {
    if (this.formRango.invalid) return;
    const { desde, hasta } = this.formRango.getRawValue();
    this.reporteService.produccionTotal(desde, hasta).subscribe((p) => this.produccionTotal.set(p));
  }

  consultarEstadoCuenta(socioId: string): void {
    this.socioEstadoCuenta.set(socioId);
    if (!socioId) {
      this.estadoCuenta.set([]);
      return;
    }
    this.reporteService.estadoCuentaPorSocio(socioId).subscribe((liq) => this.estadoCuenta.set(liq));
  }
}
