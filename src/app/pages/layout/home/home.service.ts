import { Injectable, inject } from '@angular/core';
import { DashboardStore } from '../../../store/dashboard/dashboard.service';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class HomeService {
  store = inject(DashboardStore);
}
