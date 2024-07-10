import { CommonModule } from '@angular/common';
import { Component, WritableSignal, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GoogleMapsModule } from '@angular/google-maps';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { StructureStore } from '../../../store/structures/structure.service';
import { RestaurantSettedTO } from '../../../store/structures/interfaces/restaurant';

export interface MarkerInterface {
  structure: any;
  position: google.maps.LatLngLiteral | google.maps.LatLng;
}

@UntilDestroy()
@Component({
  selector: 'restaurant-panel-overview',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, GoogleMapsModule, ReactiveFormsModule],
  template: `
    @if (structures.selected(); as selectedStructure) {
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-8">
      <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-zinc-500">{{ 'EMAIL' | translate }}</dt>
          <dd id="restaurant-overview-email" class="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
            {{ selectedStructure.email }}
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-zinc-500">{{ 'TELEPHONE' | translate }}</dt>
          <dd id="restaurant-overview-telephone" class="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
            {{ selectedStructure.telephone }}
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-zinc-500">{{ 'ADDRESS' | translate }}</dt>
          <dd id="restaurant-overview-address" class="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
            {{ selectedStructure.address }}
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-zinc-500">{{ 'CITY' | translate }}</dt>
          <dd id="restaurant-overview-city" class="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
            {{ selectedStructure.city }}
          </dd>
        </div>
      </dl>
    </div>
    }

    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 my-8">
      <div class="h-full">
        <dt class="text-sm font-medium text-zinc-500 mb-2">{{ 'MAP' | translate }}</dt>
        <google-map
          class="w-full z-0 rounded-md"
          width="100%"
          height="280px"
          [zoom]="13"
          [center]="center()"
          [options]="{ disableDefaultUI: true }"
        >
          <map-marker *ngFor="let marker of markers()" [position]="marker.position"> </map-marker>
        </google-map>
      </div>
    </div>
  `,
})
export class OverviewRestaurantPanelComponent {
  structures = inject(StructureStore);

  center = signal({ lat: 0, lng: 0 });
  markers: WritableSignal<MarkerInterface[]> = signal([]);

  constructor() {
    toObservable(this.structures.selected)
      .pipe(
        untilDestroyed(this),
        filter((restaurant): restaurant is RestaurantSettedTO => !!restaurant),
        switchMap((structure) =>
          this.getGeoLocation(`${structure.address}, ${structure.city}`).pipe(
            map((position) => ({ position, structure })),
            tap((data) =>
              this.center.set({
                lat: data.position.lat(),
                lng: data.position.lng(),
              })
            )
          )
        )
      )
      .subscribe((marker) => this.markers.set([marker]));

    // const geocoder = new google.maps.Geocoder();
    // const ciao = new google.maps.Geocoder().geocode({
    //   location: { lat: 40.8517746, lng: 14.2681244 },
    // });

    // ciao.then((data) => {
    //   console.log(data);
    // });
  }

  getGeoLocation(address: string): Observable<any> {
    const geocoder = new google.maps.Geocoder();
    return Observable.create((observer: any) => {
      geocoder.geocode(
        {
          address: address,
        },
        (results, status) => {
          if (results)
            if (status == google.maps.GeocoderStatus.OK) {
              observer.next(results[0].geometry.location);
              observer.complete();
            } else {
              observer.error();
            }
        }
      );
    });
  }
}
