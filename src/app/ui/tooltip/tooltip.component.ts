import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'tooltip',
  imports: [CommonModule],
  template: `
    <div class="relative group inline-block">
      <div
        class="absolute hidden group-hover:block duration-500 z-[50] animate-enter bg-zinc-800 shadow-lg shadow-black/40 rounded-lg"
        [ngClass]="tooltipPositionClasses + ' ' + (class() || '')"
      >
        @if (position().startsWith('bottom')) {
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            class="h-4 w-4 text-zinc-800 absolute"
            [ngClass]="arrowClasses"
          >
            <g fill="currentColor">
              <path
                d="m11.704,8.184L7.914,1.606c-.398-.693-1.114-1.106-1.914-1.106s-1.516.414-1.914,1.106L.296,8.184c-.399.692-.398,1.518,0,2.209s1.115,1.104,1.914,1.104h7.578c.799,0,1.515-.413,1.914-1.104s.4-1.518,0-2.209Z"
                stroke-width="0"
              ></path>
            </g>
          </svg>
        </div>
        }

        <div class="px-4 py-2">
          <p class="text-white text-sm min-w-24">{{ label() }}</p>
        </div>

        @if (position().startsWith('top')) {
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            class="h-4 w-4 text-zinc-800 rotate-180 absolute"
            [ngClass]="arrowClasses"
          >
            <g fill="currentColor">
              <path
                d="m11.704,8.184L7.914,1.606c-.398-.693-1.114-1.106-1.914-1.106s-1.516.414-1.914,1.106L.296,8.184c-.399.692-.398,1.518,0,2.209s1.115,1.104,1.914,1.104h7.578c.799,0,1.515-.413,1.914-1.104s.4-1.518,0-2.209Z"
                stroke-width="0"
              ></path>
            </g>
          </svg>
        </div>
        }
      </div>

      <ng-content></ng-content>
    </div>
  `,
})
export class TooltipComponent {
  position = input.required<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>();
  label = input.required<string>();
  class = input<string>();

  get arrowClasses(): string {
    switch (this.position()) {
      case 'top-left':
        return 'left-2 -mt-2.5';
      case 'top-right':
        return 'right-2 -mt-2.5';
      case 'bottom-left':
        return 'right-2 -mt-1.5';
      case 'bottom-right':
        return 'right-2 -mt-1.5';
    }
  }

  get tooltipPositionClasses(): string {
    switch (this.position()) {
      case 'top-left':
        return 'bottom-full left-0 mb-2';
      case 'top-right':
        return 'bottom-full right-0 mb-2';
      case 'bottom-left':
        return 'top-full left-0 mt-2';
      case 'bottom-right':
        return 'top-full right-0 mt-2';
      default:
        return 'bottom-full left-0 mb-2';
    }
  }
}
