import { Component, OnInit, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'no-channel',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <main
      class="grid min-h-full place-items-center border-t border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-6 lg:px-8 h-[32rem] -mb-8 rounded-b-xl"
    >
      <div class="text-center">
        <p class="text-base font-semibold text-accent dark:text-accentDark">404</p>
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          {{ 'NOT_FOUND' | translate }}
        </h1>
        <p class="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {{ 'NO_CHANNEL_DESCRIPTION' | translate }}
        </p>
      </div>
    </main>
  `,
})
export class NoChannelComponent {}
