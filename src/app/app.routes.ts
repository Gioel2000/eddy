import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { CookieGuard } from './utils/guards/cookie.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [AuthGuard],
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
        canActivate: [CookieGuard],
      },
      {
        path: 'menu',
        loadComponent: () => import('./pages/layout/home/home.component').then((m) => m.HomeComponent),
        data: { show: true, i18n: 'MENU', icon: 'restaurant-menu.svg' },
        canActivate: [CookieGuard],
      },
      {
        path: 'reviews',
        loadComponent: () => import('./pages/layout/home/home.component').then((m) => m.HomeComponent),
        data: { show: true, i18n: 'REVIEWS', icon: 'star.svg' },
        canActivate: [CookieGuard],
      },
      {
        path: 'competitors',
        loadComponent: () => import('./pages/layout/home/home.component').then((m) => m.HomeComponent),
        data: { show: true, i18n: 'COMPETITORS', icon: 'shield.svg' },
        canActivate: [CookieGuard],
      },
    ],
  },
  {
    path: 'structures',
    loadComponent: () => import('./pages/structures/structures.component').then((m) => m.StructuresComponent),
    canActivate: [AuthGuard],
  },
];
