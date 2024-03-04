import { Injectable, inject } from '@angular/core';
import { CalendarStoreService } from './calendar/calendar.service';
import { AssistantStoreService } from './assistant/assistant.service';
import { DayStoreService } from './calendar/day/day.service';
import { CriteriaDayStoreService } from './calendar/day/criteria.service';
import { TravelersTypesStoreService } from './graphs/travelers/travelers.service';
import { SummaryStoreService } from './graphs/summary/summary.service';
import { HotelsSegmentsStoreService } from './graphs/segments/segments.service';
import { HotelsReviewStoreService } from './graphs/reviews/reviews.service';

@Injectable({ providedIn: 'root' })
export class Store {
  calendar = inject(CalendarStoreService);
  assistant = inject(AssistantStoreService);
  day = inject(DayStoreService);
  criteriaDay = inject(CriteriaDayStoreService);

  travellersGraph = inject(TravelersTypesStoreService);
  summaryGraph = inject(SummaryStoreService);
  segmentGraph = inject(HotelsSegmentsStoreService);
  reviewsGraph = inject(HotelsReviewStoreService);
}
