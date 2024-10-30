import { Component, effect, inject } from '@angular/core';
import { SmartReplyDialogService } from './smart-reply.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderReviewComponent } from '../single-review/review-header.component';
import moment from 'moment';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ClickOutsideDirective } from '../../utils/directives/clickoutside';
import { BehaviorSubject, Subject } from 'rxjs';
import { ReplacePipe } from '../../utils/pipes/replace.pipe';
import LanguageDetect from 'languagedetect';
import { SERVICES } from '../single-review/data/reviews.data';
import { MISSING_TRANSLATION } from '../../utils/constants/missingTranslation';
import { AIReply } from '../../store/reviews/interfaces/reviews';
import { BodyReviewComponent } from '../single-review/review-body.component';

@Component({
  selector: 'smart-reply-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    InlineSVGModule,
    ClickOutsideDirective,
    ReplacePipe,
    HeaderReviewComponent,
    BodyReviewComponent,
  ],
  template: `
    <div
      class="relative z-[10000]"
      [ngClass]="{
        hidden: !smartReplyDialog.isDialogOpen(),
      }"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-zinc-300 dark:bg-zinc-900 bg-opacity-20 dark:bg-opacity-20 backdrop-blur-md transition-opacity"
      ></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 ring-1  ring-zinc-300 dark:ring-zinc-700 px-4 pb-4 pt-5 text-left shadow-sm shadow-black/10 transition-all sm:my-8 w-full sm:max-w-3xl sm:p-6"
            [ngClass]="{
              'opacity-100 translate-y-0 sm:scale-100': smartReplyDialog.isDialogVisible(),
              'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !smartReplyDialog.isDialogVisible()
            }"
            (clickOutside)="smartReplyDialog.isDialogVisible() && smartReplyDialog.closeDialog()"
          >
            <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100 animate-blurToClear100"
                (click)="smartReplyDialog.closeDialog()"
              >
                <span class="svg-icon svg-icon-8 stroke-[1.6]">
                  <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                    <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                      <line
                        x1="14"
                        y1="4"
                        x2="4"
                        y2="14"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        data-color="color-2"
                      ></line>
                      <line
                        x1="4"
                        y1="4"
                        x2="14"
                        y2="14"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></line>
                    </g>
                  </svg>
                </span>
              </button>
            </div>
            <div class="flow-root">
              <div class="px-1">
                @if (smartReplyDialog.review(); as review) {
                <header-review [review]="review"></header-review>
                <body-review [review]="review" [showBorder]="false"></body-review>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SmartReplyDialogComponent {
  smartReplyDialog = inject(SmartReplyDialogService);
  translateService = inject(TranslateService);

  scale = 5;
  readonly categories$ = new BehaviorSubject<any[]>([]);
  readonly sentimentVote$ = new Subject<number>();
  readonly replies$ = new BehaviorSubject<AIReply[]>([]);
  readonly canBeTranslated$ = new BehaviorSubject<boolean>(false);
  readonly alreadyReplied$ = new BehaviorSubject<boolean>(false);
  readonly originalLangKey$ = new BehaviorSubject<string>('');
  readonly reviewContent$ = new BehaviorSubject<{
    title?: string;
    text?: string;
  }>({});

  constructor() {
    effect(() => {
      const review = this.smartReplyDialog.review();
      if (!review) return;

      const titleOriginal = review.title;
      const source = review.channel.source;
      const reviewLang = this.getLanguageFromReviewContent();
      const index = this.getIndexTranslation('en');
      const canBeTranslated = reviewLang === null ? false : reviewLang !== 'it';

      const { text } = review;
      const { title: titleTranslated, translated: isTitleTranslated } = this.translateReview(titleOriginal);
      const { scale, amountToMultiply } = SERVICES.find((service: any) => service._id === source) || {
        scale: 5,
        amountToMultiply: 1,
      };
      const title = isTitleTranslated ? titleTranslated : review.title;
      const titleFormatted = title.trim().length > 0 ? title : review.title;

      this.scale = scale;

      this.replies$.next(review.aiReply || []);

      this.reviewContent$.next({
        text,
        title: titleTranslated,
      });
      this.canBeTranslated$.next(canBeTranslated);
      this.alreadyReplied$.next(review.hasReplied);

      reviewLang && this.originalLangKey$.next('LANGS.' + reviewLang);

      if (reviewLang === 'it') this.calculateSentiment(review, 'it');
      if (reviewLang !== 'it' && index !== -1) this.calculateSentiment(review, 'en');

      const aiReply = review.aiReply;
      if (aiReply) {
        // this.commentControl.setValue(aiReply.reply);
      }
    });
  }

  nameFormatter(name: string | undefined): string {
    if (!name) {
      const unknownUser = this.translateService.instant('UNKNOWN_USER');
      return unknownUser;
    }

    if (name.toLowerCase() === 'verified traveler') {
      return this.translateService.instant('VERIFIED_TRAVELER');
    }

    return name;
  }

  translateReview(titleReview: string): { title: string; translated: boolean } {
    const translatedTitle =
      this.translateService.instant(
        `REVIEWS.REVIEWS_TRANSLATED.${this.replaceAll(titleReview.toUpperCase(), ' ', '_')}`
      ) || MISSING_TRANSLATION;

    const isTranslated = translatedTitle !== MISSING_TRANSLATION;

    return {
      title: isTranslated ? translatedTitle : titleReview,
      translated: isTranslated,
    };
  }

  formatDate(date: Date | string | null | undefined): string {
    const currentLang = this.translateService.currentLang;
    const todayLabel = this.translateService.instant('TODAY');

    return moment(date)
      .locale(currentLang)
      .format('DD MMMM YYYY')
      .replace(moment(new Date()).locale(currentLang).format('DD MMMM YYYY'), `${todayLabel} `);
  }

  replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  private calculateSentiment(translation: any, currentLang: string) {
    const sentimentsByWords = [];
    const sentimentByCategory = [];

    const sentiments = this.smartReplyDialog!.review()?.sentiments;

    if (!sentiments) {
      return;
    }

    for (const [, value] of Object.entries(sentiments) as any) {
      sentimentsByWords.push(
        ...(currentLang === 'en' ? value.words : value.wordsIt).map((word: any) => ({
          word,
          ...value,
        }))
      );

      sentimentByCategory.push(
        ...value.category.map((category: any) => ({
          singleCategory: category,
          ...value,
        }))
      );
    }

    this.underlineSetiment(translation, sentimentsByWords);
    this.showSentimentCategories(translation, sentimentByCategory);
  }

  private underlineSetiment(translation: any, sentiments: any) {
    // .filter((sentiment: any) => sentiment.score !== 0)
    const sentimentsWords = sentiments.map((sentiment: any) => ({
      word: sentiment.word,
      valutation: sentiment.score < 0 ? 'negative' : sentiment.score > 0 ? 'positive' : 'neutral',
      replaced: false,
    }));

    const replaceBySentiment = (attr: string) => {
      if (!attr) return '';

      let attrWithSentiment = '';
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

    const text = translation.text || '';
    const title = translation.title || '';

    const textSentiment = replaceBySentiment(text);

    this.reviewContent$.next({
      title: title,
      text: textSentiment,
    });
  }

  private getLanguageFromReviewContent() {
    try {
      const review = this.smartReplyDialog.review();
      if (!review) return -1;

      const lngDetector = new LanguageDetect();
      const { title, text } = review;
      const reviewContent = `${title || ''} ${text || ''}`;
      const lang = lngDetector.detect(reviewContent)[0][0].toLowerCase();

      return reviewContent.trim().length > 0 ? lang : null;
    } catch {
      return null;
    }
  }

  private showSentimentCategories(translation: any, sentiments: any) {
    // .filter((sentiment: any) => sentiment.score !== 0)
    const categories = sentiments.map((sentiment: any) => {
      const translation = this.translateService.instant('REVIEWS_CATEGORIES.' + sentiment.singleCategory.toUpperCase());

      return {
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
      return 0;
    });

    const sentimentVoteAverage = +(
      (sentimentVotes.reduce((acc: any, curr: any) => acc + curr, 0) / sentimentVotes.length +
        (this.smartReplyDialog.review() || { rating: 0 }).rating * 2) /
      2
    ).toFixed(1);

    const categoriesGrouped = categories.reduce((acc: any, curr: any) => {
      const { name, score } = curr;
      const category = acc.find((category: any) => category.name === name);

      category ? (category.score = (category.score + score) / 2) : acc.push(curr);

      return acc;
    }, []);

    this.categories$.next(
      categoriesGrouped.map((category: any) => ({
        ...category,
        valutation: category.score < 0 ? 'negative' : category.score > 0 ? 'positive' : 'neutral',
      }))
    );

    this.sentimentVote$.next(sentimentVoteAverage);
  }

  private getIndexTranslation(lang: string) {
    const review = this.smartReplyDialog.review();
    if (!review) return -1;

    const translations = review.translations;

    if (!translations) return -1;

    return translations.findIndex((translation: any) => translation.language === lang);
  }
}
