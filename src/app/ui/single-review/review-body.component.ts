import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Subject, filter, map } from "rxjs";
import { ReviewsService } from "src/app/layout/pages/reviews/reviews.service";
import { fadeInAnimation } from "src/app/utils/animations/fade";
import {
	NumberContants,
	StringConstants,
	Volumes,
} from "src/app/utils/constant/constants";
import { MISSING_TRANSLATION } from "src/app/utils/constant/types/missingTranslation";
import { ReviewModel } from "../../../../reviews.model";
import { SERVICES } from "../../reviews.data";
import LanguageDetect from "languagedetect";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { FrancisService } from "src/app/layout/components/francis/francis.service";
import { FrancisState } from "src/app/layout/components/francis/francis-data";

@UntilDestroy()
@Component({
	selector: "app-body-review",
	animations: [fadeInAnimation],
	template: `
		<div class="z-100 {{ isCompare ? '' : 'mb-12 sm:ml-16' }}">
			<ng-container *ngLet="reviewContent$ | async as reviewContent">
				<div class="grid grid-cols-6 my-8">
					<div
						class="flex flex-row items-center col-span-full sm:col-span-4 mb-5 sm:mb-0"
					>
						<h3 class="text-lg text-gray-800 dark:text-gray-200 mb-2 mr-2">
							{{ reviewContent.title }}
						</h3>
						<span
							*ngIf="review.isTitleTranslated"
							[inlineSVG]="'./assets/icons/bold/Translate language.svg'"
							class="svg-icon svg-icon-1 text-gray-700 dark:text-gray-300 cursor-pointer mb-1"
						></span>
					</div>

					<div class="col-span-full xl:col-span-2">
						<div
							class="flex flex-row items-center justify-start sm:justify-end mb-3"
						>
							<div *ngFor="let avr of calculateStars(review.score)">
								<span
									*ngIf="avr === 'full'"
									[inlineSVG]="'./assets/icons/bold/Star.svg'"
									class="svg-icon svg-icon-3 text-yellow-500 dark:text-yellow-400"
								></span>
								<span
									*ngIf="avr === 'half'"
									[inlineSVG]="'./assets/icons/bulk/Star.svg'"
									class="svg-icon svg-icon-3 text-yellow-500 dark:text-yellow-400"
								></span>
								<span
									*ngIf="avr === 'empty'"
									[inlineSVG]="'./assets/icons/bold/Star.svg'"
									class="svg-icon svg-icon-3 text-black/10 dark:text-white/10"
								></span>
							</div>
							<dd
								class="ml-2 w-10 text-right text-sm tabular-nums text-gray-900 dark:text-gray-100"
							>
								{{
									(review.score * amountToMultiply).toFixed(1)
										| replace : ".0" : ""
								}}/{{ scale }}
							</dd>
						</div>

						<ng-container *ngIf="sentimentVote$ | async as vote">
							<div
								class="flex flex-row items-center justify-start sm:justify-end mb-3"
							>
								<div
									*ngFor="
										let avr of calculateHearts(scale === 5 ? vote / 2 : vote)
									"
								>
									<span
										*ngIf="avr === 'full'"
										[inlineSVG]="'./assets/icons/bold/Heart symbols.svg'"
										class="svg-icon svg-icon-3 text-red-500 dark:text-red-500"
									></span>
									<span
										*ngIf="avr === 'half'"
										[inlineSVG]="'./assets/icons/bulk/Heart symbols.svg'"
										class="svg-icon svg-icon-3 text-red-500 dark:text-red-500"
									></span>
									<span
										*ngIf="avr === 'empty'"
										[inlineSVG]="'./assets/icons/bold/Heart symbols.svg'"
										class="svg-icon svg-icon-3 text-black/10 dark:text-white/10"
									></span>
								</div>
								<dd
									class="ml-2 w-10 text-right text-sm tabular-nums text-gray-900 dark:text-gray-100"
								>
									{{
										(scale === 5 ? vote / 2 : vote).toFixed(1)
											| replace : ".0" : ""
									}}/{{ scale }}
								</dd>
							</div>
						</ng-container>
					</div>
				</div>
				<div *ngIf="reviewContent?.pros as pros">
					<div fxLayout="row" fxLayoutAlign="start center" class="mb-1">
						<span
							[inlineSVG]="'./assets/icons/bold/Happy.svg'"
							class="svg-icon svg-icon-1 text-green-500 mt-4 mr-2"
						></span>
						<span
							class="text-sm mt-4 max-w-none text-gray-500"
							[innerHTML]="pros"
						></span>
					</div>
				</div>
				<div *ngIf="reviewContent?.cons as cons">
					<div fxLayout="row" fxLayoutAlign="start center">
						<span
							[inlineSVG]="'./assets/icons/bold/Slightly Frowning.svg'"
							class="svg-icon svg-icon-1 text-red-500 mt-4 mr-2"
						></span>
						<span
							class="text-sm mt-4 max-w-none text-gray-500"
							[innerHTML]="cons"
						></span>
					</div>
				</div>
				<div *ngIf="reviewContent?.text as text">
					<span
						class="text-sm mt-4 max-w-none text-gray-500"
						[innerHTML]="text"
					></span>
				</div>

				<div class="mt-5">
					<ng-container *ngIf="categories$ | async as categories">
						<ng-container *ngIf="categories && categories.length">
							<app-body-review-sentiment
								[categories]="categories"
								positivei18n="REVIEWS.SPEAK_WELL"
								negativei18n="REVIEWS.SPEAK_BAD"
								neutrali18n="REVIEWS.SPEAK_NEUTRAL"
							></app-body-review-sentiment>
						</ng-container>
					</ng-container>
				</div>

				<div class="mt-2 mb-3">
					<div class="grid grid-cols-6 w-full pt-3 sm:pt-6">
						<div class="col-span-3 mb-6 sm:col-span-2 sm:mb-0">
							<label
								fxLayout="row"
								fxLayoutAlign="start center"
								class="block text-sm font-medium leading-6 text-gray-800 dark:text-gray-200"
								>{{ "REVIEWS.SERVICE" | translate }}
							</label>
							<div class="flex flex-row items-center mt-1 pr-2 py-1 z-100">
								<div
									*ngIf="review.service.source === 'booking'"
									fxLayout="row"
									fxLayoutAlign="center center"
									class="bg-[#0171c2] rounded-full text-sm font-semibold text-gray-900 shadow px-3 py-2.5 inline-flex items-center gap-x-1.5"
								>
									<span
										[inlineSVG]="'./assets/icons/custom/booking.svg'"
										class="svg-icon svg-icon-3"
									></span>
									<span class="text-white/90 mr-2">Booking</span>
								</div>
								<div
									*ngIf="review.service.source === 'expedia'"
									fxLayout="row"
									fxLayoutAlign="center center"
									class="bg-white rounded-full text-sm font-semibold text-gray-900 shadow px-3 py-2.5 inline-flex items-center gap-x-1.5"
								>
									<span
										[inlineSVG]="'./assets/icons/custom/expedia.svg'"
										class="svg-icon svg-icon-3"
									></span>
									<span class="text-gray-700 mr-2">Expedia</span>
								</div>
								<div
									*ngIf="review.service.source === 'tripadvisor'"
									fxLayout="row"
									fxLayoutAlign="center center"
									class="bg-[#35e0a1] rounded-full text-sm font-semibold text-gray-900 shadow px-3 py-2.5 inline-flex items-center gap-x-1.5"
								>
									<span
										[inlineSVG]="'./assets/icons/custom/tripadvisor.svg'"
										class="svg-icon svg-icon-3"
									></span>
									<span class="text-gray-700 mr-2">TripAdvisor</span>
								</div>
								<div
									*ngIf="review.service.source === 'google'"
									fxLayout="row"
									fxLayoutAlign="center center"
									class="bg-white rounded-full text-sm font-semibold text-gray-900 shadow px-3 py-2.5 inline-flex items-center gap-x-1.5"
								>
									<span
										[inlineSVG]="'./assets/icons/custom/google.svg'"
										class="svg-icon svg-icon-3"
									></span>
									<span class="text-gray-700 mr-2">Google</span>
								</div>
							</div>
						</div>

						<div class="col-span-3 mb-6 sm:col-span-2 sm:mb-0">
							<label
								fxLayout="row"
								fxLayoutAlign="start center"
								class="block text-sm font-medium leading-6 text-gray-800 dark:text-gray-200"
								>{{ "REVIEWS.TRAVELLER_TYPE" | translate }}
							</label>
							<div class="flex flex-row items-center mt-3 pr-2 py-1 z-100">
								<ng-container
									*ngIf="review?.travelersType?.length; else noTravelType"
								>
									<ng-container
										*ngIf="review.travelersType[0] as travellerType"
									>
										<span class="font-medium text-sm text-gray-500">{{
											"REVIEWS." + travellerType
												| uppercase
												| translate
												| missingTranslation : travellerType
										}}</span>
									</ng-container>
								</ng-container>

								<ng-template #noTravelType>
									<span class="font-medium text-sm text-gray-500">
										{{ "UNKNOWN" | translate }}
									</span>
								</ng-template>
							</div>
						</div>

						<div class="col-span-3 mb-6 sm:col-span-2 sm:mb-0">
							<label
								fxLayout="row"
								fxLayoutAlign="start center"
								class="block text-sm font-medium leading-6 text-gray-800 dark:text-gray-200"
								>{{ "REVIEWS.ROOM" | translate }}
							</label>
							<div class="flex flex-row items-center mt-3 pr-2 py-1 z-100">
								<ng-container *ngIf="review?.room?.name; else noRoom">
									<ng-container *ngIf="review?.room?.name as roomName">
										<span class="font-medium text-sm text-gray-500">{{
											roomName
										}}</span>
									</ng-container>
								</ng-container>

								<ng-template #noRoom>
									<span class="font-medium text-sm text-gray-500">
										{{ "UNKNOWN" | translate }}
									</span>
								</ng-template>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-2 mb-3">
					<div class="grid grid-cols-6 w-full py-3 sm:py-6">
						<div class="col-span-3 mb-6 sm:col-span-2 sm:mb-0">
							<label
								fxLayout="row"
								fxLayoutAlign="start center"
								class="block text-sm font-medium leading-6 text-gray-800 dark:text-gray-200"
								>{{ "REVIEWS.COUNTRY" | translate }}
							</label>
							<div
								class="flex flex-row items-center mt-1 sm:mt-3 pr-2 py-1 z-100"
							>
								<ng-container *ngIf="review.country; else noCountry">
									<img
										*ngIf="
											replaceAll(review.country.toLowerCase(), ' ', '-')
												.length > 0
										"
										class="w-8 h-6 rounded object-cover shadow mr-2"
										alt=""
										[src]="
											'./assets/flags/' +
											replaceAll(review.country.toLowerCase(), ' ', '-') +
											'.svg'
										"
									/>
									<span class="font-medium text-sm text-gray-500">{{
										review.country
									}}</span>
								</ng-container>
								<ng-template #noCountry>
									<span class="font-medium text-sm text-gray-500">
										{{ "UNKNOWN" | translate }}
									</span>
								</ng-template>
							</div>
						</div>

						<div class="col-span-3 mb-6 sm:col-span-2 sm:mb-0">
							<label
								fxLayout="row"
								fxLayoutAlign="start center"
								class="block text-sm font-medium leading-6 text-gray-800 dark:text-gray-200"
								>{{ "REVIEWS.ORIGINAL_LANG" | translate }}
							</label>
							<div
								class="flex flex-row items-center mt-1 sm:mt-3 pr-2 py-1 z-100"
							>
								<ng-container *ngLet="originalLangKey$ | async as lang">
									<div
										fxLayout="column"
										*ngIf="
											lang.trim().length > 0 &&
												(reviewContent?.text ||
													reviewContent?.pros ||
													reviewContent?.cons);
											else noLang
										"
									>
										<span class="font-medium text-sm text-gray-500">
											{{
												lang
													| translate
													| missingTranslation : ("UNKNOWN" | translate)
											}}
										</span>
									</div>
									<ng-template #noLang>
										<span class="font-medium text-sm text-gray-500">
											{{ "UNKNOWN" | translate }}
										</span>
									</ng-template>
								</ng-container>
							</div>
						</div>

						<div class="col-span-full mb-6 sm:col-span-2 sm:mb-0">
							<ng-container *ngIf="(canBeTranslated$ | async) === true">
								<label
									fxLayout="row"
									fxLayoutAlign="start center"
									class="block text-sm font-medium leading-6 text-gray-800 dark:text-gray-200"
									>{{ "REVIEWS.TRANSLATE" | translate }}
									<ng-container *ngIf="isLoading$ | async" class="ml-1">
										<div
											class="ml-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-gray-700 dark:text-gray-300"
											role="status"
										>
											<span
												class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
												>Loading...</span
											>
										</div>
									</ng-container>
								</label>
								<div
									class="mt-2 pr-1 py-0.5 rounded-md ring-2 ring-gray-300 dark:ring-gray-600 z-100 focus:ring-accent-100"
								>
									<select
										[formControl]="langSwitcher"
										id="location"
										name="location"
										class="block w-full rounded-md border-0 bg-transparent py-1 pl-2 pr-8 font-medium text-gray-500 text-sm sm:leading-6 focus:ring-accent-100 focus:ring-0 focus:border-transparent"
									>
										<option value="your_language">
											{{ "YOUR_LANGUAGE" | translate }}
										</option>
										<option value="en">
											{{ "LANGS.english" | translate }}
										</option>
										<option value="it">
											{{ "LANGS.italian" | translate }}
										</option>
										<option value="es">
											{{ "LANGS.spanish" | translate }}
										</option>
										<option value="fr">
											{{ "LANGS.french" | translate }}
										</option>
										<option value="de">
											{{ "LANGS.german" | translate }}
										</option>
										<option value="pt">
											{{ "LANGS.portuguese" | translate }}
										</option>
										<option value="ru">
											{{ "LANGS.russian" | translate }}
										</option>
									</select>
								</div>
							</ng-container>
						</div>
					</div>
				</div>
				<ng-container *ngIf="review.replyLink && !isCompetitor">
					<div class="py-3 sm:py-6">
						<div *ngIf="(alreadyReplied$ | async) === false">
							<label
								for="comment"
								class="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-200"
								>{{ "QUALITY_CHECK.EMOTIONAL_VIEW.COMMENT" | translate }}</label
							>
							<textarea
								[formControl]="commentControl"
								rows="4"
								name="comment"
								id="comment"
								placeholder="{{
									'QUALITY_CHECK.EMOTIONAL_VIEW.COMMENT_PLACEHOLDER' | translate
								}}"
								class="mt-2 mb-4 block w-full rounded-xl border-0 py-3 px-4 bg-transparent text-gray-800 dark:text-gray-200 shadow-sm ring-2 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 placeholder:dark:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-accent-100 focus:dark:ring-accent-100 sm:text-sm sm:leading-6 focus:outline-none "
							></textarea>
						</div>
						<div
							fxLayout="row"
							fxLayoutAlign="space-between center"
							class="w-full mt-2 mb-3"
						>
							<div *ngIf="(alreadyReplied$ | async) === false">
								<button
									fxLayout="row"
									fxLayoutAlign="center center"
									class="bg-accent-200 rounded-xl p-2 shadow-sm text-gray-100 hover:bg-accent-300 text-sm font-medium leading-6 mr-3"
									[disabled]="commentControl.invalid"
									(click)="onCopyAndReply()"
								>
									<span
										[inlineSVG]="'/assets/icons/bold/Reply Share right.svg'"
										class="svg-icon svg-icon-3 mr-1"
									></span>
									<span>{{
										"REVIEWS.COPY_ANSWER" | translate | uppercase
									}}</span>
								</button>
							</div>
							<div *ngIf="(alreadyReplied$ | async) === true">
								<button
									fxLayout="row"
									fxLayoutAlign="center center"
									class="bg-accent-200 rounded-2xl p-3 shadow-sm text-gray-100 hover:bg-accent-300 text-sm font-medium leading-6 mr-3"
									(click)="showReview()"
								>
									<span
										[inlineSVG]="'./assets/icons/bold/Right Up line.svg'"
										class="svg-icon svg-icon-3 mr-1"
									></span>
									<span>{{
										"REVIEWS.SHOW_REPLY" | translate | uppercase
									}}</span>
								</button>
							</div>
							<div class="relative flex items-start">
								<div class="flex h-6 items-center">
									<input
										id="comments"
										aria-describedby="comments-description"
										name="comments"
										type="checkbox"
										class="h-6 w-6 mt-2 rounded-lg cursor-pointer bg-gray-300 dark:bg-gray-600 border-none text-accent-100 focus:ring-accent-100 focus:ring-offset-0 focus:outline-none"
										[checked]="alreadyReplied$ | async"
										(change)="alreadyReplied()"
									/>
								</div>
								<div class="ml-2 text-sm leading-6">
									<label
										for="comments"
										class="font-medium text-gray-900 dark:text-gray-100"
										>{{ "REVIEWS.MARK_AS_REPLIED" | translate }}</label
									>
									<p
										id="comments-description"
										class="text-gray-500 font-normal text-xs"
									>
										{{ "REVIEWS.MARK_AS_REPLIED_DESCRIPTION" | translate }}
									</p>
								</div>
							</div>
						</div>
					</div>
				</ng-container>
				<div
					fxLayout="column"
					fxLayoutAlign="start start"
					class="w-full mt-8 mb-3"
				>
					<div
						ngClass.sm="display-none"
						ngClass.xs="display-none"
						ngClass.lt-md="display-none"
						ngClass.lt-lg="display-none"
					>
						<div fxLayout="row" fxLayoutAlign="start center" class="ml-2">
							<img
								src="/assets/francis/francis-face.png"
								class="w-12 ml-4"
								alt=""
							/>
							<span class="text-base ml-2 text-gray-800 dark:text-gray-200">{{
								"FRANCIS.TELL_SOMETHING" | translate
							}}</span>
						</div>
						<div fxLayout="row" fxLayoutAlign="start start" class="w-full mb-3">
							<ng-container *ngIf="!isCompetitor">
								<button
									*ngIf="
										reviewContent?.text ||
											reviewContent?.pros ||
											reviewContent?.cons;
										else noLang
									"
									fxLayout="row"
									fxLayoutAlign="center center"
									class="bg-gradient-to-r from-accent-100 to-accent-200 rounded-xl text-xs p-2 shadow-lg text-gray-300 hover:from-accent-200 hover:to-accent-300 mr-2"
									(click)="askToFrancisToReplyInLang()"
								>
									<span
										[inlineSVG]="'./assets/icons/light/messages question.svg'"
										class="svg-icon svg-icon-4 mr-1"
									></span>
									<span *ngIf="originalLangKey$ | async as langKey">
										{{
											"FRANCIS.REVIEWS.HOW_TO_REPLY_THIS_REVIEW_IN_LANG"
												| translate
													: {
															lang:
																langKey
																| translate
																| missingTranslation : langKey
													  }
												| uppercase
										}}
									</span>
								</button>
								<ng-template #noLang>
									<button
										fxLayout="row"
										fxLayoutAlign="center center"
										class="bg-gradient-to-r from-accent-100 to-accent-200 rounded-xl text-xs p-2 shadow-lg text-gray-300 hover:from-accent-200 hover:to-accent-300 mr-2"
										(click)="askToFrancisToReply()"
									>
										<span
											[inlineSVG]="'./assets/icons/light/messages question.svg'"
											class="svg-icon svg-icon-4 mr-1"
										></span>
										<span>
											{{
												"FRANCIS.REVIEWS.HOW_TO_REPLY_THIS_REVIEW"
													| translate
													| uppercase
											}}
										</span>
									</button>
								</ng-template>
							</ng-container>
							<button
								fxLayout="row"
								fxLayoutAlign="center center"
								class="bg-gradient-to-r from-accent-200 to-accent-300 rounded-xl text-xs p-2 shadow-lg text-gray-300 hover:from-accent-300 hover:to-accent-400 mr-2"
								(click)="askToFrancisToAnalyze()"
							>
								<span
									[inlineSVG]="'./assets/icons/light/messages question.svg'"
									class="svg-icon svg-icon-4 mr-1"
								></span>
								<span>{{
									"FRANCIS.REVIEWS.ANALYSIS_THIS_REVIEW" | translate | uppercase
								}}</span>
							</button>
						</div>
					</div>
				</div>
			</ng-container>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyReviewComponent {
	review: ReviewModel;
	scale: number = NumberContants.FIVE;
	amountToMultiply: number = NumberContants.ONE;
	readonly langSwitcher = new FormControl("");
	readonly commentControl = new FormControl("");
	readonly canBeTranslated$ = new BehaviorSubject<boolean>(false);
	readonly isLoading$ = new BehaviorSubject<boolean>(false);
	readonly alreadyReplied$ = new BehaviorSubject<boolean>(false);
	readonly sentimentVote$ = new Subject<number>();
	readonly content$ = new BehaviorSubject<string>("");
	readonly categories$ = new BehaviorSubject<any[]>([]);
	readonly originalLangKey$ = new BehaviorSubject<string>("");
	readonly reviewContent$ = new BehaviorSubject<{
		title?: string;
		text?: string;
		pros?: string;
		cons?: string;
	}>({});

	@Input() set reviewSetter(review: ReviewModel) {
		this.review = review;
	}
	@Input() isCompetitor = false;
	@Input() isCompare = false;

	constructor(
		private readonly translateService: TranslateService,
		private readonly reviewsService: ReviewsService,
		private readonly francisService: FrancisService
	) {
		setTimeout(() => {
			// console.log(this.review.room);
			// this.sentimentVote$.next(5); // debug

			// this.categories$.next([
			// 	// debug
			// 	{
			// 		icon: "Location.svg",
			// 		name: "Location",
			// 		score: -0.5,
			// 		category: "hotel_location",
			// 		valutation: "negative",
			// 	},
			// 	{
			// 		icon: "Building office.svg",
			// 		name: "Quartiere",
			// 		score: 3,
			// 		category: "hotel_neighbourhood",
			// 		valutation: "positive",
			// 	},
			// 	{
			// 		icon: "3 User.svg",
			// 		name: "Personale",
			// 		score: 0,
			// 		category: "hotel_staff",
			// 		valutation: "neutral",
			// 	},
			// 	{
			// 		icon: "Dollar 2.svg",
			// 		name: "Rapporto Qualità Prezzo",
			// 		score: 0,
			// 		category: "hotel_value",
			// 		valutation: "neutral",
			// 	},
			// 	{
			// 		icon: "coat hanger 6.svg",
			// 		name: "Condizioni Camere",
			// 		score: -1,
			// 		category: "hotel_condition",
			// 		valutation: "negative",
			// 	},
			// ]);

			const titleOriginal = this.review.title;
			const source = this.review.service.source;
			const reviewLang = this.getLanguageFromReviewContent();
			const index = this.getIndexTranslation("en");
			const canBeTranslated = reviewLang === null ? false : reviewLang !== "it";

			const { pros, cons, text } = this.review.description;
			const { title: titleTranslated, translated: isTitleTranslated } =
				this.translate(titleOriginal);
			const { scale, amountToMultiply } = SERVICES.find(
				(service: any) => service._id === source
			) || { scale: NumberContants.FIVE, amountToMultiply: NumberContants.ONE };
			const title = isTitleTranslated ? titleTranslated : this.review.title;
			const titleFormatted =
				title.trim().length > 0 ? title : this.review.title;

			this.scale = scale;
			this.amountToMultiply = amountToMultiply;
			this.review = {
				...this.review,
				titleTranslated,
				isTitleTranslated,
			};
			this.reviewContent$.next({
				pros,
				cons,
				text,
				title: titleTranslated,
			});
			this.canBeTranslated$.next(canBeTranslated);
			this.alreadyReplied$.next(this.review.hasReplied);

			reviewLang && this.originalLangKey$.next("LANGS." + reviewLang);

			if (reviewLang === "it") {
				const content = {
					...this.review.description,
					title: this.review.title,
				};

				this.reviewContent$.next({
					...content,
					title: titleFormatted,
				});

				this.calculateSentiment(content, "it");
			}

			if (reviewLang !== "it" && index !== -1) {
				const translation = this.review.translations![index];
				translation &&
					this.reviewContent$.next({
						...translation.description,
						title: titleFormatted,
					});

				this.calculateSentiment(translation, "en");
			}
		});

		this.langSwitcher.valueChanges
			.pipe(
				untilDestroyed(this),
				filter((value) => value !== null),
				map((value) => value as string),
				map((value) =>
					value === "your_language" ? this.translateService.currentLang : value
				)
			)
			.subscribe((currentLang: string) => {
				const index = this.getIndexTranslation(currentLang);

				if (index !== -1) {
					const translation = this.review.translations![index];
					const translatedTitle = translation?.title || "";
					const titleFormatted =
						translatedTitle.trim().length > 0
							? translatedTitle
							: this.review.title;

					translation &&
						this.reviewContent$.next({
							...translation?.description,
							title: titleFormatted,
						});
					this.calculateSentiment(translation, currentLang);
				} else {
					this.isLoading$.next(true);
					this.reviewsService
						.translateReview(this.review._id, currentLang)
						.pipe(untilDestroyed(this))
						.subscribe((translation) => {
							this.isLoading$.next(false);
							const translatedTitle = translation?.title || "";
							const titleFormatted =
								translatedTitle.trim().length > 0
									? translatedTitle
									: this.review.title;

							translation &&
								this.reviewContent$.next({
									...translation?.description,
									title: titleFormatted,
								});
							this.calculateSentiment(translation, currentLang);
							this.review.translations = [
								...(this.review.translations || []),
								translation,
							];
						});
				}
			});

		this.langSwitcher.patchValue("your_language", { emitEvent: false });
	}

	calculateStars(rating: number) {
		const ratingFormatted =
			parseFloat(rating.toFixed(1)) * this.amountToMultiply;
		const stars: string[] = [];
		let index = ratingFormatted;
		Array.from({ length: this.scale }).map(() => {
			stars.push(
				index >= NumberContants.ONE
					? Volumes.FULL
					: index >= NumberContants.ZERO_POINT_FIVE
					? Volumes.HALF
					: Volumes.EMPTY
			);
			index--;
		});

		return stars;
	}

	calculateHearts(rating: number) {
		const ratingFormatted = parseFloat(rating.toFixed(1));

		const hearths: string[] = [];
		let index = ratingFormatted;
		Array.from({ length: this.scale }).map(() => {
			hearths.push(
				index >= NumberContants.ONE
					? Volumes.FULL
					: index >= NumberContants.ZERO_POINT_FIVE
					? Volumes.HALF
					: Volumes.EMPTY
			);
			index--;
		});

		return hearths;
	}

	translate(titleReview: string): { title: string; translated: boolean } {
		const translatedTitle =
			this.translateService.instant(
				`REVIEWS.REVIEWS_TRANSLATED.${this.replaceAll(
					titleReview.toUpperCase(),
					StringConstants.SPACE,
					StringConstants.UNDERSCORE
				)}`
			) || MISSING_TRANSLATION;

		const isTranslated = translatedTitle !== MISSING_TRANSLATION;

		return {
			title: isTranslated ? translatedTitle : titleReview,
			translated: isTranslated,
		};
	}

	onCopyAndReply() {
		const { value } = this.commentControl;

		if (!value) return;

		const selBox = document.createElement("textarea");
		selBox.style.position = "fixed";
		selBox.style.left = "0";
		selBox.style.top = "0";
		selBox.style.opacity = "0";
		selBox.value = value;
		document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand("copy");
		document.body.removeChild(selBox);

		this.showReview();
	}

	showReview() {
		const replyLink = this.review.replyLink?.includes("http")
			? this.review.replyLink
			: `https://${this.review.replyLink}`;

		window.open(replyLink, "_blank");
	}

	alreadyReplied() {
		this.reviewsService
			.setReviewReplied(this.review._id, !this.alreadyReplied$.value)
			.subscribe();

		this.alreadyReplied$.next(!this.alreadyReplied$.value);
	}

	askToFrancisToReplyInLang() {
		const reviewContent = this.review.description;
		const reviewTitle = this.review.title;
		const reviewScore = this.review.score;
		const originallangreview = this.getLanguageFromReviewContent();
		const translation = originallangreview
			? "LANGS." + originallangreview
			: "english";
		const lang = this.translateService.instant(translation);
		const translatedQuestion = this.translateService.instant(
			"FRANCIS.REVIEWS.HOW_TO_REPLY_THIS_REVIEW_IN_LANG",
			{ lang }
		);
		const question = `${translatedQuestion}: \"${reviewTitle || ""}  ${
			reviewContent.pros || ""
		} ${reviewContent.cons || ""} ${reviewContent.text || ""}\"`;

		this.francisService.askQuestion(
			question,
			question,
			reviewScore <= 2.5 ? FrancisState.ANGRY : FrancisState.DEFAULT
		);
	}

	askToFrancisToReply() {
		const reviewContent = this.review.description;
		const reviewTitle = this.review.title;
		const reviewScore = this.review.score;

		const translatedQuestion = this.translateService.instant(
			"FRANCIS.REVIEWS.HOW_TO_REPLY_THIS_REVIEW"
		);

		const question = `${translatedQuestion}: \"${reviewTitle || ""}  ${
			reviewContent.pros || ""
		} ${reviewContent.cons || ""} ${reviewContent.text || ""}\"`;

		this.francisService.askQuestion(
			question,
			question,
			reviewScore <= 2.5 ? FrancisState.ANGRY : FrancisState.DEFAULT
		);
	}

	askToFrancisToAnalyze() {
		const reviewContent = this.review.description;
		const reviewTitle = this.review.title;
		const reviewScore = this.review.score;

		const translatedQuestion = this.translateService.instant(
			"FRANCIS.REVIEWS.ANALYSIS_THIS_REVIEW"
		);
		const question = `${translatedQuestion}: \"${reviewTitle || ""}  ${
			reviewContent.pros || ""
		} ${reviewContent.cons || ""} ${reviewContent.text || ""}\"`;

		this.francisService.askQuestion(
			question,
			question,
			reviewScore <= 2.5 ? FrancisState.ANGRY : FrancisState.DEFAULT
		);
	}

	private calculateSentiment(translation: any, currentLang: string) {
		const sentimentsByWords = [];
		const sentimentByCategory = [];

		const { sentiments } = this.review;
		if (!sentiments) return null;

		for (const [, value] of Object.entries(sentiments)) {
			sentimentsByWords.push(
				...(currentLang === "en" ? value.words : value.wordsIt).map((word) => ({
					word,
					...value,
				}))
			);

			sentimentByCategory.push(
				...value.category.map((category) => ({
					singleCategory: category,
					...value,
				}))
			);
		}

		this.underlineSetiment(translation, sentimentsByWords);
		this.showSentimentCategories(translation, sentimentByCategory);
	}

	private showSentimentCategories(translation: any, sentiments: any) {
		// .filter((sentiment: any) => sentiment.score !== 0)
		const categories = sentiments.map((sentiment: any) => {
			const translation = this.translateService.instant(
				"YOUR_HOTEL.CATEGORIES." + sentiment.singleCategory.toUpperCase()
			);

			return {
				icon: translation.ICON,
				name: translation.DESC,
				score: sentiment.score,
				category: sentiment.singleCategory,
			};
		});

		const sentimentVotes = categories.map((category: any) => {
			const vote = category.score;
			if (vote >= 4) return 10;
			if (vote >= 3 && vote < 4) return 8;
			if (vote >= 2 && vote < 3) return 7;
			if (vote >= 1 && vote < 2) return 6;
			if (vote >= 0 && vote < 1) return 5;
			if (vote >= -1 && vote < 0) return 4;
			if (vote >= -2 && vote < -1) return 3;
			if (vote >= -3 && vote < -2) return 2;
			if (vote >= -4 && vote < -3) return 1;
			if (vote < -4) return 0;
		});

		const sentimentVoteAverage = +(
			(sentimentVotes.reduce((acc: any, curr: any) => acc + curr, 0) /
				sentimentVotes.length +
				this.review.score * 2) /
			2
		).toFixed(1);

		const categoriesGrouped = categories.reduce((acc: any, curr: any) => {
			const { name, score } = curr;
			const category = acc.find((category: any) => category.name === name);

			category
				? (category.score = (category.score + score) / 2)
				: acc.push(curr);

			return acc;
		}, []);

		this.categories$.next(
			categoriesGrouped.map((category: any) => ({
				...category,
				valutation:
					category.score < 0
						? "negative"
						: category.score > 0
						? "positive"
						: "neutral",
			}))
		);

		this.sentimentVote$.next(sentimentVoteAverage);
	}

	private underlineSetiment(translation: any, sentiments: any) {
		// .filter((sentiment: any) => sentiment.score !== 0)
		const sentimentsWords = sentiments.map((sentiment: any) => ({
			word: sentiment.word,
			valutation:
				sentiment.score < 0
					? "negative"
					: sentiment.score > 0
					? "positive"
					: "neutral",
			replaced: false,
		}));

		const replaceBySentiment = (attr: string) => {
			if (!attr) return "";

			let attrWithSentiment = "";
			let startIndex = 0;
			let text = attr.toLowerCase();

			sentimentsWords.forEach((sentimentWord: any) => {
				const { word, valutation, replaced } = sentimentWord;
				const wordIndex = text.indexOf(word.toLowerCase());

				if (wordIndex !== -1 && !replaced) {
					const endIndex = wordIndex + word.length;
					const beforeWord = text.substring(startIndex, wordIndex);
					const afterWord = text.substring(endIndex, text.length);
					const wordToReplace = text.substring(wordIndex, endIndex);

					attrWithSentiment += `${beforeWord}<span class="sentiment-${valutation}">${wordToReplace}</span>`;
					text = afterWord;
					startIndex = 0;
					sentimentWord.replaced = true;
				}
			});

			attrWithSentiment += text;

			return attrWithSentiment;
		};

		const { pros, cons, text } = translation?.description || translation || {};

		const prosSentiment = replaceBySentiment(pros);
		const consSentiment = replaceBySentiment(cons);
		const textSentiment = replaceBySentiment(text);

		this.reviewContent$.next({
			...this.reviewContent$.value,
			pros: prosSentiment,
			cons: consSentiment,
			text: textSentiment,
		});
	}

	private getIndexTranslation(lang: string) {
		const translations = this.review.translations;

		if (!translations) return -1;

		return translations.findIndex(
			(translation) => translation.language === lang
		);
	}

	private getLanguageFromReviewContent() {
		try {
			const ZERO = NumberContants.ZERO;
			const EMPTY = StringConstants.EMPTY;
			const lngDetector = new LanguageDetect();
			const title = this.review.title;
			const { text, pros, cons } = this.review.description;
			const reviewContent = `${title || EMPTY} ${text || EMPTY} ${
				pros || EMPTY
			} ${cons || EMPTY}`;
			const lang = lngDetector
				.detect(reviewContent)
				[NumberContants.ZERO][NumberContants.ZERO].toLowerCase();

			return reviewContent.trim().length > ZERO ? lang : null;
		} catch {
			return null;
		}
	}

	replaceAll(str: string, find: string, replace: string) {
		return str.replace(new RegExp(find, "g"), replace);
	}
}
