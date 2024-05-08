import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
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
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './utils/interceptors/auth.interceptor';
import { DEFAULT_LANG } from './utils/constants/languages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GoogleMapsModule } from '@angular/google-maps';
import './utils/imports/momentLocales';
import { WithCredentialsInterceptor } from './utils/guards/with-credentials.interceptor';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions(),
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),
    provideHttpClient(withFetch()),
    importProvidersFrom([
      HttpClientModule,
      BrowserModule,
      BrowserAnimationsModule,
      NgxChartsModule,
      GoogleMapsModule,
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
      InlineSVGModule.forRoot({ baseUrl: 'assets/icons/' }),
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
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor,
      multi: true,
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
