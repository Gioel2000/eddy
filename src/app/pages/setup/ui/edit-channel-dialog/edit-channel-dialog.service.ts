import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EditChannelDialogService {
  isDialogOpen = signal(false);
  isDialogVisible = signal(false);

  url = signal('');
  fuction = signal<() => void>(() => {});
  source = signal<'google' | 'tripadvisor' | 'the_fork'>('google');
  placeholder = computed(() => {
    return this.source() === 'google'
      ? 'www.google.com/travel/hotels/entity/aje4nbsk'
      : this.source() === 'tripadvisor'
      ? 'https://www.tripadvisor.it/Restaurant_Review-123456'
      : 'www.thefork.it/ristorante/eddy-r732559';
  });

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
