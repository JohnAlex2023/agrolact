import { Component, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuincenaService } from '../../core/services/quincena.service';
import { Liquidacion, Quincena } from '../../core/models/models';

function hoyIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-quincenas-page',
  imports: [ReactiveFormsModule, SlicePipe],
  templateUrl: './quincenas-page.html',
})
export class QuincenasPage {
  private readonly fb = inject(FormBuilder);
  private readonly quincenaService = inject(QuincenaService);

  readonly actual = signal<Quincena | null>(null);
  readonly historial = signal<Quincena[]>([]);
  readonly liquidaciones = signal<Liquidacion[]>([]);
  readonly cargando = signal(true);
  readonly procesando = signal(false);
  readonly error = signal<string | null>(null);
  readonly exito = signal<string | null>(null);

  readonly formAbrir = this.fb.nonNullable.group({
    fecha_inicio: [hoyIso(), Validators.required],
    fecha_fin: [hoyIso(), Validators.required],
  });

  readonly formPrecio = this.fb.nonNullable.group({
    precio_litro: [0, [Validators.required, Validators.min(0.01)]],
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.quincenaService.actual().subscribe((quincena) => {
      this.actual.set(quincena);
      this.cargando.set(false);
    });
    this.quincenaService.listar().subscribe((quincenas) => this.historial.set(quincenas));
  }

  abrir(): void {
    if (this.formAbrir.invalid) return;

    this.procesando.set(true);
    this.error.set(null);
    const { fecha_inicio, fecha_fin } = this.formAbrir.getRawValue();

    this.quincenaService.abrir(fecha_inicio, fecha_fin).subscribe({
      next: () => {
        this.procesando.set(false);
        this.exito.set('Quincena abierta');
        this.cargar();
      },
      error: (err) => {
        this.procesando.set(false);
        this.error.set(err.error?.message ?? 'No se pudo abrir la quincena');
      },
    });
  }

  definirPrecio(): void {
    const quincena = this.actual();
    if (!quincena || this.formPrecio.invalid) return;

    this.procesando.set(true);
    this.error.set(null);

    this.quincenaService.definirPrecio(quincena.id, this.formPrecio.getRawValue().precio_litro).subscribe({
      next: (actualizada) => {
        this.procesando.set(false);
        this.actual.set(actualizada);
        this.exito.set('Precio por litro actualizado');
      },
      error: (err) => {
        this.procesando.set(false);
        this.error.set(err.error?.message ?? 'No se pudo definir el precio');
      },
    });
  }

  cerrar(): void {
    const quincena = this.actual();
    if (!quincena) return;

    if (!confirm('¿Cerrar esta quincena y generar las liquidaciones? Esta accion no se puede deshacer.')) {
      return;
    }

    this.procesando.set(true);
    this.error.set(null);

    this.quincenaService.cerrar(quincena.id).subscribe({
      next: (liquidaciones) => {
        this.procesando.set(false);
        this.liquidaciones.set(liquidaciones);
        this.exito.set('Quincena cerrada, liquidaciones generadas');
        this.cargar();
      },
      error: (err) => {
        this.procesando.set(false);
        this.error.set(err.error?.message ?? 'No se pudo cerrar la quincena');
      },
    });
  }

  verLiquidaciones(quincena: Quincena): void {
    this.quincenaService.liquidaciones(quincena.id).subscribe((liquidaciones) => this.liquidaciones.set(liquidaciones));
  }
}
