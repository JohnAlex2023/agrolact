import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../config';
import { ApiResponse, Liquidacion, Quincena } from '../models/models';

@Injectable({ providedIn: 'root' })
export class QuincenaService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Quincena[]> {
    return this.http.get<ApiResponse<Quincena[]>>(`${API_URL}/quincenas`).pipe(map((r) => r.data));
  }

  actual(): Observable<Quincena | null> {
    return this.http.get<ApiResponse<Quincena | null>>(`${API_URL}/quincenas/actual`).pipe(map((r) => r.data));
  }

  abrir(fechaInicio: string, fechaFin: string): Observable<Quincena> {
    return this.http
      .post<ApiResponse<Quincena>>(`${API_URL}/quincenas`, { fecha_inicio: fechaInicio, fecha_fin: fechaFin })
      .pipe(map((r) => r.data));
  }

  definirPrecio(id: string, precioLitro: number): Observable<Quincena> {
    return this.http
      .patch<ApiResponse<Quincena>>(`${API_URL}/quincenas/${id}/precio`, { precio_litro: precioLitro })
      .pipe(map((r) => r.data));
  }

  cerrar(id: string): Observable<Liquidacion[]> {
    return this.http.post<ApiResponse<Liquidacion[]>>(`${API_URL}/quincenas/${id}/cerrar`, {}).pipe(map((r) => r.data));
  }

  liquidaciones(id: string): Observable<Liquidacion[]> {
    return this.http.get<ApiResponse<Liquidacion[]>>(`${API_URL}/quincenas/${id}/liquidaciones`).pipe(map((r) => r.data));
  }
}
