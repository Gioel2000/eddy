import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './ui/loader/loader.component';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './ui/settings/settings.component';
import { UserPanelComponent } from './ui/user/user.component';
import { CreateRestaurantPanelComponent } from './ui/create-restaurant/create-restaurant.component';
import { RestaurantPanelComponent } from './ui/restaurant/restaurant.component';
import { CreateCompetitorPanelComponent } from './ui/create-competitor/create-competitor.component';
import { GeneralDialogComponent } from './ui/dialog/dialog.component';
import { CookieAlertComponent } from './ui/cookie/cookie.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    RouterModule,
    SettingsComponent,
    UserPanelComponent,
    CreateRestaurantPanelComponent,
    RestaurantPanelComponent,
    CreateCompetitorPanelComponent,
    GeneralDialogComponent,
    CookieAlertComponent,
  ],
  template: `
    @if (isRouterLoaded()) { @defer (on viewport; prefetch on idle) {
    <user-panel></user-panel>
    } @placeholder {
    <div></div>
    } @loading {
    <div></div>
    } @defer (on viewport; prefetch on idle) {
    <general-dialog></general-dialog>
    } @placeholder {
    <div></div>
    } @loading {
    <div></div>
    } @defer (on viewport; prefetch on idle) {
    <restaurant-panel></restaurant-panel>
    } @placeholder {
    <div></div>
    } @loading {
    <div></div>
    } @defer (on viewport; prefetch on idle) {
    <settings></settings>
    } @placeholder {
    <div></div>
    } @loading {
    <div></div>
    } @defer (on viewport; prefetch on idle) {
    <create-restaurant-panel></create-restaurant-panel>
    } @placeholder {
    <div></div>
    } @loading {
    <div></div>
    } @defer (on viewport; prefetch on idle) {
    <create-competitor-panel></create-competitor-panel>
    } @placeholder {
    <div></div>
    } @loading {
    <div></div>
    } @defer (on viewport; prefetch on idle) {
    <cookie-alert></cookie-alert>
    } @placeholder {
    <div></div>
    } @loading {
    <div></div>
    } } @else {
    <div class="flex flex-col items-center justify-center gap-y-1 w-full px-4 py-10 sm:px-6 xl:px-8 h-screen bg-white">
      <img class="h-20 w-auto" src="/assets/logo/extended-logo.png" alt="logo" />
      <loader></loader>
    </div>
    }

    <router-outlet (activate)="isRouterLoaded.set(true)" (deactivate)="isRouterLoaded.set(false)"></router-outlet>
  `,
})
export class AppComponent {
  isRouterLoaded = signal(false);
}
