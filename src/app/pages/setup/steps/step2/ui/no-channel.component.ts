import { Component, OnInit, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'no-channel',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div
      class="pointer-events-none relative bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 -mb-8 w-full h-[32rem] rounded-b-xl"
    >
      <div class="bg-white dark:bg-zinc-800 px-6 py-24 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            {{ 'NO_CHANNEL' | translate }}
          </h2>
          <p class="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {{ 'NO_CHANNEL_DESCRIPTION' | translate }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class NoChannelComponent {}
