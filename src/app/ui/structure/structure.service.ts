import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StructureUIService {
  isMenuOpen = signal(false);
  isMenuVisible = signal(false);

  isDropdownOpen = signal(false);
  isDropdownVisible = signal(false);

  isDropdownOpenSm = signal(false);
  isDropdownVisibleSm = signal(false);

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

  openDropdown() {
    this.isDropdownOpen.set(true);
    setTimeout(() => this.isDropdownVisible.set(true), 0);
  }

  closeDropdown() {
    this.isDropdownVisible.set(false);
    setTimeout(() => this.isDropdownOpen.set(false), 200);
  }

  toggleDropdown() {
    if (this.isDropdownOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdownSm() {
    this.isDropdownOpenSm.set(true);
    setTimeout(() => this.isDropdownVisibleSm.set(true), 0);
  }

  closeDropdownSm() {
    this.isDropdownVisibleSm.set(false);
    setTimeout(() => this.isDropdownOpenSm.set(false), 200);
  }

  toggleDropdownSm() {
    if (this.isDropdownOpenSm()) {
      this.closeDropdownSm();
    } else {
      this.openDropdownSm();
    }
  }
}
