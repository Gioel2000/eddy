import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CompetitorPanelService {
  isPanelOpen = signal(false);
  isPanelVisible = signal(false);

  openPanel() {
    this.isPanelOpen.set(true);
    setTimeout(() => this.isPanelVisible.set(true), 0);
  }

  closePanel() {
    this.isPanelVisible.set(false);
    setTimeout(() => {
      this.isPanelOpen.set(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  }

  togglePanel() {
    if (this.isPanelOpen()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }
}
