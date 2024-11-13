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
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="100%"
                      viewBox="0 0 384 214"
                      enable-background="new 0 0 384 214"
                      xml:space="preserve"
                      class="text-white dark:text-dark w-[4.2rem] h-[4.2rem]"
                    >
                      <path
                        fill="currentColor"
                        opacity="1.000000"
                        stroke="none"
                        d="
                  M285.000000,237.000000 
                    C190.000031,237.000000 95.500053,237.000000 1.000063,237.000000 
                    C1.000042,158.333389 1.000042,79.666771 1.000021,1.000116 
                    C128.999908,1.000077 256.999817,1.000077 384.999817,1.000039 
                    C384.999878,79.666557 384.999878,158.333115 384.999939,236.999832 
                    C351.833344,237.000000 318.666656,237.000000 285.000000,237.000000 
                  M271.850616,220.491821 
                    C275.559448,215.648270 280.644196,211.323822 282.705994,205.858887 
                    C287.847412,192.231537 291.545227,178.063385 296.009369,164.172379 
                    C296.656799,162.157822 297.942047,159.936630 299.600830,158.731369 
                    C306.062622,154.036224 312.799591,149.720413 319.421082,145.244049 
                    C321.488800,143.846207 323.656372,142.549240 325.527924,140.918762 
                    C328.482056,138.345139 329.551331,131.103302 327.183380,128.489258 
                    C323.615417,124.550522 320.548676,127.819954 317.636536,129.774338 
                    C311.857605,133.652679 306.190247,137.697235 299.992096,142.010361 
                    C300.187653,140.155197 300.260651,138.874268 300.465088,137.614670 
                    C302.570892,124.638069 304.770935,111.676224 306.786102,98.685669 
                    C307.693939,92.833336 306.124939,91.125595 300.610962,91.267227 
                    C294.193787,91.432060 291.996307,93.566856 289.473602,100.588409 
                    C285.829468,110.731422 282.057404,120.846596 277.795837,130.739273 
                    C276.417053,133.939987 274.443634,138.806534 269.973022,137.347549 
                    C268.543457,136.881012 268.094482,130.780167 268.609802,127.477715 
                    C270.146790,117.627655 272.420593,107.893974 274.333954,98.100647 
                    C275.321686,93.045044 273.849426,91.358421 268.700134,91.366035 
                    C261.213715,91.377106 257.656830,93.447777 256.064850,100.774948 
                    C253.637726,111.946060 251.787811,123.269012 250.313248,134.608170 
                    C249.687820,139.417511 246.567825,141.235001 243.088120,142.414169 
                    C241.224579,143.045654 238.001511,142.289597 236.529541,140.929001 
                    C233.001999,137.668427 232.818298,129.178619 234.886139,124.663231 
                    C242.280334,108.517059 250.143524,92.535233 256.500061,75.980835 
                    C261.272583,63.551765 263.639160,50.284367 261.058167,36.752495 
                    C259.871124,30.528858 257.089478,25.244982 250.466797,23.520615 
                    C243.739212,21.768930 238.068649,24.482885 234.272614,29.822397 
                    C230.945099,34.502876 227.675919,39.686104 226.211395,45.138885 
                    C222.557709,58.742546 220.018005,72.642799 216.822220,86.375381 
                    C216.427628,88.071060 214.964813,90.608009 213.658737,90.838516 
                    C193.507935,94.394882 178.044052,113.941162 178.980591,136.476379 
                    C179.140686,140.328964 177.620941,141.970764 174.394974,142.861450 
                    C170.854675,143.838928 168.402466,142.231796 167.219635,139.105774 
                    C165.267014,133.945328 164.536209,129.176895 167.350952,123.440781 
                    C175.095291,107.658775 182.503632,91.636711 188.737350,75.213326 
                    C193.403763,62.919144 195.654922,49.792068 193.009628,36.452435 
                    C191.817612,30.441406 189.044022,25.323929 182.654587,23.569279 
                    C176.155991,21.784649 170.506348,24.168985 166.744980,29.313826 
                    C163.261353,34.078762 159.799683,39.365635 158.271667,44.954021 
                    C154.557144,58.539165 151.939926,72.426147 148.962646,86.209244 
                    C148.478561,88.450363 148.739807,90.429352 145.411713,91.161171 
                    C125.357880,95.570847 111.803314,111.795113 111.072937,132.290909 
                    C110.941322,135.984146 109.517181,137.345703 106.323700,137.784988 
                    C96.442451,139.144196 86.572983,141.441284 76.675446,141.570236 
                    C68.193985,141.680695 59.279400,140.484161 51.274155,137.757935 
                    C39.132374,133.623016 37.376770,119.308777 47.701195,111.588715 
                    C51.820412,108.508583 57.058372,106.568672 62.081188,105.154190 
                    C66.988731,103.772163 72.285019,103.814949 77.385048,103.059372 
                    C82.304131,102.330612 84.269890,99.150024 84.301651,93.213860 
                    C84.327888,88.309219 81.157921,87.638092 77.428993,87.220688 
                    C73.964157,86.832840 70.422058,86.605400 67.089996,85.676155 
                    C60.928295,83.957794 56.210445,80.265450 55.266109,73.558693 
                    C54.316124,66.811844 57.253700,61.426239 62.907982,57.854271 
                    C71.400520,52.489296 80.740013,51.665787 90.294495,54.137882 
                    C95.609177,55.512978 98.244766,59.462437 98.027672,64.948044 
                    C97.883240,68.597610 96.716064,72.296524 97.120163,75.846596 
                    C97.392143,78.235970 99.069099,81.366669 101.060608,82.482513 
                    C106.126648,85.321007 112.213318,82.877228 115.087341,77.702576 
                    C120.117371,68.646057 118.485802,54.504250 111.616417,46.743664 
                    C105.304916,39.613323 96.967896,37.250496 87.943153,36.642899 
                    C70.941856,35.498272 54.995136,38.191158 42.065144,50.461609 
                    C29.255772,62.617599 29.384434,85.665962 47.724434,93.420097 
                    C47.888367,93.489410 47.879856,93.966576 47.969204,94.322426 
                    C44.783489,95.620918 41.516243,96.770782 38.406414,98.251305 
                    C24.005239,105.107361 16.471624,119.425369 20.002481,133.848206 
                    C23.165161,146.767090 33.194618,152.664932 44.847328,155.900574 
                    C67.608986,162.220856 90.351105,160.049286 113.002876,154.718781 
                    C114.795143,154.297028 117.329651,154.502228 118.764030,155.500793 
                    C127.474243,161.564636 138.419434,161.084595 146.301132,153.864151 
                    C148.350693,151.986542 150.231369,149.924561 152.227692,147.908798 
                    C161.613480,161.872818 167.786285,162.980881 184.994614,153.892822 
                    C190.261475,158.875031 196.840530,161.417419 203.677094,158.913803 
                    C209.799728,156.671646 215.218994,152.508835 221.043655,149.138382 
                    C229.832748,162.109833 237.899033,163.324707 253.629822,153.087158 
                    C257.397369,158.148010 262.512909,161.742279 268.590302,158.886475 
                    C273.681732,156.493988 277.775574,151.978561 281.808563,148.799301 
                    C282.279266,154.774063 281.471222,155.660797 276.456512,160.300964 
                    C267.680481,168.421539 258.910400,176.619125 250.900238,185.474136 
                    C244.680984,192.349396 242.141876,201.079147 242.920227,210.502960 
                    C243.497330,217.490128 248.620407,222.991089 255.494278,224.076843 
                    C261.120514,224.965546 266.443848,224.199570 271.850616,220.491821 
                  M371.288269,139.601837 
                    C369.443634,133.740753 364.486389,132.706772 359.430267,132.432877 
                    C354.218170,132.150528 349.406647,133.597168 346.781036,138.663300 
                    C344.017761,143.994858 343.707245,149.559875 346.982300,154.781601 
                    C349.933777,159.487442 354.828766,160.056381 359.784058,159.555374 
                    C369.075745,158.615891 373.220245,151.742676 371.288269,139.601837 
                  z"
                      />
                      <path
                        class="fill-accent dark:fill-accentDark"
                        opacity="1.000000"
                        stroke="none"
                        d="
                  M271.546570,220.698456 
                    C266.443848,224.199570 261.120514,224.965546 255.494278,224.076843 
                    C248.620407,222.991089 243.497330,217.490128 242.920227,210.502960 
                    C242.141876,201.079147 244.680984,192.349396 250.900238,185.474136 
                    C258.910400,176.619125 267.680481,168.421539 276.456512,160.300964 
                    C281.471222,155.660797 282.279266,154.774063 281.808563,148.799301 
                    C277.775574,151.978561 273.681732,156.493988 268.590302,158.886475 
                    C262.512909,161.742279 257.397369,158.148010 253.629822,153.087158 
                    C237.899033,163.324707 229.832748,162.109833 221.043655,149.138382 
                    C215.218994,152.508835 209.799728,156.671646 203.677094,158.913803 
                    C196.840530,161.417419 190.261475,158.875031 184.994614,153.892822 
                    C167.786285,162.980881 161.613480,161.872818 152.227692,147.908798 
                    C150.231369,149.924561 148.350693,151.986542 146.301132,153.864151 
                    C138.419434,161.084595 127.474243,161.564636 118.764030,155.500793 
                    C117.329651,154.502228 114.795143,154.297028 113.002876,154.718781 
                    C90.351105,160.049286 67.608986,162.220856 44.847328,155.900574 
                    C33.194618,152.664932 23.165161,146.767090 20.002481,133.848206 
                    C16.471624,119.425369 24.005239,105.107361 38.406414,98.251305 
                    C41.516243,96.770782 44.783489,95.620918 47.969204,94.322426 
                    C47.879856,93.966576 47.888367,93.489410 47.724434,93.420097 
                    C29.384434,85.665962 29.255772,62.617599 42.065144,50.461609 
                    C54.995136,38.191158 70.941856,35.498272 87.943153,36.642899 
                    C96.967896,37.250496 105.304916,39.613323 111.616417,46.743664 
                    C118.485802,54.504250 120.117371,68.646057 115.087341,77.702576 
                    C112.213318,82.877228 106.126648,85.321007 101.060608,82.482513 
                    C99.069099,81.366669 97.392143,78.235970 97.120163,75.846596 
                    C96.716064,72.296524 97.883240,68.597610 98.027672,64.948044 
                    C98.244766,59.462437 95.609177,55.512978 90.294495,54.137882 
                    C80.740013,51.665787 71.400520,52.489296 62.907982,57.854271 
                    C57.253700,61.426239 54.316124,66.811844 55.266109,73.558693 
                    C56.210445,80.265450 60.928295,83.957794 67.089996,85.676155 
                    C70.422058,86.605400 73.964157,86.832840 77.428993,87.220688 
                    C81.157921,87.638092 84.327888,88.309219 84.301651,93.213860 
                    C84.269890,99.150024 82.304131,102.330612 77.385048,103.059372 
                    C72.285019,103.814949 66.988731,103.772163 62.081188,105.154190 
                    C57.058372,106.568672 51.820412,108.508583 47.701195,111.588715 
                    C37.376770,119.308777 39.132374,133.623016 51.274155,137.757935 
                    C59.279400,140.484161 68.193985,141.680695 76.675446,141.570236 
                    C86.572983,141.441284 96.442451,139.144196 106.323700,137.784988 
                    C109.517181,137.345703 110.941322,135.984146 111.072937,132.290909 
                    C111.803314,111.795113 125.357880,95.570847 145.411713,91.161171 
                    C148.739807,90.429352 148.478561,88.450363 148.962646,86.209244 
                    C151.939926,72.426147 154.557144,58.539165 158.271667,44.954021 
                    C159.799683,39.365635 163.261353,34.078762 166.744980,29.313826 
                    C170.506348,24.168985 176.155991,21.784649 182.654587,23.569279 
                    C189.044022,25.323929 191.817612,30.441406 193.009628,36.452435 
                    C195.654922,49.792068 193.403763,62.919144 188.737350,75.213326 
                    C182.503632,91.636711 175.095291,107.658775 167.350952,123.440781 
                    C164.536209,129.176895 165.267014,133.945328 167.219635,139.105774 
                    C168.402466,142.231796 170.854675,143.838928 174.394974,142.861450 
                    C177.620941,141.970764 179.140686,140.328964 178.980591,136.476379 
                    C178.044052,113.941162 193.507935,94.394882 213.658737,90.838516 
                    C214.964813,90.608009 216.427628,88.071060 216.822220,86.375381 
                    C220.018005,72.642799 222.557709,58.742546 226.211395,45.138885 
                    C227.675919,39.686104 230.945099,34.502876 234.272614,29.822397 
                    C238.068649,24.482885 243.739212,21.768930 250.466797,23.520615 
                    C257.089478,25.244982 259.871124,30.528858 261.058167,36.752495 
                    C263.639160,50.284367 261.272583,63.551765 256.500061,75.980835 
                    C250.143524,92.535233 242.280334,108.517059 234.886139,124.663231 
                    C232.818298,129.178619 233.001999,137.668427 236.529541,140.929001 
                    C238.001511,142.289597 241.224579,143.045654 243.088120,142.414169 
                    C246.567825,141.235001 249.687820,139.417511 250.313248,134.608170 
                    C251.787811,123.269012 253.637726,111.946060 256.064850,100.774948 
                    C257.656830,93.447777 261.213715,91.377106 268.700134,91.366035 
                    C273.849426,91.358421 275.321686,93.045044 274.333954,98.100647 
                    C272.420593,107.893974 270.146790,117.627655 268.609802,127.477715 
                    C268.094482,130.780167 268.543457,136.881012 269.973022,137.347549 
                    C274.443634,138.806534 276.417053,133.939987 277.795837,130.739273 
                    C282.057404,120.846596 285.829468,110.731422 289.473602,100.588409 
                    C291.996307,93.566856 294.193787,91.432060 300.610962,91.267227 
                    C306.124939,91.125595 307.693939,92.833336 306.786102,98.685669 
                    C304.770935,111.676224 302.570892,124.638069 300.465088,137.614670 
                    C300.260651,138.874268 300.187653,140.155197 299.992096,142.010361 
                    C306.190247,137.697235 311.857605,133.652679 317.636536,129.774338 
                    C320.548676,127.819954 323.615417,124.550522 327.183380,128.489258 
                    C329.551331,131.103302 328.482056,138.345139 325.527924,140.918762 
                    C323.656372,142.549240 321.488800,143.846207 319.421082,145.244049 
                    C312.799591,149.720413 306.062622,154.036224 299.600830,158.731369 
                    C297.942047,159.936630 296.656799,162.157822 296.009369,164.172379 
                    C291.545227,178.063385 287.847412,192.231537 282.705994,205.858887 
                    C280.644196,211.323822 275.559448,215.648270 271.546570,220.698456 
                  M214.023102,106.933502 
                    C204.954590,110.550354 200.471710,118.012634 198.374329,126.874557 
                    C197.419342,130.909607 197.572571,135.509567 198.505356,139.557831 
                    C198.954651,141.507751 202.227707,143.809021 204.480560,144.128464 
                    C208.888748,144.753540 216.138504,136.758942 215.966095,132.174026 
                    C215.653732,123.866898 215.204956,115.564903 214.023102,106.933502 
                  M147.643555,128.762146 
                    C147.314362,121.544403 146.985168,114.326653 146.655807,107.105095 
                    C138.637329,107.770409 129.670135,121.916878 129.773666,130.722244 
                    C129.780792,131.328384 130.286255,131.912415 130.445724,132.535950 
                    C131.004532,134.721039 131.880539,136.905014 131.964478,139.114914 
                    C132.138336,143.690063 134.665207,145.525772 138.982239,143.806503 
                    C143.893173,141.850708 148.172760,134.956635 147.643555,128.762146 
                  M168.155869,96.726517 
                    C170.288712,91.156136 172.683380,85.669617 174.499969,79.997948 
                    C178.301758,68.128166 181.784439,56.144047 180.065842,43.434505 
                    C179.807831,41.526436 178.820557,39.716976 178.170624,37.861900 
                    C177.566223,37.910931 176.961823,37.959957 176.357407,38.008984 
                    C167.191406,57.547379 167.999481,78.957130 164.899750,99.633690 
                    C165.309113,99.770218 165.718475,99.906746 166.127838,100.043274 
                    C166.721893,99.182152 167.315948,98.321037 168.155869,96.726517 
                  M235.945236,72.373413 
                    C234.967407,81.515587 233.989594,90.657761 233.011765,99.799934 
                    C241.777954,89.097679 250.004440,57.228107 248.270432,44.661526 
                    C247.952545,42.357761 247.097656,40.128094 246.490662,37.864220 
                    C245.932449,37.881451 245.374237,37.898682 244.816025,37.915909 
                    C238.468796,48.127415 237.971252,60.013897 235.945236,72.373413 
                  M273.958252,188.419907 
                    C275.015808,184.467194 276.073334,180.514465 277.519592,175.108704 
                    C268.209839,183.554016 260.078308,190.996796 257.766602,202.430832 
                    C257.331879,204.580917 259.017792,207.159744 259.725128,209.540726 
                    C261.773315,208.473785 264.744965,207.929749 265.699707,206.243652 
                    C268.789459,200.786896 271.138519,194.910767 273.958252,188.419907 
                  z"
                      />
                      <path
                        class="fill-zinc-800 dark:fill-zinc-200"
                        opacity="1.000000"
                        stroke="none"
                        d="
                  M371.434906,139.988342 
                    C373.220245,151.742676 369.075745,158.615891 359.784058,159.555374 
                    C354.828766,160.056381 349.933777,159.487442 346.982300,154.781601 
                    C343.707245,149.559875 344.017761,143.994858 346.781036,138.663300 
                    C349.406647,133.597168 354.218170,132.150528 359.430267,132.432877 
                    C364.486389,132.706772 369.443634,133.740753 371.434906,139.988342 
                  z"
                      />
                      <path
                        fill="currentColor"
                        opacity="1.000000"
                        stroke="none"
                        d="
                  M214.418121,107.097137 
                    C215.204956,115.564903 215.653732,123.866898 215.966095,132.174026 
                    C216.138504,136.758942 208.888748,144.753540 204.480560,144.128464 
                    C202.227707,143.809021 198.954651,141.507751 198.505356,139.557831 
                    C197.572571,135.509567 197.419342,130.909607 198.374329,126.874557 
                    C200.471710,118.012634 204.954590,110.550354 214.418121,107.097137 
                  z"
                      />
                      <path
                        fill="currentColor"
                        opacity="1.000000"
                        stroke="none"
                        d="
                  M147.711517,129.198532 
                    C148.172760,134.956635 143.893173,141.850708 138.982239,143.806503 
                    C134.665207,145.525772 132.138336,143.690063 131.964478,139.114914 
                    C131.880539,136.905014 131.004532,134.721039 130.445724,132.535950 
                    C130.286255,131.912415 129.780792,131.328384 129.773666,130.722244 
                    C129.670135,121.916878 138.637329,107.770409 146.655807,107.105095 
                    C146.985168,114.326653 147.314362,121.544403 147.711517,129.198532 
                  z"
                      />
                      <path
                        fill="currentColor"
                        opacity="1.000000"
                        stroke="none"
                        d="
                  M168.032928,97.093216 
                    C167.315948,98.321037 166.721893,99.182152 166.127838,100.043274 
                    C165.718475,99.906746 165.309113,99.770218 164.899750,99.633690 
                    C167.999481,78.957130 167.191406,57.547379 176.357407,38.008984 
                    C176.961823,37.959957 177.566223,37.910931 178.170624,37.861900 
                    C178.820557,39.716976 179.807831,41.526436 180.065842,43.434505 
                    C181.784439,56.144047 178.301758,68.128166 174.499969,79.997948 
                    C172.683380,85.669617 170.288712,91.156136 168.032928,97.093216 
                  z"
                      />
                      <path
                        fill="currentColor"
                        opacity="1.000000"
                        stroke="none"
                        d="
                  M235.977417,71.927284 
                    C237.971252,60.013897 238.468796,48.127415 244.816025,37.915909 
                    C245.374237,37.898682 245.932449,37.881451 246.490662,37.864220 
                    C247.097656,40.128094 247.952545,42.357761 248.270432,44.661526 
                    C250.004440,57.228107 241.777954,89.097679 233.011765,99.799934 
                    C233.989594,90.657761 234.967407,81.515587 235.977417,71.927284 
                  z"
                      />
                      <path
                        fill="currentColor"
                        opacity="1.000000"
                        stroke="none"
                        d="
                  M273.865601,188.808044 
                    C271.138519,194.910767 268.789459,200.786896 265.699707,206.243652 
                    C264.744965,207.929749 261.773315,208.473785 259.725128,209.540741 
                    C259.017792,207.159744 257.331879,204.580917 257.766602,202.430832 
                    C260.078308,190.996796 268.209839,183.554016 277.519592,175.108704 
                    C276.073334,180.514465 275.015808,184.467194 273.865601,188.808044 
                  z"
                      />
                    </svg>
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
                      >Nov 11, 2024</time
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
                            >Nov 11, 2024</time
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
                        [src]="
                          theme() === 'light' ? '/assets/images/smartreply.png' : '/assets/images/smartreply-dark.png'
                        "
                      />
                      <div
                        class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/10 dark:ring-white/10"
                      ></div>
                    </div>
                    <h2 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-8 py-3">
                      <a>Smart reply AI</a>
                    </h2>
                    <p class="text-zinc-700 dark:text-zinc-300 text-sm font-light pb-2">
                      Smart Reply é uno strumento che ti consente di rispondere alle recensioni in modo piú personale e
                      dettagliato attraverso l'intelligenza artificiale. Puoi sceglere con quale personalitá utilizzare
                      per rispondere alle recensioni e la lingua da utilizzare.
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
