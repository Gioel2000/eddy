import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  AddCategory,
  AddDish,
  AddMenu,
  CategoryTO,
  DishTO,
  EditCategory,
  EditDish,
  EditMenu,
  MenuTO,
  StateModel,
} from './interfaces/menu';
import { connect } from 'ngxtension/connect';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { toObservable } from '@angular/core/rxjs-interop';
import { StructureStore } from '../structures/structure.service';

export interface MenuStoreModel {
  categories: {
    data: CategoryTO[];
    state: StateModel;
  };
  dishes: {
    data: DishTO[];
    state: StateModel;
  };
  menus: {
    data: MenuTO[];
    state: StateModel;
  };
}

export const INIT_STATE: MenuStoreModel = {
  categories: {
    data: [],
    state: 'loading',
  },
  dishes: {
    data: [],
    state: 'loading',
  },
  menus: {
    data: [],
    state: 'loading',
  },
};

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class MenuStoreService {
  private structure = inject(StructureStore);
  private http = inject(HttpClient);
  private store = signal<MenuStoreModel>(INIT_STATE);

  categories = computed(() => this.store().categories.data as CategoryTO[]);
  categoriesState = computed(() => this.store().categories.state);

  dishes = computed(() => this.store().dishes.data);
  dishesState = computed(() => this.store().dishes.state);

  menus = computed(() => this.store().menus.data);
  menusState = computed(() => this.store().menus.state);

  private stateCategory$ = new Subject<StateModel>();
  private addCategory$ = new Subject<CategoryTO>();
  private editCategory$ = new Subject<CategoryTO>();
  private deleteCategory$ = new Subject<string>();

  private stateDish$ = new Subject<StateModel>();
  private addDish$ = new Subject<DishTO>();
  private editDish$ = new Subject<DishTO>();
  private deleteDish$ = new Subject<string>();

  private stateMenu$ = new Subject<StateModel>();
  private addMenu$ = new Subject<MenuTO>();
  private editMenu$ = new Subject<MenuTO>();
  private deleteMenu$ = new Subject<string>();

  constructor() {
    const trigger$ = toObservable(this.structure.selected).pipe(untilDestroyed(this));
    const next$: Observable<MenuStoreModel> = trigger$.pipe(
      untilDestroyed(this),
      switchMap(() =>
        forkJoin({
          categories: this.http.get<CategoryTO[]>(`${environment.apiUrl}/api/menus/categories`),
          dishes: this.http.get<DishTO[]>(`${environment.apiUrl}/api/menus/dishes`),
          menus: this.http.get<MenuTO[]>(`${environment.apiUrl}/api/menus`),
        }).pipe(
          map(
            ({ categories, dishes, menus }) =>
              ({
                categories: {
                  data: categories,
                  state: categories.length ? 'loaded' : 'empty',
                },
                dishes: {
                  data: dishes,
                  state: dishes.length ? 'loaded' : 'empty',
                },
                menus: {
                  data: menus,
                  state: menus.length ? 'loaded' : 'empty',
                },
              } as MenuStoreModel)
          ),
          catchError(() => {
            return of({
              categories: {
                data: [],
                state: 'error',
              },
              dishes: {
                data: [],
                state: 'error',
              },
              menus: {
                data: [],
                state: 'error',
              },
            } as MenuStoreModel);
          })
        )
      )
    );

    connect(this.store)
      .with(next$)
      .with(trigger$, (state) => ({
        categories: {
          ...state.categories,
          state: 'loading',
        },
        dishes: {
          ...state.dishes,
          state: 'loading',
        },
      }))
      .with(this.addCategory$, (state, category) => ({
        categories: {
          ...state.categories,
          data: [category, ...state.categories.data],
        },
      }))
      .with(this.stateCategory$, (state, stateCategory) => ({
        categories: {
          ...state.categories,
          state: stateCategory,
        },
      }))
      .with(this.editCategory$, (state, category) => ({
        categories: {
          ...state.categories,
          data: state.categories.data.map((c) => (c._id === category._id ? category : c)),
        },
      }))
      .with(this.deleteCategory$, (state, categoryId) => ({
        categories: {
          ...state.categories,
          data: state.categories.data.filter((c) => c._id !== categoryId),
        },
        menus: {
          ...state.menus,
          data: state.menus.data.map((m) => ({
            ...m,
            categories: m.categories.filter((c) => c.category !== categoryId),
          })),
        },
        dishes: {
          ...state.dishes,
          data: state.dishes.data.map((d) => (d.category !== categoryId ? d : { ...d, category: '' })),
        },
      }))
      .with(this.addDish$, (state, dish) => ({
        dishes: {
          ...state.dishes,
          data: [dish, ...state.dishes.data],
        },
      }))
      .with(this.stateDish$, (state, stateDish) => ({
        dishes: {
          ...state.dishes,
          state: stateDish,
        },
      }))
      .with(this.editDish$, (state, dish) => ({
        dishes: {
          ...state.dishes,
          data: state.dishes.data.map((d) => (d._id === dish._id ? dish : d)),
        },
      }))
      .with(this.deleteDish$, (state, dishId) => ({
        dishes: {
          ...state.dishes,
          data: state.dishes.data.filter((d) => d._id !== dishId),
        },
        menus: {
          ...state.menus,
          data: state.menus.data.map((m) => ({
            ...m,
            dishes: m.dishes.filter((d) => d.dish !== dishId),
          })),
        },
      }))
      .with(this.addMenu$, (state, menu) => ({
        ...state,
        menus: {
          ...state.menus,
          data: [menu, ...state.menus.data],
        },
      }))
      .with(this.stateMenu$, (state, stateMenu) => ({
        menus: {
          ...state.menus,
          state: stateMenu,
        },
      }))
      .with(this.editMenu$, (state, menu) => ({
        menus: {
          ...state.menus,
          data: state.menus.data.map((m) => (m._id === menu._id ? menu : m)),
        },
      }))
      .with(this.deleteMenu$, (state, menuId) => ({
        menus: {
          ...state.menus,
          data: state.menus.data.filter((m) => m._id !== menuId),
        },
      }));
  }

  addCategory(category: AddCategory) {
    this.stateCategory$.next('loading');

    this.http
      .post<CategoryTO>(`${environment.apiUrl}/api/menus/categories`, category)
      .pipe(
        untilDestroyed(this),
        tap((category) => {
          this.stateCategory$.next('loaded');
          this.addCategory$.next(category);
        }),
        catchError((error) => {
          this.stateCategory$.next('error');
          return error;
        })
      )
      .subscribe();
  }

  editCategory(category: EditCategory) {
    this.stateCategory$.next('loading');

    this.http
      .put<CategoryTO>(`${environment.apiUrl}/api/menus/categories/${category._id}`, category)
      .pipe(
        untilDestroyed(this),
        tap((category) => {
          this.stateCategory$.next('loaded');
          this.editCategory$.next(category);
        }),
        catchError((error) => {
          this.stateCategory$.next('error');
          return error;
        })
      )
      .subscribe();
  }

  deleteCategory(categoryId: string) {
    this.stateCategory$.next('loading');

    this.http
      .delete<CategoryTO>(`${environment.apiUrl}/api/menus/categories/${categoryId}`)
      .pipe(
        untilDestroyed(this),
        tap(() => {
          this.stateCategory$.next('loaded');
          this.deleteCategory$.next(categoryId);
        }),
        catchError((error) => {
          this.stateCategory$.next('error');
          return error;
        })
      )
      .subscribe();
  }

  addDish(dish: AddDish) {
    this.stateDish$.next('loading');

    const formData = new FormData();
    formData.append('name', dish.name);
    formData.append('description', dish.description || '');
    dish.file && formData.append('file', dish.file as File, 'file');
    formData.append('category', dish.category);
    formData.append('price', dish.price.toString());
    formData.append('currency', dish.currency);
    formData.append('visible', dish.visible.toString());
    formData.append('allergens', dish.allergens || '');

    this.http
      .post<DishTO>(`${environment.apiUrl}/api/menus/dishes`, formData)
      .pipe(
        untilDestroyed(this),
        tap((dish) => {
          this.stateDish$.next('loaded');
          this.addDish$.next(dish);
        }),
        catchError((error) => {
          this.stateDish$.next('error');
          return error;
        })
      )
      .subscribe();
  }

  editDish(dish: EditDish) {
    this.stateDish$.next('loading');

    const formData = new FormData();
    formData.append('name', dish.name);
    formData.append('description', dish.description || '');
    dish.file && formData.append('file', dish.file as File, 'file');
    formData.append('image', dish.image || '');
    formData.append('category', dish.category);
    formData.append('price', dish.price.toString());
    formData.append('currency', dish.currency);
    formData.append('visible', dish.visible.toString());
    formData.append('allergens', dish.allergens || '');

    this.http
      .put<DishTO>(`${environment.apiUrl}/api/menus/dishes/${dish._id}`, formData)
      .pipe(
        untilDestroyed(this),
        tap((dish) => {
          this.stateDish$.next('loaded');
          this.editDish$.next(dish);
        }),
        catchError((error) => {
          this.stateDish$.next('error');
          return error;
        })
      )
      .subscribe();
  }

  deleteDish(dishId: string) {
    this.stateDish$.next('loading');

    this.http
      .delete<DishTO>(`${environment.apiUrl}/api/menus/dishes/${dishId}`)
      .pipe(
        untilDestroyed(this),
        tap(() => {
          this.stateDish$.next('loaded');
          this.deleteDish$.next(dishId);
        }),
        catchError((error) => {
          this.stateDish$.next('error');
          return error;
        })
      )
      .subscribe();
  }

  addMenu(menu: AddMenu) {
    this.stateMenu$.next('loading');

    this.http
      .post<MenuTO>(`${environment.apiUrl}/api/menus`, menu)
      .pipe(
        untilDestroyed(this),
        tap((menu) => {
          this.stateMenu$.next('loaded');
          this.addMenu$.next(menu);
        }),
        catchError((error) => {
          this.stateMenu$.next('error');
          return error;
        })
      )
      .subscribe();
  }

  editMenu(menu: EditMenu) {
    this.stateMenu$.next('loading');

    this.http
      .put<MenuTO>(`${environment.apiUrl}/api/menus/${menu._id}`, menu)
      .pipe(
        untilDestroyed(this),
        tap((menu) => {
          this.stateMenu$.next('loaded');
          this.editMenu$.next(menu);
        }),
        catchError((error) => {
          this.stateMenu$.next('error');
          return error;
        })
      )
      .subscribe();
  }

  deleteMenu(menuId: string) {
    this.stateMenu$.next('loading');

    this.http
      .delete<MenuTO>(`${environment.apiUrl}/api/menus/${menuId}`)
      .pipe(
        untilDestroyed(this),
        tap(() => {
          this.stateMenu$.next('loaded');
          this.deleteMenu$.next(menuId);
        }),
        catchError((error) => {
          this.stateMenu$.next('error');
          return error;
        })
      )
      .subscribe();
  }
}
