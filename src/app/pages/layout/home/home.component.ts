import { Component } from '@angular/core';

@Component({
  selector: 'home',
  standalone: true,
  template: `
    <div class="h-screen">
      <h1 class="text-xl font-medium text-zinc-900 dark:text-zinc-100">Home</h1>
    </div>
  `,
})
export class HomeComponent {}
