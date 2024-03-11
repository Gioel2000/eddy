import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
  selector: 'loader',
  standalone: true,
  imports: [InlineSVGModule, CommonModule],
  template: `
    <div
      [ngClass]="{
        'rotate-0': counter() === 1,
        'rotate-[-45deg]': counter() === 2,
        'rotate-[-90deg]': counter() === 3,
        'rotate-[-135deg]': counter() === 4,
        'rotate-[-180deg]': counter() === 5,
        'rotate-[-225deg]': counter() === 6,
        'rotate-[-270deg]': counter() === 7,
        'rotate-[-315deg]': counter() === 8,
      }"
    >
      <span class="text-zinc-700 dark:text-zinc-200 svg-icon-3 stroke-[1.8]" inlineSVG="loader.svg"></span>
    </div>
  `,
})
export class LoaderComponent {
  counter = signal(1);

  constructor() {
    setInterval(() => this.counter.set(this.counter() === 8 ? 1 : this.counter() + 1), 125);
  }
}
