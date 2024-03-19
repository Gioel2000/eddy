import { Injectable, signal } from '@angular/core';
import { CategoryTO, DishTO, MenuTO } from '../../../store/menu/interfaces/menu';

@Injectable({ providedIn: 'root' })
export class MenuService {
  categoryMode = signal<'edit' | 'add'>('add');
  category = signal<CategoryTO>({} as CategoryTO);

  dishMode = signal<'edit' | 'add'>('add');
  dish = signal<DishTO>({} as DishTO);

  menuMode = signal<'edit' | 'add'>('add');
  menu = signal<MenuTO>({} as MenuTO);

  menuId = signal('');
}
