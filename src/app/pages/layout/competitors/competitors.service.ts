import { Injectable, effect, inject, signal } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DashboardStore } from '../../../store/dashboard/dashboard.service';
import { CompetitorsStore } from '../../../store/competitors/competitors.service';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class CompetitorsService {
  you = inject(DashboardStore);
  others = inject(CompetitorsStore);
}
