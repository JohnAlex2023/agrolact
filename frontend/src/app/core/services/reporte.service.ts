import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../config';
import { Adelanto, ApiResponse, Liquidacion, VentaTienda } from '../models/models';

export interface ProduccionSocio {
  socio_id: string;
  desde: string;
  hasta: string;
  total_litros: number;
}

export interface ProduccionTotalItem {
  socio_id: string;
  total_litros: string;
  socio: { id: string; nombres: string };
}

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly http = inject(HttpClient);

  produccionPorSocio(socioId: string, desde: string, hasta: string): Observable<ProduccionSocio> {
    return this.http
      .get<ApiResponse<ProduccionSocio>>(`${API_URL}/reportes/produccion/${socioId}`, { params: { desde, hasta } })
      .pipe(map((r) => r.data));
  }

  produccionTotal(desde: string, hasta: string): Observable<ProduccionTotalItem[]> {
    return this.http
      .get<ApiResponse<ProduccionTotalItem[]>>(`${API_URL}/reportes/produccion`, { params: { desde, hasta } })
      .pipe(map((r) => r.data));
  }

  estadoCuentaPorSocio(socioId: string): Observable<Liquidacion[]> {
    return this.http
      .get<ApiResponse<Liquidacion[]>>(`${API_URL}/reportes/estado-cuenta/${socioId}`)
      .pipe(map((r) => r.data));
  }

  adelantosPendientes(): Observable<Adelanto[]> {
    return this.http.get<ApiResponse<Adelanto[]>>(`${API_URL}/reportes/adelantos-pendientes`).pipe(map((r) => r.data));
  }

  fiadosPendientes(): Observable<VentaTienda[]> {
    return this.http.get<ApiResponse<VentaTienda[]>>(`${API_URL}/reportes/fiados-pendientes`).pipe(map((r) => r.data));
  }
}
