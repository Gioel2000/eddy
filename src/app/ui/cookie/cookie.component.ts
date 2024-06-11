import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, inject, signal } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StorageMap } from '@ngx-pwa/local-storage';
import { TranslateModule } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'cookie-alert',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div [ngClass]="{ hidden: !isCookieAlertOpen() }">
      <div
        class="transition ease-out duration-300 pointer-events-none fixed bottom-0 right-0 px-6 pb-6 z-20 origin-bottom sm:origin-bottom-right transform scale-90 opacity-0"
        [ngClass]="{
          'opacity-100 scale-100': isCookieAlertVisible(),
          'opacity-0 scale-90': !isCookieAlertVisible()
        }"
      >
        <div
          class="pointer-events-auto ml-auto max-w-xl rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-lg ring-1 ring-zinc-900/10 dark:ring-zinc-50/10"
        >
          <p class="text-sm leading-6 text-zinc-900 dark:text-zinc-100">
            {{ 'COOKIE_POLICY_DESCRIPTION' | translate }}
            <a
              href="https://www.iubenda.com/privacy-policy/40734880/cookie-policy"
              class="font-semibold text-accent dark:text-accentDark"
              >{{ 'COOKIE_POLICY' | translate }}</a
            >.
          </p>
          <div class="mt-4 flex items-center gap-x-5">
            <button
              type="button"
              class="rounded-md bg-zinc-800 dark:bg-zinc-100 px-3 py-2 text-sm font-semibold text-white dark:text-zinc-800 shadow-sm hover:bg-zinc-700 dark:hover:bg-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100"
              (click)="acceptCookie()"
            >
              {{ 'ACCEPT' | translate }}
            </button>
            <button
              type="button"
              class="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100"
              (click)="rejectCookie()"
            >
              {{ 'REJECT' | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CookieAlertComponent implements AfterViewChecked {
  storage = inject(StorageMap);

  isCookieAlertOpen = signal(false);
  isCookieAlertVisible = signal(false);

  ngAfterViewChecked() {
    this.storage
      .get('cookieAccepted', { type: 'boolean' })
      .pipe(untilDestroyed(this))
      .subscribe((cookieAccepted) => (cookieAccepted === undefined ? true : !cookieAccepted) && this.open());
  }

  acceptCookie() {
    this.storage.set('cookieAccepted', true).subscribe();
    this.close();
  }

  rejectCookie() {
    this.storage.set('cookieAccepted', false).subscribe();
    window.location.href = 'https://www.google.com';
  }

  open() {
    this.isCookieAlertOpen.set(true);
    setTimeout(() => this.isCookieAlertVisible.set(true), 0);
  }

  close() {
    this.isCookieAlertVisible.set(false);
    setTimeout(() => this.isCookieAlertOpen.set(false), 200);
  }
}
