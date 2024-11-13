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
      <p
        class="text-2xl font-bold leading-8 tracking-tight"
        [ngClass]="{
          'text-zinc-900': isThemeLight(),
          'text-zinc-100': !isThemeLight()
        }"
      >
        {{ title() }}
      </p>
      <p
        class="text-center text-base font-medium max-w-[24rem] opacity-75 mt-1 tracking-tight"
        [ngClass]="{
          'text-zinc-900': isThemeLight(),
          'text-zinc-100': !isThemeLight()
        }"
      >
        {{ description() }}
      </p>
    </div>
  `,
})
export class SparkleComponent {
  themeStore = inject(ThemeManagerStore);
  isThemeLight = computed(() => (this.theme() ?? this.themeStore.theme()) === 'light');

  title = input.required<string>();
  description = input.required<string>();
  theme = input<'light' | 'dark'>();
}
