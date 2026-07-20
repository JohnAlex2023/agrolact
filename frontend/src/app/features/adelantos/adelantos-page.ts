import { Component, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdelantoService } from '../../core/services/adelanto.service';
import { SocioService } from '../../core/services/socio.service';
import { Adelanto, Socio } from '../../core/models/models';

function hoyIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-adelantos-page',
  imports: [ReactiveFormsModule, SlicePipe],
  templateUrl: './adelantos-page.html',
})
export class AdelantosPage {
  private readonly fb = inject(FormBuilder);
  private readonly adelantoService = inject(AdelantoService);
  private readonly socioService = inject(SocioService);

  readonly socios = signal<Socio[]>([]);
  readonly pendientes = signal<Adelanto[]>([]);
  readonly socioConsultado = signal<string>('');
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly exito = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    socio_id: ['', Validators.required],
    fecha: [hoyIso(), Validators.required],
    valor: [0, [Validators.required, Validators.min(0.01)]],
    abono_acordado: [0],
    observacion: [''],
  });

  constructor() {
    this.socioService.listar().subscribe((socios) => this.socios.set(socios));
  }

  registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);
    this.exito.set(null);

    const datos = this.form.getRawValue();

    this.adelantoService
      .registrar({
        socio_id: datos.socio_id,
        fecha: datos.fecha,
        valor: datos.valor,
        abono_acordado: datos.abono_acordado > 0 ? datos.abono_acordado : null,
        observacion: datos.observacion || null,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.exito.set('Adelanto registrado');
          this.form.patchValue({ valor: 0, abono_acordado: 0, observacion: '' });
        },
        error: (err) => {
          this.guardando.set(false);
          this.error.set(err.error?.message ?? 'No se pudo registrar el adelanto');
        },
      });
  }

  consultarPendientes(socioId: string): void {
    this.socioConsultado.set(socioId);
    if (!socioId) {
      this.pendientes.set([]);
      return;
    }

    this.adelantoService.pendientesPorSocio(socioId).subscribe((pendientes) => this.pendientes.set(pendientes));
  }
}
