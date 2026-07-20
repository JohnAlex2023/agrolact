import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TiendaService } from '../../core/services/tienda.service';
import { SocioService } from '../../core/services/socio.service';
import { Producto, Socio, VentaTienda } from '../../core/models/models';

@Component({
  selector: 'app-tienda-page',
  imports: [ReactiveFormsModule],
  templateUrl: './tienda-page.html',
})
export class TiendaPage {
  private readonly fb = inject(FormBuilder);
  private readonly tiendaService = inject(TiendaService);
  private readonly socioService = inject(SocioService);

  readonly productos = signal<Producto[]>([]);
  readonly socios = signal<Socio[]>([]);
  readonly fiados = signal<VentaTienda[]>([]);
  readonly socioConsultado = signal('');
  readonly guardandoProducto = signal(false);
  readonly guardandoVenta = signal(false);
  readonly error = signal<string | null>(null);
  readonly exito = signal<string | null>(null);

  readonly formProducto = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    unidad_medida: ['', Validators.required],
  });

  readonly formVenta = this.fb.nonNullable.group({
    socio_id: ['', Validators.required],
    producto_id: ['', Validators.required],
    tipo: ['CONTADO' as 'CONTADO' | 'FIADO', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(0.01)]],
    precio_unitario: [0, [Validators.required, Validators.min(0.01)]],
  });

  constructor() {
    this.cargarProductos();
    this.socioService.listar().subscribe((socios) => this.socios.set(socios));
  }

  cargarProductos(): void {
    this.tiendaService.productos().subscribe((productos) => this.productos.set(productos));
  }

  crearProducto(): void {
    if (this.formProducto.invalid) return;

    this.guardandoProducto.set(true);
    this.tiendaService.crearProducto(this.formProducto.getRawValue()).subscribe({
      next: () => {
        this.guardandoProducto.set(false);
        this.formProducto.reset({ nombre: '', unidad_medida: '' });
        this.cargarProductos();
      },
      error: (err) => {
        this.guardandoProducto.set(false);
        this.error.set(err.error?.message ?? 'No se pudo crear el producto');
      },
    });
  }

  registrarVenta(): void {
    if (this.formVenta.invalid) {
      this.formVenta.markAllAsTouched();
      return;
    }

    this.guardandoVenta.set(true);
    this.error.set(null);
    this.exito.set(null);

    this.tiendaService.registrarVenta(this.formVenta.getRawValue()).subscribe({
      next: () => {
        this.guardandoVenta.set(false);
        this.exito.set('Venta registrada');
        this.formVenta.patchValue({ cantidad: 1, precio_unitario: 0 });
      },
      error: (err) => {
        this.guardandoVenta.set(false);
        this.error.set(err.error?.message ?? 'No se pudo registrar la venta');
      },
    });
  }

  consultarFiados(socioId: string): void {
    this.socioConsultado.set(socioId);
    if (!socioId) {
      this.fiados.set([]);
      return;
    }

    this.tiendaService.fiadosPendientesPorSocio(socioId).subscribe((fiados) => this.fiados.set(fiados));
  }
}
