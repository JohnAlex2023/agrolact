import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Rol } from '../../core/models/usuario.model';

interface ItemNav {
  ruta: string;
  etiqueta: string;
  roles: Rol[];
}

const ITEMS_NAV: ItemNav[] = [
  { ruta: '/', etiqueta: 'Inicio', roles: ['ADMINISTRADOR', 'PRESIDENTE', 'RECEPCIONISTA', 'ENCARGADO_TIENDA'] },
  { ruta: '/socios', etiqueta: 'Socios', roles: ['ADMINISTRADOR', 'PRESIDENTE'] },
  { ruta: '/leche', etiqueta: 'Registro de leche', roles: ['ADMINISTRADOR', 'PRESIDENTE', 'RECEPCIONISTA'] },
  { ruta: '/quincenas', etiqueta: 'Quincenas', roles: ['ADMINISTRADOR', 'PRESIDENTE'] },
  { ruta: '/adelantos', etiqueta: 'Adelantos', roles: ['ADMINISTRADOR', 'PRESIDENTE'] },
  { ruta: '/tienda', etiqueta: 'Tienda', roles: ['ADMINISTRADOR', 'ENCARGADO_TIENDA'] },
  { ruta: '/gastos', etiqueta: 'Gastos operativos', roles: ['ADMINISTRADOR', 'PRESIDENTE'] },
  { ruta: '/reportes', etiqueta: 'Reportes', roles: ['ADMINISTRADOR', 'PRESIDENTE', 'ENCARGADO_TIENDA'] },
];

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  get itemsNav(): ItemNav[] {
    return ITEMS_NAV.filter((item) => this.authService.tieneRol(...item.roles));
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
