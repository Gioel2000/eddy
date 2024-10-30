import { Injectable, signal } from '@angular/core';
import { ReviewTO } from '../../store/reviews/interfaces/reviews';

@Injectable({ providedIn: 'root' })
export class SmartReplyDialogService {
  isDialogOpen = signal(false);
  isDialogVisible = signal(false);

  review = signal<ReviewTO | null>(null);

  openDialog() {
    this.isDialogOpen.set(true);
    setTimeout(() => this.isDialogVisible.set(true), 0);
  }

  closeDialog() {
    this.isDialogVisible.set(false);
    setTimeout(() => this.isDialogOpen.set(false), 200);
  }

  toggleDialog() {
    if (this.isDialogOpen()) this.closeDialog();
    else this.openDialog();
  }
}
