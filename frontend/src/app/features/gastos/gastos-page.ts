import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GastoService } from '../../core/services/gasto.service';
import { GastoOperativo } from '../../core/models/models';

@Component({
  selector: 'app-gastos-page',
  imports: [ReactiveFormsModule],
  templateUrl: './gastos-page.html',
})
export class GastosPage {
  private readonly fb = inject(FormBuilder);
  private readonly gastoService = inject(GastoService);

  readonly gastos = signal<GastoOperativo[]>([]);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly exito = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    concepto: ['', Validators.required],
    valor: [0, [Validators.required, Validators.min(0.01)]],
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.gastoService.delaActual().subscribe((gastos) => this.gastos.set(gastos));
  }

  registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);
    this.exito.set(null);

    this.gastoService.registrar(this.form.getRawValue()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.exito.set('Gasto registrado');
        this.form.reset({ concepto: '', valor: 0 });
        this.cargar();
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err.error?.message ?? 'No se pudo registrar el gasto');
      },
    });
  }

  get totalGastos(): number {
    return this.gastos().reduce((suma, g) => suma + Number(g.valor), 0);
  }
}
