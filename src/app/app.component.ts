import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './ui/loader/loader.component';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './ui/settings/settings.component';
import { UserPanelComponent } from './ui/user/user.component';
import { CreateRestaurantPanelComponent } from './ui/create-restaurant/create-restaurant.component';
import { RestaurantPanelComponent } from './ui/restaurant/restaurant.component';

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
  ],
  template: `
    @defer (on viewport; prefetch on idle) {
    <user-panel></user-panel>
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
    }

    <router-outlet (activate)="isRouterLoaded.set(true)" (deactivate)="isRouterLoaded.set(false)"></router-outlet>
    @if (!isRouterLoaded()) {
    <div
      class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-screen bg-zinc-50 dark:bg-dark"
    >
      <loader></loader>
    </div>
    }
  `,
})
export class AppComponent {
  isRouterLoaded = signal(false);
}
