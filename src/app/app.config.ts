import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
  withViewTransitions,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
import { CustomTranslateLoader } from './utils/classes/translateLoader';
import { MISSING_TRANSLATION } from './utils/constants/missingTranslation';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { authInterceptor } from './utils/interceptors/auth.interceptor';
import { DEFAULT_LANG } from './utils/constants/languages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GoogleMapsModule } from '@angular/google-maps';
import { CookieService } from 'ngx-cookie-service';
import { withCredentialsInterceptor } from './utils/guards/with-credentials.interceptor';
import { provideServiceWorker } from '@angular/service-worker';
import './utils/imports/momentLocales';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      routes,
      withViewTransitions(),
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, withCredentialsInterceptor])),
    provideLottieOptions({
      player: () => player,
    }),
    importProvidersFrom([
      BrowserModule,
      CookieService,
      BrowserAnimationsModule,
      NgxChartsModule,
      GoogleMapsModule,
      InlineSVGModule.forRoot({ baseUrl: 'assets/icons/' }),
      TranslateModule.forRoot({
        defaultLanguage: DEFAULT_LANG,
        loader: {
          provide: TranslateLoader,
          useClass: CustomTranslateLoader,
          deps: [HttpClient],
        },
        missingTranslationHandler: {
          provide: MissingTranslationHandler,
          useClass: class implements MissingTranslationHandler {
            handle() {
              return MISSING_TRANSLATION;
            }
          },
        },
      }),
      AuthModule.forRoot({
        ...environment.auth,
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: 'https://api.eddy.restaurant',
        },
        httpInterceptor: {
          allowedList: [`${environment.apiUrl}/*`],
        },
      }),
    ]),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
