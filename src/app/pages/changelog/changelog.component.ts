import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeManagerStore } from '../../store/theme/theme.service';
import { Location } from '@angular/common';

@Component({
  template: `
    <div class="flex min-h-full flex-col bg-white dark:bg-zinc-950">
      <div
        class="relative flex-none overflow-hidden px-6 lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex lg:px-0"
      >
        <div
          class="absolute inset-0 -z-10 overflow-hidden bg-white dark:bg-zinc-950 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem]"
        >
          <svg
            class="absolute -bottom-48 left-[-40%] h-[80rem] w-[180%] lg:-right-40 lg:bottom-auto lg:left-auto lg:top-[-40%] lg:h-[180%] lg:w-[80rem]"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id=":S1:-desktop" cx="100%">
                <stop offset="0%" stop-color="rgba(239, 3, 20, 0.3)"></stop>
                <stop offset="53.95%" stop-color="rgba(239, 3, 20, 0.09)"></stop>
                <stop offset="100%" stop-color="rgba(20, 20, 20, 0)"></stop>
              </radialGradient>
              <radialGradient id=":S1:-mobile" cy="100%">
                <stop offset="0%" stop-color="rgba(239, 3, 20, 0.3)"></stop>
                <stop offset="53.95%" stop-color="rgba(239, 3, 20, 0.09)"></stop>
                <stop offset="100%" stop-color="rgba(20, 20, 20, 0)"></stop>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#:S1:-desktop)" class="hidden lg:block"></rect>
            <rect width="100%" height="100%" fill="url(#:S1:-mobile)" class="lg:hidden"></rect>
          </svg>

          <div
            class="absolute inset-x-0 bottom-0 right-0 h-px bg-black dark:bg-white mix-blend-overlay lg:left-auto lg:top-0 lg:h-auto lg:w-px"
          ></div>
        </div>
        <div
          class="relative flex w-full lg:pointer-events-auto lg:mr-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] lg:overflow-y-auto lg:overflow-x-hidden lg:pl-[max(4rem,calc(50%-38rem))]"
        >
          <div
            class="mx-auto max-w-lg lg:mx-0 lg:flex lg:w-96 lg:max-w-none lg:flex-col lg:before:flex-1 lg:before:pt-6"
          >
            <div class="pb-16 pt-20 sm:pb-20 sm:pt-32 lg:py-20">
              <div class="relative">
                @if (theme() === 'light') {
                <svg
                  viewBox="0 0 881 211"
                  fill="black"
                  aria-hidden="true"
                  class="pointer-events-none absolute w-[55.0625rem] origin-top-right rotate-[30deg] overflow-visible opacity-70 -right-44 top-14"
                >
                  <defs>
                    <filter id=":R1cpuja:">
                      <feGaussianBlur in="SourceGraphic" stdDeviation=".5"></feGaussianBlur>
                    </filter>
                  </defs>
                  <path
                    stroke="black"
                    stroke-opacity="0.2"
                    stroke-dasharray="1"
                    stroke-dashoffset="1"
                    pathLength="1"
                    fill="transparent"
                    d="M 247,103L261,86L307,104L357,36"
                    class="invisible"
                    style="stroke-dashoffset: 0; visibility: visible;"
                  ></path>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="247"
                      cy="103"
                      r="1"
                      style="transform-origin: 15.4375rem 6.4375rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="261"
                      cy="86"
                      r="1"
                      style="transform-origin: 16.3125rem 5.375rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="307"
                      cy="104"
                      r="1"
                      style="transform-origin: 19.1875rem 6.5rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="357"
                      cy="36"
                      r="1"
                      style="transform-origin: 22.3125rem 2.25rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <path
                    stroke="black"
                    stroke-opacity="0.2"
                    stroke-dasharray="1"
                    stroke-dashoffset="1"
                    pathLength="1"
                    fill="transparent"
                    d="M 586,120L516,100L491,62L440,107L477,180L516,100"
                    class="invisible"
                    style="stroke-dashoffset: 0; visibility: visible; fill: rgba(0, 0, 0, 0.02);"
                  ></path>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="586"
                      cy="120"
                      r="1"
                      style="transform-origin: 36.625rem 7.5rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="516"
                      cy="100"
                      r="1"
                      style="transform-origin: 32.25rem 6.25rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="491"
                      cy="62"
                      r="1"
                      style="transform-origin: 30.6875rem 3.875rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="440"
                      cy="107"
                      r="1"
                      style="transform-origin: 27.5rem 6.6875rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="477"
                      cy="180"
                      r="1"
                      style="transform-origin: 29.8125rem 11.25rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <path
                    stroke="black"
                    stroke-opacity="0.2"
                    stroke-dasharray="1"
                    stroke-dashoffset="1"
                    pathLength="1"
                    fill="transparent"
                    d="M 733,100L803,120L879,113L823,164L803,120"
                    class="invisible"
                    style="stroke-dashoffset: 0; visibility: visible; fill: rgba(0, 0, 0, 0.02);"
                  ></path>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="733"
                      cy="100"
                      r="1"
                      style="transform-origin: 45.8125rem 6.25rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="803"
                      cy="120"
                      r="1"
                      style="transform-origin: 50.1875rem 7.5rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="879"
                      cy="113"
                      r="1"
                      style="transform-origin: 54.9375rem 7.0625rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="823"
                      cy="164"
                      r="1"
                      style="transform-origin: 51.4375rem 10.25rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="4"
                      cy="4"
                      r="1"
                      style="transform-origin: 0.25rem 0.25rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="4"
                      cy="44"
                      r="1"
                      style="transform-origin: 0.25rem 2.75rem; opacity: 0.2; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="36"
                      cy="22"
                      r="1"
                      style="transform-origin: 2.25rem 1.375rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="50"
                      cy="146"
                      r="1"
                      style="transform-origin: 3.125rem 9.125rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="64"
                      cy="43"
                      r="1"
                      style="transform-origin: 4rem 2.6875rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="76"
                      cy="30"
                      r="1"
                      style="transform-origin: 4.75rem 1.875rem; opacity: 0.2; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="101"
                      cy="116"
                      r="1"
                      style="transform-origin: 6.3125rem 7.25rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="140"
                      cy="36"
                      r="1"
                      style="transform-origin: 8.75rem 2.25rem; opacity: 0.2; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="149"
                      cy="134"
                      r="1"
                      style="transform-origin: 9.3125rem 8.375rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="162"
                      cy="74"
                      r="1"
                      style="transform-origin: 10.125rem 4.625rem; opacity: 0.2; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="171"
                      cy="96"
                      r="1"
                      style="transform-origin: 10.6875rem 6rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="210"
                      cy="56"
                      r="1"
                      style="transform-origin: 13.125rem 3.5rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="235"
                      cy="90"
                      r="1"
                      style="transform-origin: 14.6875rem 5.625rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="275"
                      cy="82"
                      r="1"
                      style="transform-origin: 17.1875rem 5.125rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="306"
                      cy="6"
                      r="1"
                      style="transform-origin: 19.125rem 0.375rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="307"
                      cy="64"
                      r="1"
                      style="transform-origin: 19.1875rem 4rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="380"
                      cy="68"
                      r="1"
                      style="transform-origin: 23.75rem 4.25rem; opacity: 0.2; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="380"
                      cy="108"
                      r="1"
                      style="transform-origin: 23.75rem 6.75rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="391"
                      cy="148"
                      r="1"
                      style="transform-origin: 24.4375rem 9.25rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="405"
                      cy="18"
                      r="1"
                      style="transform-origin: 25.3125rem 1.125rem; opacity: 0.2; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="412"
                      cy="86"
                      r="1"
                      style="transform-origin: 25.75rem 5.375rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="426"
                      cy="210"
                      r="1"
                      style="transform-origin: 26.625rem 13.125rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="427"
                      cy="56"
                      r="1"
                      style="transform-origin: 26.6875rem 3.5rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="538"
                      cy="138"
                      r="1"
                      style="transform-origin: 33.625rem 8.625rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="563"
                      cy="88"
                      r="1"
                      style="transform-origin: 35.1875rem 5.5rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="611"
                      cy="154"
                      r="1"
                      style="transform-origin: 38.1875rem 9.625rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="637"
                      cy="150"
                      r="1"
                      style="transform-origin: 39.8125rem 9.375rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="651"
                      cy="146"
                      r="1"
                      style="transform-origin: 40.6875rem 9.125rem; opacity: 0.2; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="682"
                      cy="70"
                      r="1"
                      style="transform-origin: 42.625rem 4.375rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="683"
                      cy="128"
                      r="1"
                      style="transform-origin: 42.6875rem 8rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="781"
                      cy="82"
                      r="1"
                      style="transform-origin: 48.8125rem 5.125rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="785"
                      cy="158"
                      r="1"
                      style="transform-origin: 49.0625rem 9.875rem; opacity: 0.2; transform: scale(#000);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="832"
                      cy="146"
                      r="1"
                      style="transform-origin: 52rem 9.125rem; opacity: 0.2; transform: scale(#000);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="852"
                      cy="89"
                      r="1"
                      style="transform-origin: 53.25rem 5.5625rem; opacity: 1; transform: scale(#000);"
                    ></circle>
                  </g>
                </svg>
                } @if (theme() === 'dark') {
                <svg
                  viewBox="0 0 881 211"
                  fill="white"
                  aria-hidden="true"
                  class="pointer-events-none absolute w-[55.0625rem] origin-top-right rotate-[30deg] overflow-visible opacity-70 -right-44 top-14"
                >
                  <defs>
                    <filter id=":R1cpuja:">
                      <feGaussianBlur in="SourceGraphic" stdDeviation=".5"></feGaussianBlur>
                    </filter>
                  </defs>
                  <path
                    stroke="white"
                    stroke-opacity="0.2"
                    stroke-dasharray="1"
                    stroke-dashoffset="1"
                    pathLength="1"
                    fill="transparent"
                    d="M 247,103L261,86L307,104L357,36"
                    class="invisible"
                    style="stroke-dashoffset: 0; visibility: visible;"
                  ></path>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="247"
                      cy="103"
                      r="1"
                      style="transform-origin: 15.4375rem 6.4375rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="261"
                      cy="86"
                      r="1"
                      style="transform-origin: 16.3125rem 5.375rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="307"
                      cy="104"
                      r="1"
                      style="transform-origin: 19.1875rem 6.5rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="357"
                      cy="36"
                      r="1"
                      style="transform-origin: 22.3125rem 2.25rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <path
                    stroke="white"
                    stroke-opacity="0.2"
                    stroke-dasharray="1"
                    stroke-dashoffset="1"
                    pathLength="1"
                    fill="transparent"
                    d="M 586,120L516,100L491,62L440,107L477,180L516,100"
                    class="invisible"
                    style="stroke-dashoffset: 0; visibility: visible; fill: rgba(255, 255, 255, 0.02);"
                  ></path>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="586"
                      cy="120"
                      r="1"
                      style="transform-origin: 36.625rem 7.5rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="516"
                      cy="100"
                      r="1"
                      style="transform-origin: 32.25rem 6.25rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="491"
                      cy="62"
                      r="1"
                      style="transform-origin: 30.6875rem 3.875rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="440"
                      cy="107"
                      r="1"
                      style="transform-origin: 27.5rem 6.6875rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="477"
                      cy="180"
                      r="1"
                      style="transform-origin: 29.8125rem 11.25rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <path
                    stroke="white"
                    stroke-opacity="0.2"
                    stroke-dasharray="1"
                    stroke-dashoffset="1"
                    pathLength="1"
                    fill="transparent"
                    d="M 733,100L803,120L879,113L823,164L803,120"
                    class="invisible"
                    style="stroke-dashoffset: 0; visibility: visible; fill: rgba(255, 255, 255, 0.02);"
                  ></path>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="733"
                      cy="100"
                      r="1"
                      style="transform-origin: 45.8125rem 6.25rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="803"
                      cy="120"
                      r="1"
                      style="transform-origin: 50.1875rem 7.5rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="879"
                      cy="113"
                      r="1"
                      style="transform-origin: 54.9375rem 7.0625rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="823"
                      cy="164"
                      r="1"
                      style="transform-origin: 51.4375rem 10.25rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="4"
                      cy="4"
                      r="1"
                      style="transform-origin: 0.25rem 0.25rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="4"
                      cy="44"
                      r="1"
                      style="transform-origin: 0.25rem 2.75rem; opacity: 0.2; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="36"
                      cy="22"
                      r="1"
                      style="transform-origin: 2.25rem 1.375rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="50"
                      cy="146"
                      r="1"
                      style="transform-origin: 3.125rem 9.125rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="64"
                      cy="43"
                      r="1"
                      style="transform-origin: 4rem 2.6875rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="76"
                      cy="30"
                      r="1"
                      style="transform-origin: 4.75rem 1.875rem; opacity: 0.2; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="101"
                      cy="116"
                      r="1"
                      style="transform-origin: 6.3125rem 7.25rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="140"
                      cy="36"
                      r="1"
                      style="transform-origin: 8.75rem 2.25rem; opacity: 0.2; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="149"
                      cy="134"
                      r="1"
                      style="transform-origin: 9.3125rem 8.375rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="162"
                      cy="74"
                      r="1"
                      style="transform-origin: 10.125rem 4.625rem; opacity: 0.2; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="171"
                      cy="96"
                      r="1"
                      style="transform-origin: 10.6875rem 6rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="210"
                      cy="56"
                      r="1"
                      style="transform-origin: 13.125rem 3.5rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="235"
                      cy="90"
                      r="1"
                      style="transform-origin: 14.6875rem 5.625rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="275"
                      cy="82"
                      r="1"
                      style="transform-origin: 17.1875rem 5.125rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="306"
                      cy="6"
                      r="1"
                      style="transform-origin: 19.125rem 0.375rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="307"
                      cy="64"
                      r="1"
                      style="transform-origin: 19.1875rem 4rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="380"
                      cy="68"
                      r="1"
                      style="transform-origin: 23.75rem 4.25rem; opacity: 0.2; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="380"
                      cy="108"
                      r="1"
                      style="transform-origin: 23.75rem 6.75rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="391"
                      cy="148"
                      r="1"
                      style="transform-origin: 24.4375rem 9.25rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="405"
                      cy="18"
                      r="1"
                      style="transform-origin: 25.3125rem 1.125rem; opacity: 0.2; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="412"
                      cy="86"
                      r="1"
                      style="transform-origin: 25.75rem 5.375rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="426"
                      cy="210"
                      r="1"
                      style="transform-origin: 26.625rem 13.125rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="427"
                      cy="56"
                      r="1"
                      style="transform-origin: 26.6875rem 3.5rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="538"
                      cy="138"
                      r="1"
                      style="transform-origin: 33.625rem 8.625rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="563"
                      cy="88"
                      r="1"
                      style="transform-origin: 35.1875rem 5.5rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="611"
                      cy="154"
                      r="1"
                      style="transform-origin: 38.1875rem 9.625rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="637"
                      cy="150"
                      r="1"
                      style="transform-origin: 39.8125rem 9.375rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="651"
                      cy="146"
                      r="1"
                      style="transform-origin: 40.6875rem 9.125rem; opacity: 0.2; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="682"
                      cy="70"
                      r="1"
                      style="transform-origin: 42.625rem 4.375rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="683"
                      cy="128"
                      r="1"
                      style="transform-origin: 42.6875rem 8rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="781"
                      cy="82"
                      r="1"
                      style="transform-origin: 48.8125rem 5.125rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="785"
                      cy="158"
                      r="1"
                      style="transform-origin: 49.0625rem 9.875rem; opacity: 0.2; transform: scale(#fff);"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="832"
                      cy="146"
                      r="1"
                      style="transform-origin: 52rem 9.125rem; opacity: 0.2; transform: scale(#fff);"
                      filter="url(#:R1cpuja:)"
                    ></circle>
                  </g>
                  <g class="opacity-0" style="opacity: 1;">
                    <circle
                      cx="852"
                      cy="89"
                      r="1"
                      style="transform-origin: 53.25rem 5.5625rem; opacity: 1; transform: scale(#fff);"
                    ></circle>
                  </g>
                </svg>
                }

                <div>
                  <a
                    class="flex flex-row items-center transition-all transform-gpu ease-in-out duration-100 animate-blurToClear100  cursor-pointer font-[Pacifico] text-3xl font-medium"
                  >
                    <h1 class="text-accent dark:text-accentDark -tracking-[0.05rem]">
                      Eddy
                      <span class="text-black dark:text-white">.</span>
                    </h1>
                  </a>
                </div>
                <h2 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-9">
                  {{ 'NOVELTY' | translate }}
                </h2>
                <p class="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                  {{ 'CHANGE_LOG_DESCRIPTION' | translate }}
                </p>
                <div class="mt-8 flex flex-wrap justify-center gap-x-1 gap-y-3 sm:gap-x-2 lg:justify-start">
                  <a
                    class="flex-none group relative isolate flex items-center rounded-lg px-2 py-0.5 text-[0.8125rem]/6 font-medium text-black/30 dark:text-white/30 transition-colors hover:text-accent dark:hover:text-accentDark stroke-[1.5] gap-x-3"
                    href="https://www.iubenda.com/privacy-policy/40734880/cookie-policy"
                    ><span
                      class="absolute inset-0 -z-10 scale-75 rounded-lg bg-black/5 dark:bg-white/5 opacity-0 transition group-hover:scale-100 group-hover:opacity-100"
                    ></span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                      <title>cookie</title>
                      <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                        <path
                          d="M14.75,8c-1.91,0-3.469-1.433-3.703-3.28-.099,.01-.195,.03-.297,.03-1.618,0-2.928-1.283-2.989-2.887-3.413,.589-6.011,3.556-6.011,7.137,0,4.004,3.246,7.25,7.25,7.25s7.25-3.246,7.25-7.25c0-.434-.045-.857-.118-1.271-.428,.17-.893,.271-1.382,.271Z"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <circle
                          cx="12.25"
                          cy="1.75"
                          r=".75"
                          data-color="color-2"
                          data-stroke="none"
                          stroke="none"
                        ></circle>
                        <circle
                          cx="14.75"
                          cy="4.25"
                          r=".75"
                          data-color="color-2"
                          data-stroke="none"
                          stroke="none"
                        ></circle>
                        <circle
                          cx="11.25"
                          cy="11.75"
                          r=".75"
                          data-color="color-2"
                          data-stroke="none"
                          stroke="none"
                        ></circle>
                        <circle cx="7" cy="7" r="1" data-color="color-2" data-stroke="none" stroke="none"></circle>
                        <circle
                          cx="7.25"
                          cy="11.25"
                          r="1.25"
                          data-color="color-2"
                          data-stroke="none"
                          stroke="none"
                        ></circle>
                      </g>
                    </svg>
                    <span class="self-baseline text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white"
                      >Cookie Policy</span
                    >
                  </a>
                  <a
                    class="flex-none group relative isolate flex items-center rounded-lg px-2 py-0.5 text-[0.8125rem]/6 font-medium text-black/30 dark:text-white/30 transition-colors hover:text-accent dark:hover:text-accentDark stroke-[1.5] gap-x-3"
                    href="https://www.iubenda.com/privacy-policy/40734880/cookie-policy"
                    ><span
                      class="absolute inset-0 -z-10 scale-75 rounded-lg bg-black/5 dark:bg-white/5 opacity-0 transition group-hover:scale-100 group-hover:opacity-100"
                    ></span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                      <title>lock</title>
                      <g fill="currentColor" stroke="currentColor" class="nc-icon-wrapper">
                        <path
                          d="M5.75,8.25v-3.25c0-1.795,1.455-3.25,3.25-3.25h0c1.795,0,3.25,1.455,3.25,3.25v3.25"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          data-color="color-2"
                        ></path>
                        <line
                          x1="9"
                          y1="11.75"
                          x2="9"
                          y2="12.75"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          data-color="color-2"
                        ></line>
                        <rect
                          x="3.25"
                          y="8.25"
                          width="11.5"
                          height="8"
                          rx="2"
                          ry="2"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></rect>
                      </g>
                    </svg>
                    <span class="self-baseline text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white"
                      >Privacy Policy</span
                    >
                  </a>
                  <a
                    class="flex-none group relative isolate flex items-center rounded-lg px-2 py-0.5 text-[0.8125rem]/6 font-medium text-black/30 dark:text-white/30 transition-colors hover:text-accent dark:hover:text-accentDark stroke-[1.5] gap-x-3"
                    href="mailto:support@eddy.restaurant"
                    ><span
                      class="absolute inset-0 -z-10 scale-75 rounded-lg bg-black/5 dark:bg-white/5 opacity-0 transition group-hover:scale-100 group-hover:opacity-100"
                    ></span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
                      <title>circle question</title>
                      <g fill="none" stroke="currentColor" class="nc-icon-wrapper">
                        <circle cx="9" cy="9" r="7.25" stroke-linecap="round" stroke-linejoin="round"></circle>
                        <path
                          d="M6.925,6.619c.388-1.057,1.294-1.492,2.18-1.492,.895,0,1.818,.638,1.818,1.808,0,1.784-1.816,1.468-2.096,3.065"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M8.791,13.567c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z"
                          stroke="none"
                          fill="currentColor"
                        ></path>
                      </g>
                    </svg>
                    <span
                      class="self-baseline text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white"
                      >{{ 'HELP' | translate }}</span
                    ></a
                  >
                </div>
              </div>
            </div>
            <div class="flex flex-1 items-end justify-center pb-4 lg:justify-start lg:pb-6">
              <p class="flex items-baseline gap-x-2 text-[0.8125rem]/6 text-zinc-500">
                Developed by
                <a
                  class="group relative isolate flex items-center  rounded-lg py-0.5 text-[0.8125rem]/6 font-medium text-black/30 dark:text-white/30 transition-colors hover:text-accentDark1 gap-x-2 cursor-pointer hover:underline decoration-2 underline-black dark:underline-white"
                  href="https://www.diamondtech.it/"
                  ><span class="self-baseline text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white"
                    >Diamond Tech</span
                  ></a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <a
        class="hidden sm:block absolute cursor-pointer top-6 right-6 z-30 svg-icon-5 stroke-[1.8] rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition ease-in-out duration-200 animate-blurToClear200  transform"
        (click)="location.back()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 18 18">
          <title>xmark</title>
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
      </a>
      <div class="relative flex-auto">
        <div
          class="pointer-events-none absolute inset-0 z-50 overflow-hidden lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] lg:overflow-visible"
        >
          <svg
            class="absolute left-[max(0px,calc(50%-18.125rem))] top-0 h-full w-1.5 lg:left-full lg:ml-1 xl:left-auto xl:right-1 xl:ml-0"
            aria-hidden="true"
          >
            <defs>
              <pattern id=":S4:" width="6" height="8" patternUnits="userSpaceOnUse">
                <path d="M0 0H6M0 8H6" class="stroke-black/10 dark:stroke-white/10" fill="none"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#:S4:)"></rect>
          </svg>
        </div>
        <main class="space-y-20 py-20 sm:space-y-32 sm:py-32">
          <article class="scroll-mt-16" style="padding-bottom:0px">
            <div>
              <header class="relative mb-10 xl:mb-0">
                <div
                  class="pointer-events-none absolute left-[max(-0.5rem,calc(50%-18.625rem))] top-0 z-50 flex h-4 items-center justify-end gap-x-2 lg:left-0 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] xl:h-8"
                >
                  <a class="inline-flex"
                    ><time
                      class="hidden xl:pointer-events-auto xl:block text-xs xl:font-medium text-black/80 dark:text-white/50"
                      >Ago 27, 2024</time
                    ></a
                  >
                  <div class="h-[0.0625rem] w-3.5 lg:-mr-3.5 xl:mr-0 bg-zinc-700 dark:bg-zinc-300"></div>
                </div>
                <div class="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
                  <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
                    <div class="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto">
                      <div class="flex">
                        <a class="inline-flex"
                          ><time
                            datetime="2023-04-06T00:00:00.000Z"
                            class="text-2xs/4 font-medium text-zinc-500 xl:hidden"
                            >Ago 27, 2024</time
                          ></a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </header>
              <div class="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
                <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
                  <div
                    class="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto typography"
                    data-mdx-content="true"
                  >
                    <div class="relative mt-8 overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-900 [&amp;+*]:mt-8">
                      <img
                        alt=""
                        loading="lazy"
                        width="1728"
                        height="936"
                        decoding="async"
                        data-nimg="1"
                        style="color:transparent"
                        sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 45vw, (min-width: 640px) 32rem, 95vw"
                        [src]="theme() === 'light' ? '/assets/images/aireply.png' : '/assets/images/aireply-dark.png'"
                      />
                      <div
                        class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/10 dark:ring-white/10"
                      ></div>
                    </div>
                    <h2 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-8 py-3">
                      <a>Cronologia delle risposte</a>
                    </h2>
                    <p class="text-zinc-700 dark:text-zinc-300 text-sm font-light pb-2">
                      É possibile visualizzare la cronologia delle risposte generate dalla AI. Questo ti permette
                      scegliere la risposta che più ti soddisfa e inviarla al cliente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <article class="scroll-mt-16" style="padding-bottom:0px">
            <div>
              <header class="relative mb-10 xl:mb-0">
                <div
                  class="pointer-events-none absolute left-[max(-0.5rem,calc(50%-18.625rem))] top-0 z-50 flex h-4 items-center justify-end gap-x-2 lg:left-0 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] xl:h-8"
                >
                  <a class="inline-flex"
                    ><time
                      class="hidden xl:pointer-events-auto xl:block text-xs xl:font-medium text-black/80 dark:text-white/50"
                      >Lug 26, 2024</time
                    ></a
                  >
                  <div class="h-[0.0625rem] w-3.5 lg:-mr-3.5 xl:mr-0 bg-zinc-700 dark:bg-zinc-300"></div>
                </div>
                <div class="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
                  <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
                    <div class="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto">
                      <div class="flex">
                        <a class="inline-flex"
                          ><time
                            datetime="2023-04-06T00:00:00.000Z"
                            class="text-2xs/4 font-medium text-zinc-500 xl:hidden"
                            >Lug 26, 2024</time
                          ></a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </header>
              <div class="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
                <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
                  <div
                    class="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto typography"
                    data-mdx-content="true"
                  >
                    <div class="relative mt-8 overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-900 [&amp;+*]:mt-8">
                      <img
                        alt=""
                        loading="lazy"
                        width="1728"
                        height="936"
                        decoding="async"
                        data-nimg="1"
                        style="color:transparent"
                        sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 45vw, (min-width: 640px) 32rem, 95vw"
                        [src]="theme() === 'light' ? '/assets/images/setup.png' : '/assets/images/setup-dark.png'"
                      />
                      <div
                        class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/10 dark:ring-white/10"
                      ></div>
                    </div>
                    <h2 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-8 py-3">
                      <a>Setup</a>
                    </h2>
                    <p class="text-zinc-700 dark:text-zinc-300 text-sm font-light pb-2">
                      La creazione del locale é completamente cambiata, ora la creazione é molto piú semplice, veloce e
                      potente. Andando in <a class="underline font-medium" [routerLink]="['/setup']">/setup</a> potrai
                      notare che é presente uno stepper che ti guiderá passo passo nella creazione del tuo locale.
                    </p>
                    <p class="text-zinc-700 dark:text-zinc-300 text-sm font-light pb-2">
                      Per ogni step ti consiglieremo i canali (Google, Tripadvisor, The Fork) e i competitor del locale
                      appena creato. In questo modo potrai accertarti che i canali della tua attivitá siano corretti e
                      che i competitor siano quelli giusti.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <article id="project-configuration-files" class="scroll-mt-16" style="padding-bottom: 1.75781px;">
            <div>
              <header class="relative mb-10 xl:mb-0">
                <div
                  class="pointer-events-none absolute left-[max(-0.5rem,calc(50%-18.625rem))] top-0 z-50 flex h-4 items-center justify-end gap-x-2 lg:left-0 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] xl:h-8"
                >
                  <a class="inline-flex"
                    ><time
                      datetime="2023-03-17T00:00:00.000Z"
                      class="hidden xl:pointer-events-auto xl:block text-xs xl:font-medium text-black/80 dark:text-white/50"
                      >Lug 24, 2024</time
                    ></a
                  >
                  <div class="h-[0.0625rem] w-3.5 lg:-mr-3.5 xl:mr-0 bg-zinc-700 dark:bg-zinc-300"></div>
                </div>
                <div class="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
                  <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
                    <div class="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto">
                      <div class="flex">
                        <a class="inline-flex"
                          ><time
                            datetime="2023-03-17T00:00:00.000Z"
                            class="text-2xs/4 font-medium text-zinc-500 xl:hidden"
                            >Lug 24, 2024</time
                          ></a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </header>
              <div class="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
                <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
                  <div
                    class="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto typography"
                    data-mdx-content="true"
                  >
                    <div class="relative mt-8 overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-900 [&amp;+*]:mt-8">
                      <img
                        alt=""
                        loading="lazy"
                        width="1728"
                        height="666"
                        decoding="async"
                        data-nimg="1"
                        style="color:transparent"
                        sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 45vw, (min-width: 640px) 32rem, 95vw"
                        [src]="
                          theme() === 'light'
                            ? '/assets/images/translate-review.png'
                            : '/assets/images/translate-review-dark.png'
                        "
                      />
                      <div
                        class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/10 dark:ring-white/10"
                      ></div>
                    </div>
                    <h2 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-8 py-3">
                      <a>Traduzione della risposta della recensione</a>
                    </h2>
                    <p class="text-zinc-700 dark:text-zinc-300 text-sm font-light pb-2">
                      É possibile visualizzare la traduzione della risposta della recensione generata dalla AI. Questo
                      ti permette di vedere la risposta in lingua originale e la traduzione in lingua correntemente
                      utilizzata (italiana) per capire meglio il contenuto della risposta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  `,
  imports: [TranslateModule, RouterModule],
  standalone: true,
})
export class ChangeLogComponent {
  themeStore = inject(ThemeManagerStore);
  location = inject(Location);
  theme = computed(() => this.themeStore.theme());
}
