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
import { Step1Component } from './pages/setup/steps/step1/step1.component';
import { Step2Component } from './pages/setup/steps/step2/step2.component';

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
        data: {
          show: true,
          i18n: 'REVIEWS',
          icon: 'star.svg',
          queryParams: ['client', 'channel'],
        },
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
    component: PublicMenuComponent,
  },
  // {
  //   path: 'setup',
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: '1',
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: '1',
  //       component: Step1Component,
  //     },
  //     {
  //       path: '2',
  //       component: Step2Component,
  //     },
  //   ],
  // },
];
