import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LecheService } from '../../core/services/leche.service';
import { SocioService } from '../../core/services/socio.service';
import { RegistroLeche, Socio } from '../../core/models/models';

function hoyIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-leche-page',
  imports: [ReactiveFormsModule],
  templateUrl: './leche-page.html',
})
export class LechePage {
  private readonly fb = inject(FormBuilder);
  private readonly lecheService = inject(LecheService);
  private readonly socioService = inject(SocioService);

  readonly socios = signal<Socio[]>([]);
  readonly registros = signal<RegistroLeche[]>([]);
  readonly fechaConsulta = signal(hoyIso());
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly exito = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    socio_id: ['', Validators.required],
    fecha: [hoyIso(), Validators.required],
    jornada: ['MANANA' as 'MANANA' | 'TARDE', Validators.required],
    litros: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    this.socioService.listar().subscribe((socios) => this.socios.set(socios));
    this.cargarDelDia();
  }

  cargarDelDia(): void {
    this.cargando.set(true);
    this.lecheService.delDia(this.fechaConsulta()).subscribe({
      next: (registros) => {
        this.registros.set(registros);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  cambiarFechaConsulta(fecha: string): void {
    this.fechaConsulta.set(fecha);
    this.cargarDelDia();
  }

  registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);
    this.exito.set(null);

    this.lecheService.registrar(this.form.getRawValue()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.exito.set('Registro guardado correctamente');
        this.form.patchValue({ litros: 0 });
        this.cargarDelDia();
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err.error?.message ?? 'No se pudo registrar la entrega');
      },
    });
  }
}
