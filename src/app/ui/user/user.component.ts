import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { UserPanelService } from './user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';
import { LoaderComponent } from '../loader/loader.component';
import { UserStore } from '../../store/user/user.service';
import { AuthService } from '@auth0/auth0-angular';
import { MomentPipe } from '../../utils/pipes/moment.pipe';
import { environment } from '../../../environments/environment';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'user-panel',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    InlineSVGModule,
    ReactiveFormsModule,
    ClickOutsideDirective,
    LoaderComponent,
    MomentPipe,
  ],
  template: `
    <div
      class="relative z-40"
      [ngClass]="{
        hidden: !panelUI.isPanelOpen(),
      }"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="fixed inset-0"></div>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="transform transition ease-in-out duration-300 sm:duration-700 pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16"
            [ngClass]="{
              'translate-x-0': panelUI.isPanelVisible(),
              'translate-x-full': !panelUI.isPanelVisible()
            }"
            (clickOutside)="panelUI.isPanelVisible() && panelUI.closePanel()"
          >
            <div class="pointer-events-auto w-screen max-w-xl">
              <div
                class="flex h-full flex-col divide-y divide-zinc-200 dark:divide-zinc-800 border-l border-zinc-300 dark:border-zinc-700 shadow-md"
              >
                <div class="h-0 flex-1 overflow-y-auto">
                  <div class="flex fle-row items-center justify-end w-full h-0 z-50 relative -bottom-7 -left-4">
                    <button
                      type="button"
                      class="relative z-50 rounded-md p-1.5 bg-white/20 hover:bg-white/10 hover:dark:bg-zinc-50/5 text-zinc-200 focus:outline-none transition ease-in-out duration-100"
                      (click)="panelUI.closePanel()"
                    >
                      <span class="svg-icon svg-icon-5" inlineSVG="xmark.svg"></span>
                    </button>
                  </div>
                  <nav class="h-full overflow-y-auto bg-white dark:bg-zinc-800" aria-label="Directory">
                    <ng-template #loading>
                      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-72">
                        <div class="flex flex-row items-center justify-center w-full">
                          <loader></loader>
                        </div>
                      </div>
                    </ng-template>

                    <ng-template #empty>
                      <div
                        class="flex flex-row items-center justify-center w-full px-4 pb-10 sm:px-6 xl:px-8 h-[34rem]"
                      >
                        <div class="flex flex-col items-center justify-center w-full">
                          <span [inlineSVG]="'ufo.svg'" class="svg-icon svg-icon-3 text-zinc-500 stroke-[1.4]"></span>
                          <span class="text-base font-medium text-zinc-500 mt-1">{{ 'NO_DATA' | translate }}</span>
                        </div>
                      </div>
                    </ng-template>

                    <ng-template #error>
                      <div class="flex flex-row items-center justify-center w-full px-4 py-10 sm:px-6 xl:px-8 h-96">
                        <div class="flex flex-col items-center justify-center w-full">
                          <span
                            [inlineSVG]="'triangle-warning.svg'"
                            class="svg-icon svg-icon-3 text-red-500 stroke-[1.4]"
                          ></span>
                          <span class="text-base font-medium text-red-500 mt-1">{{ 'ERROR' | translate }}</span>
                        </div>
                      </div>
                    </ng-template>

                    @switch (profile.status()) { @case('loaded') {
                    <article class="bg-white dark:bg-zinc-800 relative h-full">
                      <div class="flex-1">
                        <div>
                          <img class="h-32 w-full object-cover lg:h-48" src="/assets/images/profile-banner.jpg" />
                        </div>
                        <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                          <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                            <div class="flex">
                              <!-- <img
                                class="h-24 w-24 rounded-full ring-4 ring-zinc-50 dark:ring-zinc-800 sm:h-32 sm:w-32"
                                [src]="this.profile.me().picture"
                                alt=""
                              /> -->
                              <input #fileUpload type="file" class="sr-only" (change)="onImagesPicked($event)" />
                              <a
                                class="relative group h-24 w-24 rounded-full ring-4 ring-zinc-50 dark:ring-zinc-800 sm:h-32 sm:w-32"
                                (click)="clickFileUpload()"
                              >
                                <img
                                  class="h-24 w-24 sm:h-32 sm:w-32 rounded-full absolute object-cover object-center"
                                  [src]="preview() || profile.me().picture"
                                  alt=""
                                />
                                <div
                                  class="h-24 w-24 sm:h-32 sm:w-32 group-hover:bg-zinc-100/80 dark:group-hover:bg-zinc-900/80 rounded-full absolute flex justify-center items-center cursor-pointer transition duration-500"
                                >
                                  <span
                                    [inlineSVG]="'pen-writing.svg'"
                                    class="hidden group-hover:block svg-icon svg-icon-1 text-zinc-900 dark:text-zinc-100 stroke-[1.7] transition duration-500"
                                  ></span>
                                </div>
                              </a>
                            </div>
                            <div
                              class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:-mb-1"
                            >
                              <div class="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                                <h1 class="truncate text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                  {{ user()?.name }} {{ user()?.surname }}
                                </h1>
                                <p class="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                  {{ profile.me().email }}
                                </p>
                              </div>
                              <div
                                class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0"
                              >
                                <button
                                  type="button"
                                  class="flex fle-row items-center rounded-lg px-2.5 py-2 cursor-pointer text-sm shadow-sm shadow-zinc-950/5 font-semibold ring-1  ring-zinc-500/30 hover:bg-zinc-200 hover:dark:bg-zinc-700 transition ease-in-out duration-200"
                                  (click)="logout()"
                                >
                                  <span
                                    inlineSVG="rect-logout.svg"
                                    class="text-zinc-700 dark:text-zinc-200 mt-[1px] stroke-[1.6]"
                                  ></span>
                                  <span class="text-zinc-700 dark:text-zinc-200 ml-1.5 mr-1">{{
                                    'EXIT' | translate
                                  }}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
                            <h1 class="truncate text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                              {{ user()?.name }} {{ user()?.surname }}
                            </h1>
                            <p class="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                              {{ profile.me().email }}
                            </p>
                          </div>
                          <form [formGroup]="formGroup" class="h-full">
                            <div class="pb-12">
                              <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div class="sm:col-span-3">
                                  <label
                                    for="first-name"
                                    class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                                    >{{ 'NAME' | translate }}</label
                                  >
                                  <div class="mt-2">
                                    <input
                                      type="text"
                                      name="first-name"
                                      id="first-name"
                                      autocomplete="given-name"
                                      formControlName="name"
                                      class="block w-full rounded-md border-0 py-1.5 bg-transparent text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accentDark sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>

                                <div class="sm:col-span-3">
                                  <label
                                    for="last-name"
                                    class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                                    >{{ 'SURNAME' | translate }}</label
                                  >
                                  <div class="mt-2">
                                    <input
                                      type="text"
                                      name="last-name"
                                      id="last-name"
                                      autocomplete="family-name"
                                      formControlName="surname"
                                      class="block w-full rounded-md border-0 py-1.5 bg-transparent text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accentDark sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div>

                                <!-- <div class="sm:col-span-4">
                                  <label
                                    for="email"
                                    class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                                    >{{ 'EMAIL' | translate }}</label
                                  >
                                  <div class="mt-2">
                                    <input
                                      id="email"
                                      name="email"
                                      type="email"
                                      autocomplete="email"
                                      formControlName="email"
                                      class="block w-full rounded-md border-0 py-1.5 bg-transparent text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accentDark sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </div> -->
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div
                        class="absolute bottom-0 w-full border-t border-zinc-200 dark:border-zinc-700 px-4 py-5 sm:px-6"
                      >
                        <div class="flex justify-end space-x-3">
                          <button
                            type="button"
                            class="rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition ease-in-out duration-200 disabled:opacity-30"
                            [disabled]="profile.status() === 'loading'"
                            (click)="panelUI.closePanel()"
                          >
                            {{ 'CANCEL' | translate }}
                          </button>
                          <button
                            id="create-restaurant-button"
                            type="button"
                            class="flex flex-row items-center justify-center font-semibold col-span-1 rounded-lg px-3 py-2 cursor-pointer ring-1 ring-inset ring-accent bg-accent dark:bg-accentDark hover:bg-accent hover:dark:bg-accentDark/90 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)] disabled:opacity-30"
                            (click)="save()"
                            [disabled]="formGroup.invalid || formGroup.pristine || profile.status() === 'loading'"
                          >
                            {{ 'SAVE' | translate }}
                          </button>
                        </div>
                      </div>
                    </article>
                    } @case('loading') {
                    <ng-container *ngTemplateOutlet="loading"></ng-container>
                    } @case('error') {
                    <ng-container *ngTemplateOutlet="error"></ng-container>
                    } @default {
                    <ng-container *ngTemplateOutlet="empty"></ng-container>
                    } }
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UserPanelComponent {
  @ViewChild('fileUpload', { read: ElementRef }) fileUpload: ElementRef | undefined;

  panelUI = inject(UserPanelService);
  profile = inject(UserStore);
  auth = inject(AuthService);
  translate = inject(TranslateService);

  readonly ALLOWED_TYPES = ['image'];
  readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
  });

  file = signal<File | null>(null);
  preview = signal<string | null>(null);

  user = toSignal(this.formGroup.valueChanges);

  constructor() {
    toObservable(this.profile.me)
      .pipe(
        untilDestroyed(this),
        tap(console.log),
        tap((user) => this.formGroup.patchValue(user))
      )
      .subscribe();
  }

  logout() {
    const { url } = environment;
    this.auth.logout().subscribe(() => window.open(url, '_self'));
  }

  clickFileUpload() {
    const fileUpload = this.fileUpload?.nativeElement as HTMLElement;
    fileUpload.click();
  }

  onImagesPicked(fileInput: any) {
    const [file] = fileInput.target.files;
    this.uploadFile(file);
  }

  private uploadFile(file: File) {
    if (file && this.checkIfFileIsAllowed(file) && this.checkIfFileSizeIsAllowed(file)) {
      this.renderFile(file, file.type);
    }
  }

  private checkIfFileIsAllowed(file: File) {
    const fileExtension = file.type.split('/')[0];
    return this.ALLOWED_TYPES.includes(fileExtension);
  }

  private checkIfFileSizeIsAllowed(file: File) {
    return file.size <= this.MAX_FILE_SIZE;
  }

  private renderFile(file: File | string | null, fileType: string) {
    if (!file || !fileType) return;

    if (file instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const photo = reader.result as string;
        this.file.set(file);
        this.preview.set(photo);
        this.formGroup.markAsDirty();
      };
    }
  }

  save() {
    const name = this.formGroup.value.name || '';
    const surname = this.formGroup.value.surname || '';
    const file = this.file();

    this.profile.edit({ name, surname, file });
  }
}
