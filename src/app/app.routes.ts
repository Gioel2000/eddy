import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { CookieGuard } from './utils/guards/cookie.guard';
import { LayoutComponent } from './pages/layout/layout.component';
import { HomeComponent } from './pages/layout/home/home.component';
import { ReviewsComponent } from './pages/layout/reviews/reviews.component';
import { CompetitorsComponent } from './pages/layout/competitors/competitors.component';
import { MenuComponent } from './pages/layout/menu/menu.component';
import { StructuresComponent } from './pages/structures/structures.component';
import { PublicMenuComponent } from './pages/public-menu/public-menu.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
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
        component: HomeComponent,
        data: { show: true, i18n: 'HOME', icon: 'house.svg' },
        canActivate: [CookieGuard],
      },
      {
        path: 'menu',
        component: MenuComponent,
        data: { show: true, i18n: 'MENU', icon: 'restaurant-menu.svg' },
        canActivate: [CookieGuard],
      },
      {
        path: 'reviews',
        component: ReviewsComponent,
        data: { show: true, i18n: 'REVIEWS', icon: 'star.svg' },
        canActivate: [CookieGuard],
      },
      {
        path: 'competitors',
        component: CompetitorsComponent,
        data: { show: true, i18n: 'COMPETITORS', icon: 'shield.svg' },
        canActivate: [CookieGuard],
      },
    ],
  },
  {
    path: 'structures',
    component: StructuresComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'public-menu/:id',
    loadComponent: () => PublicMenuComponent,
  },
];
