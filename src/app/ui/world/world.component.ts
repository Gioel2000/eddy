import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'world',
  standalone: true,
  imports: [LottieComponent, TranslateModule],
  template: `
    <div class="flex flex-col items-center text-balance text-center gap-y-3 animate-pulse">
      <ng-lottie
        class="h-28 w-28"
        [options]="{
          path: '/assets/lottie/world.json',
        }"
        background="transparent"
        speed="0.6"
        loop
        autoplay
      ></ng-lottie>
      <p class="text-2xl font-bold leading-8 text-zinc-900 dark:text-zinc-100 tracking-tight">
        {{ title() }}
      </p>
      <p
        class="text-center text-base font-medium max-w-[24rem] opacity-75 mt-1 text-zinc-900 dark:text-zinc-100 tracking-tight"
      >
        {{ description() }}
      </p>
    </div>
  `,
})
export class WorldComponent {
  title = input.required<string>();
  description = input.required<string>();
}
