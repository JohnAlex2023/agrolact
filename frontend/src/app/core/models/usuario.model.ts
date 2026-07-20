export type Rol = 'ADMINISTRADOR' | 'PRESIDENTE' | 'RECEPCIONISTA' | 'ENCARGADO_TIENDA';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface LoginResponse {
  status: string;
  data: {
    token: string;
    usuario: Usuario;
  };
}
