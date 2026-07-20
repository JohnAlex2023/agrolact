import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../config';
import { ApiResponse, RegistroLeche } from '../models/models';

@Injectable({ providedIn: 'root' })
export class LecheService {
  private readonly http = inject(HttpClient);

  registrar(datos: { socio_id: string; fecha: string; jornada: 'MANANA' | 'TARDE'; litros: number }): Observable<RegistroLeche> {
    return this.http.post<ApiResponse<RegistroLeche>>(`${API_URL}/registros-leche`, datos).pipe(map((r) => r.data));
  }

  delDia(fecha: string): Observable<RegistroLeche[]> {
    return this.http
      .get<ApiResponse<RegistroLeche[]>>(`${API_URL}/registros-leche`, { params: { fecha } })
      .pipe(map((r) => r.data));
  }

  corregir(registroId: string, litros: number, observacion: string): Observable<RegistroLeche> {
    return this.http
      .patch<ApiResponse<RegistroLeche>>(`${API_URL}/registros-leche/${registroId}/corregir`, { litros, observacion })
      .pipe(map((r) => r.data));
  }

  historialPorSocio(socioId: string): Observable<RegistroLeche[]> {
    return this.http
      .get<ApiResponse<RegistroLeche[]>>(`${API_URL}/socios/${socioId}/registros-leche`)
      .pipe(map((r) => r.data));
  }
}
