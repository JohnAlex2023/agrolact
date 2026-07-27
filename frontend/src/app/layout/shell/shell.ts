import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Rol } from '../../core/models/usuario.model';
import { Logo } from '../../shared/logo/logo';

interface ItemNav {
  ruta: string;
  etiqueta: string;
  icono: string;
  roles: Rol[];
}

const ITEMS_NAV: ItemNav[] = [
  { ruta: '/', etiqueta: 'Inicio', icono: 'home', roles: ['ADMINISTRADOR', 'PRESIDENTE', 'RECEPCIONISTA', 'ENCARGADO_TIENDA'] },
  { ruta: '/socios', etiqueta: 'Socios', icono: 'users', roles: ['ADMINISTRADOR', 'PRESIDENTE'] },
  { ruta: '/leche', etiqueta: 'Registro de leche', icono: 'droplet', roles: ['ADMINISTRADOR', 'PRESIDENTE', 'RECEPCIONISTA'] },
  { ruta: '/quincenas', etiqueta: 'Quincenas', icono: 'calendar', roles: ['ADMINISTRADOR', 'PRESIDENTE'] },
  { ruta: '/adelantos', etiqueta: 'Adelantos', icono: 'dollar', roles: ['ADMINISTRADOR', 'PRESIDENTE'] },
  { ruta: '/tienda', etiqueta: 'Tienda', icono: 'bag', roles: ['ADMINISTRADOR', 'ENCARGADO_TIENDA'] },
  { ruta: '/gastos', etiqueta: 'Gastos operativos', icono: 'receipt', roles: ['ADMINISTRADOR', 'PRESIDENTE'] },
  { ruta: '/reportes', etiqueta: 'Reportes', icono: 'chart', roles: ['ADMINISTRADOR', 'PRESIDENTE', 'ENCARGADO_TIENDA'] },
];

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Logo],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly iniciales = computed(() => {
    const nombre = this.authService.usuario()?.nombre ?? '';
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase())
      .join('');
  });

  get itemsNav(): ItemNav[] {
    return ITEMS_NAV.filter((item) => this.authService.tieneRol(...item.roles));
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
