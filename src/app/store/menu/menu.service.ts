import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AddCategory, AddDish, CategoryTO, DishTO, EditCategory, StateModel } from './interfaces/menu';
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
    data: any[];
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

  constructor() {
    const trigger$ = toObservable(this.structure.selected).pipe(untilDestroyed(this));
    const next$: Observable<MenuStoreModel> = trigger$.pipe(
      untilDestroyed(this),
      switchMap(() =>
        forkJoin({
          categories: this.http.get<CategoryTO[]>(`${environment.apiUrl}/api/menus/categories`),
          dishes: this.http.get<DishTO[]>(`${environment.apiUrl}/api/menus/dishes`),
          menus: this.http.get<any[]>(`${environment.apiUrl}/api/menus`),
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
                  state: dishes.length ? 'loaded' : 'loaded', // DEBUG 'empty',
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
          data: [...state.categories.data, category],
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
      }))
      .with(this.addDish$, (state, dish) => ({
        dishes: {
          ...state.dishes,
          data: [...state.dishes.data, dish],
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
      }));

    effect(() => {
      console.log(this.store());
    });
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
    dish.image && formData.append('image', dish.image, dish.image && dish.image.name);
    formData.append('category', dish.category);
    formData.append('price', dish.price.toString());
    formData.append('currency', dish.currency);
    formData.append('visible', dish.visible.toString());
    formData.append('allergens', dish.allergens.join(','));

    this.http
      .post<DishTO>(`${environment.apiUrl}/api/menus/dishes`, dish)
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
}
