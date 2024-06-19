import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MenuStoreService } from '../../../store/menu/menu.service';
import { MenuCategoriesComponent } from './categories/categories.component';
import { AddCategoryComponent } from './categories/add/add-category.component';
import { MenuDishesComponent } from './dishes/dishes.component';
import { AddDishComponent } from './dishes/add/add-dish.component';
import { MenusMenuComponent } from './menu/menu.component';
import { AddMenuComponent } from './menu/add/add-menu.component';
import { ShareMenuComponent } from './menu/share/share.component';

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
    ShareMenuComponent,
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
    } @defer (on viewport; prefetch on idle) {
    <share-menu-dialog></share-menu-dialog>
    } @placeholder {
    <div></div>
    } @loading {
    <div></div>
    }

    <div class="mx-auto bg-white dark:bg-dark">
      <div class="block">
        <nav class="hidden sm:flex border-b border-zinc-200 dark:border-zinc-800 pb-6"></nav>
        <div class="grid grid-cols-8 gap-px bg-zinc-200 dark:bg-zinc-800 min-h-screen">
          <div class="bg-white dark:bg-dark col-span-full xl:col-span-5 h-full">
            <div class="pt-0 pb-5 sm:py-5 px-0 xl:pr-7 h-full">
              @defer (on viewport; prefetch on idle) {
              <menu-dishes></menu-dishes>
              } @placeholder {
              <div></div>
              } @loading {
              <div></div>
              }
            </div>
          </div>
          <div class="bg-white dark:bg-dark col-span-full sm:col-span-full xl:col-span-3 py-5 px-0 sm:pl-7">
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
  `,
})
export class MenuComponent {
  store = inject(MenuStoreService);
}
