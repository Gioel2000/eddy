import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DEFAULT_LANG, LANGUAGES } from '../../utils/constants/languages';
import { Observable, Subject, map } from 'rxjs';
import { Languages, SetLanguage } from './interfaces/i18n';
import { connect } from 'ngxtension/connect';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

export interface I18nState {
  languages: Languages[];
  state: 'loaded' | 'loading' | 'error';
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class I18nStore {
  translate = inject(TranslateService);
  storage = inject(StorageMap);

  private store = signal<I18nState>({
    languages: [],
    state: 'loading',
  });

  languages = computed(() => this.store().languages);
  selectedLang = computed(() => this.store().languages.find((language) => language.selected) || LANGUAGES[0]);

  setLocale$ = new Subject<SetLanguage>();

  constructor() {
    const next$: Observable<I18nState> = this.storage.get('locale', { type: 'string' }).pipe(
      map((locale) => {
        if (!locale) {
          const browserLang = this.translate.getBrowserLang();
          const browserLocale = browserLang && browserLang.match(locales.join('|')) ? browserLang : DEFAULT_LANG;

          return browserLocale;
        }

        return locale;
      }),
      map((locale) =>
        LANGUAGES.map((language) => ({
          ...language,
          selected: language.locale === locale,
        }))
      ),
      map((languages) => ({ languages, state: 'loaded' }))
    );

    connect(this.store)
      .with(next$)
      .with(this.setLocale$, (store, locale) => ({
        ...store,
        languages: store.languages.map((language) => ({
          ...language,
          selected: language.locale === locale,
        })),
      }));

    effect(() => {
      const selected = this.store().languages.find((language) => language.selected);

      if (!selected) return;

      const { locale } = selected;

      this.translate.use(locale);
      this.storage.set('locale', locale).pipe(untilDestroyed(this)).subscribe();
    });

    const locales = LANGUAGES.map((language) => language.locale);
    this.translate.addLangs(LANGUAGES.map((language) => language.locale));
  }
}
