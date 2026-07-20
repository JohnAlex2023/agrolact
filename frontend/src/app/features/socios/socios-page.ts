import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocioService } from '../../core/services/socio.service';
import { Socio } from '../../core/models/models';

@Component({
  selector: 'app-socios-page',
  imports: [ReactiveFormsModule],
  templateUrl: './socios-page.html',
})
export class SociosPage {
  private readonly fb = inject(FormBuilder);
  private readonly socioService = inject(SocioService);

  readonly socios = signal<Socio[]>([]);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly mostrarFormulario = signal(false);
  readonly editando = signal<Socio | null>(null);
  readonly historialSocio = signal<Socio | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombres: ['', Validators.required],
    cedula: ['', Validators.required],
    celular: ['', Validators.required],
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.socioService.listar().subscribe({
      next: (socios) => {
        this.socios.set(socios);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  nuevoSocio(): void {
    this.editando.set(null);
    this.form.reset({ nombres: '', cedula: '', celular: '' });
    this.mostrarFormulario.set(true);
  }

  editar(socio: Socio): void {
    this.editando.set(socio);
    this.form.setValue({ nombres: socio.nombres, cedula: socio.cedula, celular: socio.celular });
    this.mostrarFormulario.set(true);
  }

  cancelar(): void {
    this.mostrarFormulario.set(false);
    this.editando.set(null);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);
    const datos = this.form.getRawValue();
    const socioEditando = this.editando();

    const peticion = socioEditando
      ? this.socioService.actualizar(socioEditando.id, datos)
      : this.socioService.crear(datos);

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarFormulario.set(false);
        this.cargar();
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err.error?.message ?? 'No se pudo guardar el socio');
      },
    });
  }

  verHistorial(socio: Socio): void {
    this.socioService.obtener(socio.id).subscribe((detalle) => this.historialSocio.set(detalle));
  }

  cerrarHistorial(): void {
    this.historialSocio.set(null);
  }
}
