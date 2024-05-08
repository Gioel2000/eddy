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
      <span class="text-zinc-700 dark:text-zinc-200 svg-icon svg-icon-3 stroke-[1.8]">
        <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
          <title>loader</title>
          <g fill="currentColor" class="nc-icon-wrapper">
            <line
              x1="9"
              y1="1.75"
              x2="9"
              y2="4.25"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></line>
            <line
              x1="14.127"
              y1="3.873"
              x2="12.359"
              y2="5.641"
              fill="none"
              opacity=".88"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></line>
            <line
              x1="16.25"
              y1="9"
              x2="13.75"
              y2="9"
              fill="none"
              opacity=".75"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></line>
            <line
              x1="14.127"
              y1="14.127"
              x2="12.359"
              y2="12.359"
              fill="none"
              opacity=".63"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></line>
            <line
              x1="9"
              y1="16.25"
              x2="9"
              y2="13.75"
              fill="none"
              opacity=".5"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></line>
            <line
              x1="3.873"
              y1="14.127"
              x2="5.641"
              y2="12.359"
              fill="none"
              opacity=".38"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></line>
            <line
              x1="1.75"
              y1="9"
              x2="4.25"
              y2="9"
              fill="none"
              opacity=".25"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></line>
            <line
              x1="3.873"
              y1="3.873"
              x2="5.641"
              y2="5.641"
              fill="none"
              opacity=".13"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></line>
          </g>
        </svg>
      </span>
    </div>
  `,
})
export class LoaderComponent {
  counter = signal(1);

  constructor() {
    setInterval(() => this.counter.set(this.counter() === 8 ? 1 : this.counter() + 1), 125);
  }
}
