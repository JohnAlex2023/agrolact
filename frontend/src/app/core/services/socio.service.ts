import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../config';
import { ApiResponse, Socio } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SocioService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Socio[]> {
    return this.http.get<ApiResponse<Socio[]>>(`${API_URL}/socios`).pipe(map((r) => r.data));
  }

  obtener(id: string): Observable<Socio> {
    return this.http.get<ApiResponse<Socio>>(`${API_URL}/socios/${id}`).pipe(map((r) => r.data));
  }

  crear(datos: { nombres: string; cedula: string; celular: string }): Observable<Socio> {
    return this.http.post<ApiResponse<Socio>>(`${API_URL}/socios`, datos).pipe(map((r) => r.data));
  }

  actualizar(id: string, datos: Partial<{ nombres: string; cedula: string; celular: string; activo: boolean }>): Observable<Socio> {
    return this.http.patch<ApiResponse<Socio>>(`${API_URL}/socios/${id}`, datos).pipe(map((r) => r.data));
  }
}
