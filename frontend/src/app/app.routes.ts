import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
      { path: 'socios', loadComponent: () => import('./features/socios/socios-page').then((m) => m.SociosPage) },
      { path: 'leche', loadComponent: () => import('./features/leche/leche-page').then((m) => m.LechePage) },
      {
        path: 'quincenas',
        loadComponent: () => import('./features/quincenas/quincenas-page').then((m) => m.QuincenasPage),
      },
      {
        path: 'adelantos',
        loadComponent: () => import('./features/adelantos/adelantos-page').then((m) => m.AdelantosPage),
      },
      { path: 'tienda', loadComponent: () => import('./features/tienda/tienda-page').then((m) => m.TiendaPage) },
      { path: 'gastos', loadComponent: () => import('./features/gastos/gastos-page').then((m) => m.GastosPage) },
      {
        path: 'reportes',
        loadComponent: () => import('./features/reportes/reportes-page').then((m) => m.ReportesPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
