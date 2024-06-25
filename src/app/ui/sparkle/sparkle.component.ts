import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LottieComponent } from 'ngx-lottie';
import { ThemeManagerStore } from '../../store/theme/theme.service';

@Component({
  selector: 'sparkle',
  standalone: true,
  imports: [CommonModule, LottieComponent, TranslateModule],
  template: `
    <div class="flex flex-col items-center text-balance text-center gap-y-3 my-24 animate-pulse">
      <ng-lottie
        class="h-20 w-20"
        [options]="{
          path: isThemeLight() ?'/assets/lottie/sparkle.json' : '/assets/lottie/sparkle-dark.json',
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
        class="text-center text-base font-medium max-w-[24rem] text-zinc-900 dark:text-zinc-100 opacity-75 mt-1 tracking-tight"
      >
        {{ description() }}
      </p>
    </div>
  `,
})
export class SparkleComponent {
  theme = inject(ThemeManagerStore);
  isThemeLight = computed(() => this.theme.theme() === 'light');

  title = input.required<string>();
  description = input.required<string>();
}
