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
          class="relative transform overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-800 ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 px-4 pb-4 pt-5 text-left shadow-sm shadow-black/10 transition-all sm:my-8 w-full sm:max-w-xl sm:p-6"
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
            cssClass="flex flex-col items-center justify-center ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 rounded-md p-1 shadow-sm shadow-black/10"
          ></qrcode>

          <div class="my-4">
            <button
              type="button"
              class="flex flex-row items-center justify-center font-semibold col-span-1 rounded-lg gap-x-1 px-3 py-2 cursor-pointer ring-1 ring-inset ring-zinc-950 hover:ring-zinc-800 bg-gradient-to-t from-zinc-900 to-zinc-700 hover:from-zinc-800 hover:to-zinc-600 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)] disabled:opacity-30"
              (click)="open()"
            >
              <span class="svg-icon-8 stroke-[1.6]" inlineSVG="link.svg"></span>
              <span>{{ 'OPEN' | translate }}</span>
            </button>
            <!-- <button
              type="button"
              class="flex flex-row items-center justify-center font-semibold col-span-1 rounded-lg gap-x-1 px-3 py-2 cursor-pointer ring-1 ring-inset ring-zinc-950 hover:ring-zinc-800 bg-gradient-to-t from-zinc-900 to-zinc-700 hover:from-zinc-800 hover:to-zinc-600 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)] disabled:opacity-30"
              (click)="print()"
            >
              <span class="svg-icon-8 stroke-[1.6]" inlineSVG="print.svg"></span>
              <span>{{ 'PRINT' | translate }}</span>
            </button> -->
          </div>

          <button
            class="flex flex-row items-center justify-center col-span-1 rounded-lg mt-12 p-2 w-full cursor-pointer ring-1 ring-inset ring-accent bg-gradient-to-t from-accent to-accent/70 hover:bg-accent/90 text-white shadow-[shadow:inset_0_2px_theme(colors.white/40%)] disabled:opacity-30 disabled:cursor-not-allowed transition ease-in-out duration-200"
            (click)="dialog.closeDialog()"
          >
            <span class="font-semibold text-base">{{ 'DONE' | translate }}</span>
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
