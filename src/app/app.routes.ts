import { Routes } from '@angular/router';

/**
 * Application routes configuration.
 * Uses lazy loading for the Home page component.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Data Explorer — Inicio',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
