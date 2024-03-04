import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppServiceService {
  isMenuOpen = signal(false);
  isMenuVisible = signal(false);

  openMenu() {
    this.isMenuOpen.set(true);
    setTimeout(() => this.isMenuVisible.set(true), 0);
  }

  closeMenu() {
    this.isMenuVisible.set(false);
    setTimeout(() => this.isMenuOpen.set(false), 200);
  }

  toggleMenu() {
    if (this.isMenuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
}
