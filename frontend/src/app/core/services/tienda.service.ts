import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../config';
import { ApiResponse, Producto, VentaTienda } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TiendaService {
  private readonly http = inject(HttpClient);

  productos(): Observable<Producto[]> {
    return this.http.get<ApiResponse<Producto[]>>(`${API_URL}/productos`).pipe(map((r) => r.data));
  }

  crearProducto(datos: { nombre: string; unidad_medida: string }): Observable<Producto> {
    return this.http.post<ApiResponse<Producto>>(`${API_URL}/productos`, datos).pipe(map((r) => r.data));
  }

  registrarVenta(datos: {
    socio_id: string;
    producto_id: string;
    tipo: 'CONTADO' | 'FIADO';
    cantidad: number;
    precio_unitario: number;
  }): Observable<VentaTienda> {
    return this.http.post<ApiResponse<VentaTienda>>(`${API_URL}/ventas-tienda`, datos).pipe(map((r) => r.data));
  }

  fiadosPendientesPorSocio(socioId: string): Observable<VentaTienda[]> {
    return this.http
      .get<ApiResponse<VentaTienda[]>>(`${API_URL}/socios/${socioId}/fiados-pendientes`)
      .pipe(map((r) => r.data));
  }
}
