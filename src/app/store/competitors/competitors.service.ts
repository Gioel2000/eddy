import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { connect } from 'ngxtension/connect';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StructureStore } from '../structures/structure.service';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  Observable,
  combineLatest,
  delay,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  mergeMap,
  switchMap,
} from 'rxjs';
import { CompetitorModel, CompetitorTO, StateModel } from './interfaces/competitors';
import moment from 'moment';

export interface CompetitorsStoreModel {
  data: CompetitorModel[];
  state: StateModel;
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class CompetitorsStore {
  http = inject(HttpClient);
  structure = inject(StructureStore);

  private store = signal<CompetitorsStoreModel>({
    data: [{} as CompetitorModel, {} as CompetitorModel],
    state: 'loading',
  });

  filter = signal({
    startdate: moment().subtract(2, 'weeks').toDate(),
    enddate: moment().toDate(),
    channels: ['thefork', 'tripadvisor', 'google'],
  });

  competitor = computed(() => this.store().data);
  state = computed(() => this.store().state);

  constructor() {
    const stream$ = combineLatest({
      selected: toObservable(this.structure.selected),
      filter: toObservable(this.filter).pipe(
        map(({ startdate, enddate, channels }) => ({
          startdate: moment(startdate).format('YYYY-MM-DD'),
          enddate: moment(enddate).format('YYYY-MM-DD'),
          channels: channels.join(','),
        }))
      ),
    }).pipe(
      untilDestroyed(this),
      filter(({ selected }) => !!selected),
      filter(({ selected }) => Object.keys(selected).length > 0),
      distinctUntilChanged((prev, curr) => prev.selected === curr.selected && prev.filter === curr.filter)
    );

    const next$: Observable<CompetitorsStoreModel> = stream$.pipe(
      untilDestroyed(this),
      switchMap(({ selected, filter }) =>
        forkJoin(
          selected.competitors.map((competitor) =>
            this.http.get<CompetitorTO>(`${environment.apiUrl}/api/competitors/${competitor}`).pipe(
              mergeMap((data) =>
                forkJoin({
                  reputation: this.http.post(
                    `${environment.apiUrl}/api/competitors/${competitor}/graph/average`,
                    filter
                  ),
                  rating: this.http.post(`${environment.apiUrl}/api/competitors/${competitor}/rating/grouped`, filter),
                  clientTypes: this.http.post(
                    `${environment.apiUrl}/api/competitors/${competitor}/clientType/grouped`,
                    filter
                  ),
                  reviews: this.http.get(`${environment.apiUrl}/api/competitors/${competitor}/last/week/2`),
                }).pipe(map((response) => ({ ...data, ...response })))
              )
            )
          )
        )
      ),
      map((data) => ({ data, state: 'loaded' } as CompetitorsStoreModel))
    );

    connect(this.store)
      .with(next$)
      .with(stream$, () => ({ data: [{} as CompetitorModel, {} as CompetitorModel], state: 'loading' }));
  }
}
