import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ClickOutsideDirective } from '../../../../../utils/directives/clickoutside';
import { ShareDialogService } from './dialog.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { QRCodeModule } from 'angularx-qrcode';
import { MenuService } from '../../menu.service';
import { toObservable } from '@angular/core/rxjs-interop';

@UntilDestroy()
@Component({
  selector: 'share-menu-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, InlineSVGModule, ClickOutsideDirective, QRCodeModule],
  template: ` <div
    class="relative z-[10000]"
    [ngClass]="{
      hidden: !dialog.isDialogOpen(),
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
          #container
          class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 ring-1  ring-zinc-300 dark:ring-zinc-700 px-4 pb-4 pt-5 text-left shadow-sm shadow-black/10 transition-all sm:my-8 w-full sm:max-w-xl sm:p-6"
          [ngClass]="{
            'opacity-100 translate-y-0 sm:scale-100': dialog.isDialogVisible(),
            'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !dialog.isDialogVisible()
          }"
          (clickOutside)="dialog.isDialogVisible() && dialog.closeDialog()"
        >
          <div class="flex flex-row items-center justify-between mb-8">
            <span class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {{ 'SHARE' | translate }}
            </span>

            <button
              type="button"
              class="relative rounded-full p-1.5 hover:bg-black/5 hover:dark:bg-zinc-50/5 text-zinc-500 focus:outline-none transition ease-in-out duration-100"
              (click)="dialog.closeDialog()"
            >
              <span class="svg-icon-8 stroke-[1.6]" inlineSVG="xmark.svg"></span>
            </button>
          </div>

          <qrcode
            #qrcodeContainer
            [qrdata]="link()"
            [width]="container.offsetWidth - 60"
            [errorCorrectionLevel]="'M'"
            cssClass="flex flex-col items-center justify-center ring-1 bg-white ring-inset ring-zinc-300 rounded-xl p-1 shadow-sm shadow-black/10"
          ></qrcode>

          <div class="flex flex-row items-center gap-x-2 my-4">
            <button
              class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-xl h-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-[#1A1A1A] text-white bg-gradient-to-b from-black/55 via-[#1A1A1A] to-[#1A1A1A] dark:from-white/10 dark:via-white/5 dark:to-white/5 p-px shadow-md shadow-black/30"
              (click)="open()"
            >
              <div
                class="flex flex-row items-center justify-center gap-x-2 bg-[#1A1A1A] h-full px-3 py-2 rounded-[11px] cursor-pointer"
              >
                <span class="svg-icon-8 stroke-2" inlineSVG="share-up-right.svg"></span>
                <span class="font-semibold">{{ 'OPEN' | translate }}</span>
              </div>
            </button>

            <button
              class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 xl:col-span-1 rounded-xl h-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-[#1A1A1A] text-white bg-gradient-to-b from-black/55 via-[#1A1A1A] to-[#1A1A1A] dark:from-white/10 dark:via-white/5 dark:to-white/5 p-px shadow-md shadow-black/30"
              (click)="copy()"
            >
              <div
                class="flex flex-row items-center justify-center gap-x-2 bg-[#1A1A1A] h-full px-3 py-2 rounded-[11px] cursor-pointer"
              >
                <span class="svg-icon-8 stroke-2" inlineSVG="link.svg"></span>
                <span class="font-semibold">{{ 'COPY' | translate }}</span>
              </div>
            </button>

            @if (copiedSuccesfully()){
            <div class="flex flex-row items-center justify-center">
              <div class="flex flex-row items-center justify-center w-full">
                <span [inlineSVG]="'check.svg'" class="svg-icon-3 text-green-500 stroke-[1.6]"></span>
              </div>
            </div>
            }
          </div>

          <button
            class="col-start-1 col-span-full sm:col-start-2 sm:col-span-1 mt-6 mb-1 xl:col-span-1 rounded-xl w-full h-full transition ease-in-out duration-200 opacity-90 hover:opacity-100 ring-1 dark:ring-0 ring-accent dark:ring-accentDark text-white bg-gradient-to-b from-accent/55 dark:from-accentDark/55 via-accent dark:via-accentDark to-accent dark:to-accentDark p-px shadow-md shadow-black/30"
            (click)="dialog.closeDialog()"
          >
            <div
              class="flex flex-row items-center justify-center gap-x-2 bg-accent dark:bg-accentDark h-full px-3 py-2 w-full rounded-[11px] cursor-pointer"
            >
              <span class="font-semibold text-base">{{ 'DONE' | translate }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>`,
})
export class ShareMenuComponent {
  @ViewChild('qrcodeContainer') public qrcode: any;

  dialog = inject(ShareDialogService);
  menu = inject(MenuService);

  link = signal('');
  copiedSuccesfully = signal(false);

  constructor() {
    toObservable(this.dialog.isDialogOpen)
      .pipe(untilDestroyed(this))
      .subscribe((isOpen) => {
        if (isOpen) {
          this.link.set(`${window.location.origin}/public-menu/${this.menu.menuId()}`);
        }
      });
  }

  open() {
    window.open(this.link(), '_blank');
  }

  copy() {
    navigator.clipboard.writeText(this.link());
    this.copiedSuccesfully.set(true);
    setTimeout(() => this.copiedSuccesfully.set(false), 2000);
  }

  print() {
    const qrCodePrint = window.open('QR CODE PRINT', 'PRINT', 'height=800,width=1000');

    if (qrCodePrint) {
      qrCodePrint.document.write(this.qrcode.nativeElement.innerHTML);

      qrCodePrint.document.write();
      qrCodePrint.document.close();
      qrCodePrint.focus();
      qrCodePrint.print();
    }
  }
}
