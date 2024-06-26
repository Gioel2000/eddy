import { Injectable, Signal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DialogService {
  isDialogOpen = signal(false);
  isDialogVisible = signal(false);

  optionSelected = signal('theme');

  openDialog() {
    this.isDialogOpen.set(true);
    setTimeout(() => this.isDialogVisible.set(true), 0);
  }

  closeDialog() {
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
