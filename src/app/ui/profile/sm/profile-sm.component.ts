import { Component, computed, inject } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { ClickOutsideDirective } from '../../../utils/directives/clickoutside';
import { UserStore } from '../../../store/user/user.service';
import { ProfileUIService } from '../profile.service';
import { UserPanelService } from '../../user/user.service';
import { SettingsService } from '../../settings/settings.service';
import { environment } from '../../../../environments/environment';
import { StructureStore } from '../../../store/structures/structure.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, tap } from 'rxjs';
import { RouterModule } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'profile-dropdown-sm',
  standalone: true,
  imports: [CommonModule, InlineSVGModule, TranslateModule, ClickOutsideDirective, RouterModule],
  template: `
    <div class="relative inline-block text-left">
      <div>
        <button
          class="flex flex-row items-center gap-x-1.5 cursor-pointer p-2 rounded-full ring-1 ring-zinc-300 dark:ring-zinc-800 shadow-sm hover:shadow-md shadow-black/20 dark:shadow-black/90 transition ease-in-out duration-200"
          (clickOutside)="ui.closeDropdownSm()"
          (click)="ui.toggleDropdownSm()"
        >
          <img class="h-6 w-6 sm:h-7 sm:w-7 rounded-full" [src]="user().picture" alt="" />
          <div class="block">
            <p
              class="mr-1.5 text-sm truncate font-semibold text-zinc-700 dark:text-zinc-100 group-hover:font-semibold group-hover:text-zinc-950 dark:group-hover:text-zinc-200"
            >
              {{ user().name }}
            </p>
          </div>
        </button>
      </div>
      <div [ngClass]="{ hidden: !ui.isDropdownOpenSm() }">
        <div
          class="absolute z-10 mt-2 w-56 origin-top-right right-0 divide-y divide-zinc-200 dark:divide-zinc-700 rounded-lg bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-700 focus:outline-none transition ease-out duration-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
          [ngClass]="{
            'opacity-100 scale-100': ui.isDropdownVisibleSm(),
            'opacity-0 scale-90': !ui.isDropdownVisibleSm()
          }"
        >
          <div class="block px-4 py-3 text-sm cursor-pointer w-full">
            <button
              id="structure-item"
              class="group flex flex-col w-full cursor-pointer gap-y-0.5 transition-all transform-gpu ease-in-out duration-200"
              (click)="userPanel.togglePanel()"
            >
              <div class="flex flex-row items-center justify-between gap-x-2 w-full">
                <div class="flex flex-col gap-x-2 w-full">
                  <div class="flex flex-row items-center justify-between gap-x-2 w-full">
                    <p
                      class="max-w-36 text-base truncate font-semibold text-zinc-700 dark:text-zinc-100 group-hover:font-semibold group-hover:text-zinc-950 dark:group-hover:text-zinc-200 transition-all transform-gpu ease-in-out duration-200"
                    >
                      {{ user().name }} {{ user().surname }}
                    </p>
                    <span
                      [inlineSVG]="'share-up-right.svg'"
                      class="group-hover:text-zinc-950 dark:group-hover:text-zinc-200 w-4 text-zinc-400 svg-icon svg-icon-9 stroke-[2.3] transition-all transform-gpu ease-in-out duration-200"
                    ></span>
                  </div>
                  <span
                    class="max-w-full text-left truncate text-xs font-medium text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-200 transition-all transform-gpu ease-in-out duration-200"
                    >{{ user().email }}</span
                  >
                </div>
              </div>
            </button>
          </div>
          <div class="py-2" role="none">
            <a
              (click)="settings.openDialog()"
              class="block px-4 py-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
              role="menuitem"
              tabindex="-1"
              id="menu-item-0"
            >
              <div class="flex flex-row items-center w-full">
                <span
                  class="mr-1.5 svg-icon svg-icon-7 stroke-[1.7] text-zinc-700 dark:text-zinc-300"
                  [inlineSVG]="'gear-2.svg'"
                ></span>
                <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ 'SETTINGS' | translate }}</span>
              </div>
            </a>
            <a
              class="block px-4 py-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
              role="menuitem"
              tabindex="-1"
              id="menu-item-0"
              [routerLink]="'/changelog'"
            >
              <div class="flex flex-row items-center w-full">
                <span
                  class="mr-1.5 svg-icon svg-icon-7 stroke-[1.7] text-zinc-700 dark:text-zinc-300"
                  [inlineSVG]="'brackets-curly-dots.svg'"
                ></span>
                <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">{{ 'NOVELTY' | translate }}</span>
              </div>
            </a>
          </div>
          <div class="py-2" role="none">
            <a
              class="block px-4 py-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900"
              role="menuitem"
              tabindex="-1"
              id="menu-item-0"
              (click)="logout()"
            >
              <div class="flex flex-row items-center w-full">
                <span
                  class="mr-1.5 svg-icon svg-icon-7 stroke-[1.7] text-red-600 dark:text-red-500 rotate-180"
                  [inlineSVG]="'rect-logout.svg'"
                ></span>
                <span class="text-sm font-medium text-red-600 dark:text-red-500">{{ 'EXIT' | translate }}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileSmComponent {
  profile = inject(UserStore);
  ui = inject(ProfileUIService);
  auth = inject(AuthService);
  userPanel = inject(UserPanelService);
  settings = inject(SettingsService);
  structures = inject(StructureStore);

  user = computed(() => this.profile.me());

  logout() {
    this.structures
      .clear()
      .pipe(
        untilDestroyed(this),
        switchMap(() => this.auth.logout()),
        tap(() => window.open(environment.url, '_self'))
      )
      .subscribe();
  }
}
