import { Injectable, Signal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShareDialogService {
  isDialogOpen = signal(false);
  isDialogVisible = signal(false);
  isAllowed = signal(true);

  openDialog() {
    if (!this.isAllowed()) return;
    this.isDialogOpen.set(true);
    setTimeout(() => this.isDialogVisible.set(true), 0);
  }

  closeDialog() {
    if (!this.isAllowed()) return;
    this.isDialogVisible.set(false);
    setTimeout(() => this.isDialogOpen.set(false), 200);
  }

  toggleDialog() {
    if (this.isDialogOpen()) {
      this.closeDialog();
    } else {
      this.openDialog();
    }
  }
}
