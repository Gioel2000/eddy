import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GeneralDialogService {
  isDialogOpen = signal(false);
  isDialogVisible = signal(false);

  title = signal('');
  description = signal('');
  mode = signal<'boolean' | 'ok'>('boolean');
  fuction = signal<() => void>(() => {});

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
