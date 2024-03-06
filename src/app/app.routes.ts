import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { CookieGuard } from './utils/guards/cokie.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [AuthGuard, CookieGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
        data: { show: false },
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/layout/home/home.component').then((m) => m.HomeComponent),
        data: { show: true, i18n: 'HOME', icon: 'house.svg' },
      },
      {
        path: 'menu',
        loadComponent: () => import('./pages/layout/home/home.component').then((m) => m.HomeComponent),
        data: { show: true, i18n: 'MENU', icon: 'restaurant-menu.svg' },
      },
      {
        path: 'reviews',
        loadComponent: () => import('./pages/layout/home/home.component').then((m) => m.HomeComponent),
        data: { show: true, i18n: 'REVIEWS', icon: 'star.svg' },
      },
      {
        path: 'competitors',
        loadComponent: () => import('./pages/layout/home/home.component').then((m) => m.HomeComponent),
        data: { show: true, i18n: 'COMPETITORS', icon: 'shield.svg' },
      },
    ],
  },
  {
    path: 'structures',
    loadComponent: () => import('./pages/structures/structures.component').then((m) => m.StructuresComponent),
    canActivate: [AuthGuard],
  },
];
