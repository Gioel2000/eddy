import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './ui/loader/loader.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoaderComponent, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
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
