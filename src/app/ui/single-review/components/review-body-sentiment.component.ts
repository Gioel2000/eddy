import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
	selector: "app-body-review-sentiment",
	template: `
		<div class="grid grid-cols-3">
			<ng-container
				*ngIf="categories | filterArray : 'valutation' : 'positive' as negative"
			>
				<ng-container *ngIf="negative && negative.length">
					<div class="col-span-full mb-6 sm:col-span-1 sm:mb-0">
						<label
							fxLayout="row"
							fxLayoutAlign="start center"
							class="block text-sm font-medium leading-6 text-gray-800 dark:text-gray-200 mb-2"
							>{{ positivei18n | translate }}
						</label>
						<span
							*ngFor="let sentiment of negative"
							class="inline-flex items-center rounded-md dark:bg-green-400/10 px-2 py-1 text-xs font-medium dark:text-green-400 ring-1 ring-inset dark:ring-green-400/20 bg-green-200/70 text-green-700 ring-green-600/10 mr-1 mb-1 shadow cursor-pointer hover:dark:bg-green-400/20 hover:bg-green-100/50"
							(click)="applyFilter(sentiment)"
						>
							<span
								class="svg-icon svg-icon-5 mr-1 text-green-700 dark:text-green-400"
								[inlineSVG]="'./assets/icons/bold/' + sentiment.icon"
							>
							</span>
							{{ sentiment.name }}
						</span>
					</div>
				</ng-container>
			</ng-container>

			<ng-container
				*ngIf="categories | filterArray : 'valutation' : 'negative' as positive"
			>
				<ng-container *ngIf="positive && positive.length">
					<div class="col-span-full mb-6 sm:col-span-1 sm:mb-0">
						<label
							fxLayout="row"
							fxLayoutAlign="start center"
							class="block text-sm font-medium leading-6 text-gray-800 dark:text-gray-200 mb-2"
							>{{ negativei18n | translate }}
						</label>
						<span
							*ngFor="let sentiment of positive"
							class="inline-flex items-center rounded-md dark:bg-red-400/10 px-2 py-1 text-xs font-medium dark:text-red-400 ring-1 ring-inset dark:ring-red-400/20 bg-red-200/70 text-red-700 ring-red-600/10 mr-1 mb-1 shadow cursor-pointer hover:dark:bg-red-400/20 hover:bg-red-100/50"
							(click)="applyFilter(sentiment)"
						>
							<span
								class="svg-icon svg-icon-5 mr-1 text-red-700 dark:text-red-400"
								[inlineSVG]="'./assets/icons/bold/' + sentiment.icon"
							>
							</span>
							{{ sentiment.name }}
						</span>
					</div>
				</ng-container>
			</ng-container>

			<ng-container
				*ngIf="categories | filterArray : 'valutation' : 'neutral' as neutral"
			>
				<ng-container *ngIf="neutral && neutral.length">
					<div class="col-span-full mb-6 sm:col-span-1 sm:mb-0">
						<label
							fxLayout="row"
							fxLayoutAlign="start center"
							class="block text-sm font-medium leading-6 text-gray-800 dark:text-gray-200 mb-2"
							>{{ neutrali18n | translate }}
						</label>
						<span
							*ngFor="let sentiment of neutral"
							class="inline-flex items-center rounded-md dark:bg-yellow-400/10 px-2 py-1 text-xs font-medium dark:text-yellow-400 ring-1 ring-inset dark:ring-yellow-400/20 bg-yellow-200/70 text-yellow-700 ring-yellow-600/10 mr-1 mb-1 shadow cursor-pointer hover:dark:bg-yellow-400/20 hover:bg-yellow-100/50"
							(click)="applyFilter(sentiment)"
						>
							<span
								class="svg-icon svg-icon-5 mr-1 text-yellow-700 dark:text-yellow-400"
								[inlineSVG]="'./assets/icons/bold/' + sentiment.icon"
							>
							</span>
							{{ sentiment.name }}
						</span>
					</div>
				</ng-container>
			</ng-container>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyReviewSentimentComponent {
	@Input() country: string | null = null;
	@Input() categories: {
		icon: string;
		name: string;
		score: number;
		valutation: string;
		category: string;
	}[] = [];

	@Input() positivei18n: string;
	@Input() negativei18n: string;
	@Input() neutrali18n: string;

	constructor(private readonly router: Router) {}

	applyFilter(category: any) {
		const { category: categorySentiment } = category;
		const country = this.country;

		this.router
			.navigateByUrl("/refresh", {
				skipLocationChange: true,
			})
			.then(() =>
				this.router.navigate(["/reviews/reviews"], {
					queryParams: { category: categorySentiment, country },
				})
			);
	}
}
