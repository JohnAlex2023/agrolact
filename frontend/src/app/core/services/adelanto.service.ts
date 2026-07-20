import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../config';
import { Adelanto, ApiResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AdelantoService {
  private readonly http = inject(HttpClient);

  registrar(datos: {
    socio_id: string;
    fecha: string;
    valor: number;
    abono_acordado?: number | null;
    observacion?: string | null;
  }): Observable<Adelanto> {
    return this.http.post<ApiResponse<Adelanto>>(`${API_URL}/adelantos`, datos).pipe(map((r) => r.data));
  }

  pendientesPorSocio(socioId: string): Observable<Adelanto[]> {
    return this.http
      .get<ApiResponse<Adelanto[]>>(`${API_URL}/socios/${socioId}/adelantos-pendientes`)
      .pipe(map((r) => r.data));
  }
}
