import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DropdownService {
  isOpen = signal(false);
  isVisible = signal(false);

  open() {
    this.isOpen.set(true);
    setTimeout(() => this.isVisible.set(true), 0);
  }

  close() {
    this.isVisible.set(false);
    setTimeout(() => this.isOpen.set(false), 50);
  }

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }
}
