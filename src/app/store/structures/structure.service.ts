import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { environment } from '../../../environments/environment';
import { Subject, distinctUntilChanged, map, mergeMap, toArray } from 'rxjs';
import { CheckHotel, HotelModel, HotelTOModel } from './interfaces/hotel';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

export interface StructuresStore {
  structures: HotelModel[];
  structuresToSave: HotelModel[];
  state: 'loaded' | 'loading' | 'error' | 'empty';
}

@Injectable({ providedIn: 'root' })
export class StructureStore {
  http = inject(HttpClient);

  private store = signal<StructuresStore>({
    structures: [],
    structuresToSave: [],
    state: 'loading',
  });

  hotels = computed(() => this.store().structures);
  hotelsToSave = computed(() => this.store().structuresToSave);
  canSave = computed(() => {
    const structures = this.store().structures;
    const newStructuresToSave = this.store().structuresToSave;

    const uniqueIdsStructures = structures
      .filter((structure) => structure.selected)
      .sort((a, b) => a._id.localeCompare(b._id))
      .map((structure) => structure._id);

    const uniqueIdsNewStructures = newStructuresToSave
      .filter((structure) => structure.selected)
      .sort((a, b) => a._id.localeCompare(b._id))
      .map((structure) => structure._id);

    const areDifferent = JSON.stringify(uniqueIdsStructures) !== JSON.stringify(uniqueIdsNewStructures);
    const someStructureSelected = newStructuresToSave.some((structure) => structure.selected);

    return areDifferent && someStructureSelected;
  });

  hotelsSelected = toObservable(
    toSignal(
      toObservable(computed(() => this.store().structures.filter((structure) => structure.selected))).pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      ),
      { initialValue: [] }
    )
  );

  hotelsSelectedIds = toObservable(
    toSignal(
      toObservable(
        computed(() =>
          this.store()
            .structures.filter((structure) => structure.selected)
            .map((hotel) => hotel._id)
        )
      ).pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))),
      { initialValue: [] }
    )
  );

  canSelectAll = computed(() => this.store().structuresToSave.some((structure) => !structure.selected));

  status = computed(() => this.store().state);

  check$ = new Subject<CheckHotel>();
  search$ = new Subject<string>();
  save$ = new Subject<void>();
  selectAll$ = new Subject<void>();
  deselectAll$ = new Subject<void>();

  constructor() {
    const next$ = this.getStructures().pipe(
      mergeMap((structures) => structures),
      map((structure) => ({ ...structure, selected: true, show: true })),
      toArray(),
      map((structures) => ({ structures, structuresToSave: structures, state: 'loaded' as const }))
    );

    connect(this.store)
      .with(next$)
      .with(this.check$, (store: StructuresStore, checkHotel: CheckHotel) => ({
        ...store,
        structuresToSave: store.structuresToSave.map((structure) =>
          structure._id === checkHotel.id ? { ...structure, selected: checkHotel.selected } : structure
        ),
      }))
      .with(this.save$, (store: StructuresStore) => ({
        ...store,
        structures: store.structuresToSave,
      }))
      .with(this.selectAll$, (store: StructuresStore) => ({
        ...store,
        structuresToSave: store.structuresToSave.map((structure) => ({ ...structure, selected: true })),
      }))
      .with(this.deselectAll$, (store: StructuresStore) => ({
        ...store,
        structuresToSave: store.structuresToSave.map((structure) => ({ ...structure, selected: false })),
      }))
      .with(this.search$, (store: StructuresStore, search: string) => {
        const filter = (field: 'name' | 'city' | 'address', hotel: HotelModel) =>
          hotel[field].toLowerCase().includes(search.toLowerCase());

        const fiteredHotel = store.structuresToSave.filter(
          (hotel) => filter('name', hotel) || filter('city', hotel) || filter('address', hotel)
        );

        return {
          ...store,
          structuresToSave: store.structuresToSave.map((hotel) => ({
            ...hotel,
            show: fiteredHotel.some((h) => h._id === hotel._id),
          })),
          state: fiteredHotel.length > 0 ? ('loaded' as const) : ('empty' as const),
        };
      });
  }

  private getStructures() {
    return this.http.get<HotelTOModel[]>(`${environment.apiUrl}/api/hotels`);
  }
}
