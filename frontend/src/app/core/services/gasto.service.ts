import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../config';
import { ApiResponse, GastoOperativo } from '../models/models';

@Injectable({ providedIn: 'root' })
export class GastoService {
  private readonly http = inject(HttpClient);

  registrar(datos: { concepto: string; valor: number }): Observable<GastoOperativo> {
    return this.http.post<ApiResponse<GastoOperativo>>(`${API_URL}/gastos-operativos`, datos).pipe(map((r) => r.data));
  }

  delaActual(): Observable<GastoOperativo[]> {
    return this.http
      .get<ApiResponse<GastoOperativo[]>>(`${API_URL}/gastos-operativos/actual`)
      .pipe(map((r) => r.data));
  }
}
