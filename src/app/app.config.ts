import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import {
    PreloadAllModules,
    provideRouter,
    withPreloading,
    withViewTransitions,
    withComponentInputBinding,
    withInMemoryScrolling,
} from "@angular/router";
import { routes } from "./app.routes";
import { CustomTranslateLoader } from "./utils/classes/translateLoader";
import { MISSING_TRANSLATION } from "./utils/constants/missingTranslation";
import {
    MissingTranslationHandler,
    TranslateLoader,
    TranslateModule,
} from "@ngx-translate/core";
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    HttpClientModule,
    provideHttpClient,
    withFetch,
} from "@angular/common/http";
import { InlineSVGModule } from "ng-inline-svg-2";
import { AuthModule } from "@auth0/auth0-angular";
import { environment } from "../environments/environment";
import { AuthInterceptor } from "./utils/interceptors/auth.interceptor";
import { DEFAULT_LANG } from "./utils/constants/languages";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import "./utils/imports/momentLocales";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            routes,
            withViewTransitions({
                skipInitialTransition: true,
            }),
            withPreloading(PreloadAllModules),
            withComponentInputBinding(),
            withInMemoryScrolling({
                scrollPositionRestoration: "top",
            })
        ),
        provideHttpClient(withFetch()),
        importProvidersFrom([
            HttpClientModule,
            BrowserModule,
            BrowserAnimationsModule,
            NgxChartsModule,
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
            InlineSVGModule.forRoot({ baseUrl: "assets/icons/" }),
            AuthModule.forRoot({
                ...environment.auth,
                authorizationParams: {
                    redirect_uri: window.location.origin,
                    audience: "https://api.diamondshub.it",
                },
                httpInterceptor: {
                    allowedList: [`${environment.apiUrl}/*`],
                },
            }),
        ]),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
};
