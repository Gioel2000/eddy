import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { SetTheme, Theme } from './interfaces/theme';
import { connect } from 'ngxtension/connect';
import { Observable, Subject, map, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

export interface ThemeState {
  theme: Theme;
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class ThemeManagerStore {
  storage = inject(StorageMap);
  translate = inject(TranslateService);

  private store = signal<ThemeState>({
    theme: {
      isThemeSystem: false,
      theme: 'light',
    },
  });

  option = computed(() => {
    const { theme } = this.store();
    const { isThemeSystem, theme: themeName } = theme;

    return isThemeSystem ? 'system' : themeName;
  });

  theme = computed(() => this.store().theme.theme);

  set$ = new Subject<SetTheme>();

  constructor() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => this.store().theme.isThemeSystem && this.set$.next('system'));

    const next$: Observable<ThemeState> = (this.storage.get('theme') as Observable<any>).pipe(
      map((theme) => {
        if (!theme || theme.isThemeSystem) {
          const newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

          return {
            isThemeSystem: true,
            theme: newTheme,
          };
        }

        return theme;
      }),
      map((theme) => ({ theme }))
    );

    connect(this.store)
      .with(next$)
      .with(this.set$, (state: ThemeState, theme: SetTheme) => {
        const isThemeSystem = theme === 'system';

        return {
          theme: {
            isThemeSystem,
            theme: isThemeSystem
              ? window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
              : theme,
          },
        };
      });

    effect(() => {
      const { theme } = this.store();
      const html = document.querySelector('html');

      html?.classList.remove('dark', 'light');
      html?.classList.add(theme.theme);

      this.storage.set('theme', theme).pipe(untilDestroyed(this)).subscribe();
    });
  }
}
