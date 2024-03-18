import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AddCategory, CategoryTO, EditCategory, StateModel } from './interfaces/menu';
import { connect } from 'ngxtension/connect';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, forkJoin, map, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { toObservable } from '@angular/core/rxjs-interop';
import { StructureStore } from '../structures/structure.service';

export interface MenuStoreModel {
  categories: {
    data: any[];
    state: StateModel;
  };
}

export const INIT_STATE: MenuStoreModel = {
  categories: {
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

  private stateCategory$ = new Subject<StateModel>();
  private addCategory$ = new Subject<CategoryTO>();
  private editCategory$ = new Subject<CategoryTO>();
  private deleteCategory$ = new Subject<string>();

  constructor() {
    const next$: Observable<MenuStoreModel> = toObservable(this.structure.selected).pipe(
      switchMap(() =>
        forkJoin({
          categories: this.http.get<CategoryTO[]>(`${environment.apiUrl}/api/menus/categories`),
        }).pipe(
          map(
            ({ categories }) =>
              ({
                categories: {
                  data: categories,
                  state: categories.length ? 'loaded' : 'empty',
                },
              } as MenuStoreModel)
          )
        )
      )
    );

    connect(this.store)
      .with(next$)
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
}
