import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ClickOutsideDirective } from '../../../../../utils/directives/clickoutside';
import { DialogService } from './dialog.service';
import { ReplacePipe } from '../../../../../utils/pipes/replace.pipe';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuStoreService } from '../../../../../store/menu/menu.service';
import { MenuService } from '../../menu.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CURRENCIES } from './currencies';
import { distinctUntilChanged, map } from 'rxjs';
import { ALLERGENS } from './allergens';

@UntilDestroy()
@Component({
  selector: 'add-dish-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, ClickOutsideDirective, ReplacePipe, ReactiveFormsModule],
  template: `
    <div
      class="relative z-[10000]"
      [ngClass]="{
        hidden: dialog.isAllowed() && !dialog.isDialogOpen(),
      }"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-zinc-300 dark:bg-zinc-900 bg-opacity-20 dark:bg-opacity-20 backdrop-blur-md transition-opacity"
      ></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 ring-1  ring-zinc-300 dark:ring-zinc-700 px-4 pb-4 pt-5 text-left shadow-sm shadow-black/10 transition-all sm:my-8 w-full sm:max-w-xl sm:p-6"
            [ngClass]="{
              'opacity-100 translate-y-0 sm:scale-100': dialog.isAllowed() && dialog.isDialogVisible(),
              'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': dialog.isAllowed() && !dialog.isDialogVisible()
            }"
            (clickOutside)="dialog.isAllowed() && dialog.isDialogVisible() && dialog.closeDialog()"
          >
            <div class="flex flex-row items-center justify-between mb-8">
              <span class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {{ menu.dishMode() === 'edit' ? ('EDIT_DISH' | translate) : ('ADD_DISH' | translate) }}
              </span>
              <button
                id="close-add-dish-dialog"
                type="button"
                class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100"
                (click)="dialog.closeDialog()"
              >
                <span class="svg-icon svg-icon-8 stroke-[1.6]">
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <title>xmark</title>
                    <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                      <line
                        x1="14"
                        y1="4"
                        x2="4"
                        y2="14"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        data-color="color-2"
                      ></line>
                      <line
                        x1="4"
                        y1="4"
                        x2="14"
                        y2="14"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></line>
                    </g>
                  </svg>
                </span>
              </button>
            </div>

            <form [formGroup]="formGroup" class="w-full">
              <div class="grid grid-cols-1 gap-x-8 gap-y-10 pb-4 md:grid-cols-2">
                <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                  <div class="col-span-full">
                    <label
                      for="first-name"
                      class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                      >{{ 'NAME' | translate }}</label
                    >
                    <div class="mt-2">
                      <input
                        type="text"
                        name="first-name"
                        id="dish-name"
                        formControlName="name"
                        autocomplete="given-name"
                        class="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                        placeholder="{{ 'DISHES_DESCRIPTION' | translate }}"
                      />
                    </div>
                  </div>
                  <div class="col-span-full">
                    <label for="about" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">{{
                      'DESCRIPTION' | translate
                    }}</label>
                    <div class="mt-2">
                      <textarea
                        id="dish-description"
                        name="about"
                        rows="3"
                        formControlName="description"
                        class="block w-full rounded-md border-0 py-1.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 placeholder:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                        placeholder="{{ 'DISH_DESCRIPTION' | translate }}"
                      ></textarea>
                    </div>
                  </div>
                  <div class="col-span-full">
                    <label
                      for="cover-photo"
                      class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                      >{{ 'PHOTO' | translate }}</label
                    >
                    @if (fileType()?.includes('image')) {
                    <img class="mt-2 w-full h-[190px] object-cover rounded-lg" [src]="imagePreview()" />
                    <button
                      type="button"
                      class="mt-2 text-sm font-semibold text-red-500 hover:underline decoration-2"
                      (click)="removeFile()"
                    >
                      {{ 'REMOVE' | translate }}
                    </button>
                    } @else {
                    <div
                      class="mt-2 flex justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 px-6 py-10"
                      (dragover)="onDragOver($event)"
                      (drop)="onDropSuccess($event)"
                    >
                      <div class="text-center">
                        <svg
                          class="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <div class="mt-4 flex text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                          <label
                            for="file-upload"
                            class="relative cursor-pointer rounded-md font-semibold text-accent dark:text-accentDark focus-within:outline-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 hover:text-accent hover:dark:text-accentDark/70"
                          >
                            <span>{{ 'UPLOAD_IMAGE' | translate }}</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              class="sr-only"
                              (change)="onImagesPicked($event)"
                            />
                          </label>
                          <p class="pl-1 lowercase">{{ 'OR_DRAG_AND_DROP' | translate }}</p>
                        </div>
                        <p class="text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                          {{ 'UPLOAD_MAX_LIMIT' | translate }}
                        </p>
                      </div>
                    </div>
                    }
                  </div>
                  <div class="col-span-full">
                    <div>
                      <label
                        for="location"
                        class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                        >{{ 'CATEGORY' | translate }}</label
                      >
                      <select
                        id="dish-category"
                        name="location"
                        class="mt-2 bg-white dark:bg-zinc-800 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-zinc-900 dark:text-zinc-100 ring-1  ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                        formControlName="category"
                      >
                        @for (category of store.categories(); track $index) {
                        <option [id]="category.name" [value]="category._id">{{ category.name }}</option>
                        }
                      </select>
                    </div>
                  </div>
                  <div class="col-span-full">
                    <div>
                      <label for="price" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">{{
                        'PRICE' | translate
                      }}</label>
                      <div class="relative mt-2 rounded-md bg-white dark:bg-zinc-800">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span class="text-zinc-500 sm:text-sm">
                            {{ selectedCurrency$ | async }}
                          </span>
                        </div>
                        <input
                          type="text"
                          name="price"
                          id="dish-price"
                          formControlName="price"
                          class="block w-full rounded-md bg-white dark:bg-zinc-800 border-0 py-1.5 pl-7 pr-20 text-zinc-900 dark:text-zinc-100 ring-1  ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-accent dark:focus:ring-accent text-sm leading-6"
                          placeholder="0.00"
                        />
                        <div class="absolute inset-y-0 right-0 flex items-center">
                          <label for="currency" class="sr-only">Currency</label>
                          <select
                            id="currency"
                            name="currency"
                            class="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm"
                            formControlName="currency"
                          >
                            @for (currency of currencies; track $index) {
                            <option [value]="currency.key">{{ currency.key }}</option>
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-span-full">
                    <div>
                      <label for="price" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">{{
                        'ALLERGENS' | translate
                      }}</label>
                      <div class="relative mt-2 rounded-md bg-white dark:bg-zinc-800">
                        <fieldset class="border-b border-t border-zinc-200 dark:border-zinc-700">
                          <legend class="sr-only">Notifications</legend>
                          <div class="divide-y divide-zinc-200 dark:divide-zinc-700">
                            @for (allergen of allergens.slice(paginateAllegens().start, paginateAllegens().end); track
                            $index) {
                            <div class="relative flex items-start pb-4 pt-3.5">
                              <div class="min-w-0 flex-1 text-sm leading-6">
                                <label
                                  [for]="allergen.formControlName"
                                  class="font-medium text-zinc-900 dark:text-zinc-100"
                                  >{{ allergen.titlei18n | translate }}</label
                                >
                                <p class="text-zinc-500">
                                  {{ allergen.description | translate }}
                                </p>
                              </div>
                              <div class="ml-3 flex h-6 items-center">
                                <input
                                  type="checkbox"
                                  (change)="checkAllergen(allergen.formControlName)"
                                  [checked]="formGroup.value[allergen.formControlName]"
                                  class="bg-zinc-200 dark:bg-zinc-700 h-4 w-4 rounded border-zinc-300 text-accent dark:text-accentDark focus:ring-accent"
                                />
                              </div>
                            </div>
                            }
                          </div>
                        </fieldset>
                      </div>
                      <nav class="flex items-center justify-between px-4 sm:px-0">
                        <div class="-mt-px flex w-0 flex-1">
                          <button
                            class="inline-flex gap-x-1 items-center border-t-[3px] border-transparent pr-1 pt-4 text-sm font-medium text-zinc-500 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            [disabled]="paginateAllegens().start === 0"
                            (click)="previous()"
                          >
                            <span class="svg-icon svg-icon-7 stroke-[1.5]" inlineSVG="arrow-left.svg"></span>
                            {{ 'PREVIOUS' | translate }}
                          </button>
                        </div>
                        <div class="hidden md:-mt-px md:flex">
                          @for (page of pages; track $index) {
                          <a
                            class="inline-flex items-center px-4 pt-4 text-sm"
                            [ngClass]="{
                              'border-t-[3px] font-semibold border-accent text-accent dark:border-accentDark dark:text-accentDark':
                                currentPage() === $index,
                              'mt-[3px] border-transparent hover:border-t-[3px] hover:mt-0 font-medium text-zinc-500 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300':
                                currentPage() !== $index
                            }"
                            (click)="goTo($index)"
                            >{{ $index + 1 }}</a
                          >
                          }
                        </div>
                        <div class="-mt-px flex w-0 flex-1 justify-end">
                          <button
                            class="inline-flex gap-x-1 items-center border-t-[3px] border-transparent pl-1 pt-4 text-sm font-medium text-zinc-500 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            [disabled]="paginateAllegens().end >= allergens.length"
                            (click)="next()"
                          >
                            {{ 'NEXT' | translate }}
                            <span class="svg-icon svg-icon-7 stroke-[1.5]" inlineSVG="arrow-right.svg"></span>
                          </button>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <button
              id="add-dish"
              class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 mt-6 mb-1 xl:col-span-1 rounded-[10px] w-full h-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-accentDark text-white bg-gradient-to-b from-accent/55 dark:from-accentDark/55 via-accent dark:via-accentDark to-accent dark:to-accentDark p-px shadow-md shadow-black/30"
              [disabled]="formGroup.invalid"
              (click)="done()"
            >
              <div
                class="flex flex-row items-center justify-center gap-x-2 bg-accent dark:bg-accentDark h-full px-3 py-2 w-full rounded-[9px] cursor-pointer"
              >
                <span class="font-semibold text-base">{{ 'DONE' | translate }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AddDishComponent {
  dialog = inject(DialogService);
  store = inject(MenuStoreService);
  menu = inject(MenuService);

  readonly ALLOWED_TYPES = ['image'];
  readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  currencies = CURRENCIES;
  allergens = ALLERGENS;
  pages = Array(Math.ceil(this.allergens.length / 3));
  currentPage = signal(0);

  paginateAllegens = signal({
    start: 0,
    end: 3,
  });

  file = signal<File | string | null>(null);
  fileType = signal<string | null>(null);
  imagePreview = signal<string | null>(null);

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    description: new FormControl('', [Validators.maxLength(1000)]),
    price: new FormControl(0, [
      Validators.required,
      Validators.min(0),
      (control) => (isNaN(control.value) ? { notANumber: true } : null),
    ]),
    category: new FormControl('', [Validators.required]),
    currency: new FormControl('', [Validators.required]),
    gluten: new FormControl(false),
    milk: new FormControl(false),
    crustaceans: new FormControl(false),
    peanuts: new FormControl(false),
    eggs: new FormControl(false),
    fish: new FormControl(false),
    soy: new FormControl(false),
    celery: new FormControl(false),
  });

  selectedCurrency$ = this.formGroup.valueChanges.pipe(
    map((value) => value.currency),
    distinctUntilChanged(),
    map((currency) => this.currencies.find((c) => c.key === currency)?.value || '€')
  );

  constructor() {
    toObservable(this.dialog.isDialogOpen)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const mode = this.menu.dishMode();

        if (mode === 'edit') {
          const dish = this.menu.dish();
          this.formGroup.patchValue({
            name: dish.name,
            description: dish.description,
            category: dish.category,
            price: dish.price,
            currency: dish.currency,
            gluten: dish.allergens.includes('gluten'),
            peanuts: dish.allergens.includes('peanuts'),
            milk: dish.allergens.includes('milk'),
            crustaceans: dish.allergens.includes('crustaceans'),
            eggs: dish.allergens.includes('eggs'),
            fish: dish.allergens.includes('fish'),
            soy: dish.allergens.includes('soy'),
            celery: dish.allergens.includes('celery'),
          });

          if (dish.image) {
            this.imagePreview.set(dish.image);
            this.file.set(dish.image);
            this.fileType.set('image');
          }
        }

        if (mode === 'add') {
          this.formGroup.reset();
          this.formGroup.patchValue({
            currency: this.currencies[0].key,
          });
          this.imagePreview.set(null);
          this.file.set(null);
          this.fileType.set(null);
        }
      });
  }

  previous() {
    this.currentPage.set(this.currentPage() - 1);
    this.paginateAllegens.set({
      start: this.paginateAllegens().start - 3,
      end: this.paginateAllegens().end - 3,
    });
  }

  next() {
    this.currentPage.set(this.currentPage() + 1);
    this.paginateAllegens.set({
      start: this.paginateAllegens().start + 3,
      end: this.paginateAllegens().end + 3,
    });
  }

  goTo(page: number) {
    this.currentPage.set(page);
    this.paginateAllegens.set({
      start: page * 3,
      end: page * 3 + 3,
    });
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDropSuccess(event: any) {
    event.preventDefault();
    this.onFileChange(event.dataTransfer.files);
  }

  private onFileChange(fileInput: File[]) {
    const file = fileInput[0];
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

    this.file.set(file);
    this.fileType.set(fileType);

    if (file instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
    }

    if (typeof file === 'string') {
      this.imagePreview.set(file);
    }
  }

  onImagesPicked(fileInput: any) {
    this.dialog.isAllowed.set(false);
    setTimeout(() => this.dialog.isAllowed.set(true), 0);
    const [file] = fileInput.target.files;
    this.uploadFile(file);
  }

  removeFile() {
    this.dialog.isAllowed.set(false);
    setTimeout(() => this.dialog.isAllowed.set(true), 0);
    this.file.set(null);
    this.fileType.set(null);
    this.imagePreview.set(null);
  }

  checkAllergen(allergen: 'gluten' | 'peanuts' | 'milk' | 'crustaceans' | 'eggs' | 'fish' | 'soy' | 'celery') {
    this.formGroup.patchValue({
      [allergen]: !this.formGroup.value[allergen],
    });
  }

  done() {
    const mode = this.menu.dishMode();

    if (mode === 'add') {
      this.dialog.closeDialog();
      this.store.addDish({
        name: this.formGroup.value.name!,
        description: this.formGroup.value.description || '',
        file: this.file() as File,
        category: this.formGroup.value.category!,
        price: +this.formGroup.value.price!.toString().replace(',', '.') || 0,
        currency: this.formGroup.value.currency!,
        visible: true,
        allergens: [
          this.formGroup.value.gluten ? 'gluten' : '',
          this.formGroup.value.peanuts ? 'peanuts' : '',
          this.formGroup.value.milk ? 'milk' : '',
          this.formGroup.value.crustaceans ? 'crustaceans' : '',
          this.formGroup.value.eggs ? 'eggs' : '',
          this.formGroup.value.fish ? 'fish' : '',
          this.formGroup.value.soy ? 'soy' : '',
          this.formGroup.value.celery ? 'celery' : '',
        ]
          .filter(Boolean)
          .join(','),
      });

      this.formGroup.reset();
      this.formGroup.patchValue({
        currency: this.currencies[0].value,
      });
      this.currentPage.set(0);
      this.paginateAllegens.set({
        start: 0,
        end: 3,
      });

      this.imagePreview.set(null);
      this.file.set(null);
      this.fileType.set(null);
    }

    if (mode === 'edit') {
      this.dialog.closeDialog();
      this.currentPage.set(0);
      this.paginateAllegens.set({
        start: 0,
        end: 3,
      });

      this.store.editDish({
        _id: this.menu.dish()._id,
        name: this.formGroup.value.name!,
        description: this.formGroup.value.description || '',
        file: this.file() instanceof File ? (this.file() as File) : undefined,
        image: this.file() instanceof File ? '' : ((this.file() || '') as string),
        category: this.formGroup.value.category!,
        price: +this.formGroup.value.price!.toString().replace(',', '.') || 0,
        currency: this.formGroup.value.currency!,
        visible: true,
        allergens: [
          this.formGroup.value.gluten ? 'gluten' : '',
          this.formGroup.value.peanuts ? 'peanuts' : '',
          this.formGroup.value.milk ? 'milk' : '',
          this.formGroup.value.crustaceans ? 'crustaceans' : '',
          this.formGroup.value.eggs ? 'eggs' : '',
          this.formGroup.value.fish ? 'fish' : '',
          this.formGroup.value.soy ? 'soy' : '',
          this.formGroup.value.celery ? 'celery' : '',
        ]
          .filter(Boolean)
          .join(','),
      });
    }
  }
}
