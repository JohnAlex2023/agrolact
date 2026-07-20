import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../config';
import { LoginResponse, Rol, Usuario } from '../models/usuario.model';

const TOKEN_KEY = 'agrolact_token';
const USUARIO_KEY = 'agrolact_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioSignal = signal<Usuario | null>(this.leerUsuarioGuardado());

  readonly usuario = computed(() => this.usuarioSignal());
  readonly estaAutenticado = computed(() => this.usuarioSignal() !== null);

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, { email, password }).pipe(
      tap((respuesta) => {
        localStorage.setItem(TOKEN_KEY, respuesta.data.token);
        localStorage.setItem(USUARIO_KEY, JSON.stringify(respuesta.data.usuario));
        this.usuarioSignal.set(respuesta.data.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this.usuarioSignal.set(null);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  tieneRol(...roles: Rol[]): boolean {
    const usuario = this.usuarioSignal();

    return usuario !== null && roles.includes(usuario.rol);
  }

  private leerUsuarioGuardado(): Usuario | null {
    const crudo = localStorage.getItem(USUARIO_KEY);

    return crudo ? (JSON.parse(crudo) as Usuario) : null;
  }
}
