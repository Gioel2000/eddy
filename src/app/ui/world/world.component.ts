import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
// import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'world',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="flex flex-col items-center text-balance text-center gap-y-3 animate-pulse">
      <iframe
        class="h-28 w-28"
        src="https://lottie.host/embed/626fff2e-6a24-46fb-bded-d1150d4ede6a/ZmvEzIrBrI.json"
      ></iframe>
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
