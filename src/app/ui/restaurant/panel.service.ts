import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RestaurantPanelService {
  isPanelOpen = signal(false);
  isPanelVisible = signal(false);
  isAllowed = signal(true);

  openPanel() {
    if (!this.isAllowed()) return;
    this.isPanelOpen.set(true);
    setTimeout(() => this.isPanelVisible.set(true), 0);
  }

  closePanel() {
    if (!this.isAllowed()) return;
    this.isPanelVisible.set(false);
    setTimeout(() => this.isPanelOpen.set(false), 500);
  }

  togglePanel() {
    if (!this.isAllowed()) return;
    if (this.isPanelOpen()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }
}
