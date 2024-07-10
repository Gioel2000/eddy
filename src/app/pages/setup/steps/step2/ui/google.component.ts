import { Component, OnInit, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'step2-google',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div
      class="pointer-events-none relative bg-white dark:bg-zinc-700 border-t border-zinc-200 dark:border-zinc-600 -mb-8 dark:border-zinc-900/50 w-full h-[32rem] rounded-b-xl"
    >
      <img [src]="image()" alt="Google" class="w-full h-56 object-cover object-center" />
      <div class="flex flex-col gap-2 p-6">
        <h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {{ name() }}
        </h3>
        <span class="text-sm font-normal text-zinc-400 dark:text-zinc-500">
          {{ address() }}
        </span>
      </div>
      <div>
        <div class="block">
          <div class="border-b border-zinc-200 dark:border-zinc-600">
            <nav class="-mb-px flex justify-between space-x-8 px-5" aria-label="Tabs">
              <a
                class="whitespace-nowrap border-b-2 border-[#1b72e8] px-1 pb-4 text-sm font-semibold text-[#1b72e8]"
                aria-current="page"
                >{{ 'OVERVIEW' | translate }}</a
              >
              <a
                class="whitespace-nowrap border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-zinc-400 hover:border-zinc-300 hover:text-zinc-700"
                >{{ 'REVIEWS' | translate }}</a
              >
              <a
                class="whitespace-nowrap border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-zinc-400 hover:border-zinc-300 hover:text-zinc-700"
                >{{ 'INFO' | translate }}</a
              >
            </nav>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-x-6 py-8 px-2">
          <div class="flex flex-col items-center gap-2 col-span-1">
            <div class="rounded-full bg-[#1b72e8] p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <title>diamond-turn-right</title>
                <g fill="#fff">
                  <path
                    d="M16.116,7.056L10.944,1.884c-1.038-1.039-2.851-1.039-3.889,0L1.884,7.056c-.52,.519-.806,1.21-.806,1.944s.286,1.425,.806,1.944l5.171,5.171c.519,.52,1.209,.806,1.944,.806s1.425-.286,1.944-.806l5.171-5.171c.52-.519,.806-1.209,.806-1.944s-.286-1.425-.806-1.944Zm-3.335,2.225l-2.25,2.25c-.146,.146-.338,.22-.53,.22s-.384-.073-.53-.22c-.293-.293-.293-.768,0-1.061l.97-.97h-1.689c-.689,0-1.25,.561-1.25,1.25v.5c0,.414-.336,.75-.75,.75s-.75-.336-.75-.75v-.5c0-1.517,1.233-2.75,2.75-2.75h1.689l-.97-.97c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0l2.25,2.25c.293,.293,.293,.768,0,1.061Z"
                  ></path>
                </g>
              </svg>
            </div>
            <span class="text-xs font-semibold text-[#1b72e8] text-center">
              {{ 'INDICATIONS' | translate }}
            </span>
          </div>
          <div class="flex flex-col items-center gap-2 col-span-1">
            <div
              class="flex flex-row items-center justify-center svg-icon-7 rounded-full ring-1 ring-inset ring-[#1b72e8] bg-transparent p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                <title>bookmark</title>
                <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" stroke="#1b72e8">
                  <path
                    d="m10.25,11.25l-4.25-3.25-4.25,3.25V2.75C1.75,1.645,2.645.75,3.75.75h4.5c1.105,0,2,.895,2,2v8.5Z"
                  ></path>
                </g>
              </svg>
            </div>
            <span class="text-xs font-medium text-[#1b72e8] text-center">
              {{ 'SAVE' | translate }}
            </span>
          </div>
          <div class="flex flex-col items-center gap-2 col-span-1">
            <div
              class="flex flex-row items-center justify-center svg-icon-7 rounded-full ring-1 ring-inset ring-[#1b72e8] bg-transparent p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <title>pin</title>
                <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="#1b72e8">
                  <path
                    d="M14.779,7.266c0,2.622-3.428,6.833-5.004,8.631-.413,.471-1.139,.471-1.551,0-1.576-1.797-5.004-6.008-5.004-8.631C3.221,3.776,6.207,1.75,9,1.75s5.779,2.026,5.779,5.516Z"
                  ></path>
                  <circle cx="9" cy="7.5" r="1.75"></circle>
                </g>
              </svg>
            </div>
            <span class="text-xs font-medium text-[#1b72e8] text-center">
              {{ 'NEARBY' | translate }}
            </span>
          </div>
          <div class="flex flex-col items-center gap-2 col-span-1">
            <div
              class="flex flex-row items-center justify-center svg-icon-7 rounded-full ring-1 ring-inset ring-[#1b72e8] bg-transparent p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <title>phone-modern</title>
                <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="#1b72e8">
                  <line x1="4.75" y1="13.25" x2="13.25" y2="13.25"></line>
                  <line x1="4.75" y1="4.25" x2="13.25" y2="4.25"></line>
                  <rect x="4.75" y="1.75" width="8.5" height="14.5" rx="1" ry="1"></rect>
                </g>
              </svg>
            </div>
            <span class="text-xs font-medium text-[#1b72e8] text-center">
              {{ 'SEND_TO_PHONE' | translate }}
            </span>
          </div>
          <div class="flex flex-col items-center gap-2 col-span-1">
            <div
              class="flex flex-row items-center justify-center svg-icon-7 rounded-full ring-1 ring-inset ring-[#1b72e8] bg-transparent p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <title>connected-dots-3</title>
                <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="#1b72e8">
                  <line x1="5.965" y1="7.908" x2="11.034" y2="5.092"></line>
                  <line x1="5.965" y1="10.092" x2="11.034" y2="12.908"></line>
                  <circle cx="4" cy="9" r="2.25"></circle>
                  <circle cx="13" cy="4" r="2.25"></circle>
                  <circle cx="13" cy="14" r="2.25"></circle>
                </g>
              </svg>
            </div>
            <span class="text-xs font-medium text-[#1b72e8] text-center">
              {{ 'SHARE' | translate }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class GoogleStep2Component {
  image = input.required<string>();
  name = input.required<string>();
  address = input.required<string>();
}
