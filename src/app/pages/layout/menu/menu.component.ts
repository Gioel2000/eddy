import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuStoreService } from '../../../store/menu/menu.service';
import { MenuCategoriesComponent } from './categories/categories.component';
import { AddCategoryComponent } from './categories/add/add-category.component';
import { MenuDishesComponent } from './dishes/dishes.component';
import { AddDishComponent } from './dishes/add/add-dish.component';
import { MenusMenuComponent } from './menu/menu.component';
import { AddMenuComponent } from './menu/add/add-menu.component';

@Component({
  selector: 'menu',
  standalone: true,
  imports: [
    TranslateModule,
    MenuCategoriesComponent,
    AddCategoryComponent,
    MenuDishesComponent,
    AddDishComponent,
    MenusMenuComponent,
    AddMenuComponent,
  ],
  template: `
    @defer (on viewport; prefetch on idle) {
    <add-category-dialog></add-category-dialog>
    } @placeholder {
    <div></div>
    } @loading {
    <div></div>
    } @defer (on viewport; prefetch on idle) {
    <add-dish-dialog></add-dish-dialog>
    } @placeholder {
    <div></div>
    } @loading {
    <div></div>
    } @defer (on viewport; prefetch on idle) {
    <add-menu-dialog></add-menu-dialog>
    } @placeholder {
    <div></div>
    } @loading {
    <div></div>
    }

    <div class="h-full lg:pr-10 lg:pl-3 px-4">
      <h1 class="hidden sm:block text-xl font-medium text-zinc-900 dark:text-zinc-100">{{ 'MENU' | translate }}</h1>
      <div class="mx-auto bg-zinc-50 dark:bg-dark">
        <div class="block">
          <nav class="flex border-b border-zinc-200 dark:border-zinc-800 pb-6"></nav>
          <div class="grid grid-cols-10 min-h-screen gap-px bg-zinc-200 dark:bg-zinc-800">
            <div class="bg-zinc-50 dark:bg-dark col-span-full sm:col-span-4 xl:col-span-2 py-5 px-0 sm:pr-5">
              @defer (on viewport; prefetch on idle) {
              <menu-categories></menu-categories>
              } @placeholder {
              <div></div>
              } @loading {
              <div></div>
              }
            </div>
            <div class="bg-zinc-50 dark:bg-dark col-span-full sm:col-span-6 xl:col-span-3 py-5 px-0 sm:px-5">
              @defer (on viewport; prefetch on idle) {
              <menu-dishes></menu-dishes>
              } @placeholder {
              <div></div>
              } @loading {
              <div></div>
              }
            </div>

            <div class="bg-zinc-50 dark:bg-dark col-span-full sm:col-span-full xl:col-span-5 py-5 px-0 sm:px-5">
              @defer (on viewport; prefetch on idle) {
              <menu-menus></menu-menus>
              } @placeholder {
              <div></div>
              } @loading {
              <div></div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MenuComponent {
  store = inject(MenuStoreService);
}
