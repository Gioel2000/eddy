export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';

export interface MenuTO {
  _id: string;
  name: string;
  description: string;
  image: string;
  restaurant: Restaurant;
  dishes: Dish[];
  categories: Category[];
}

export interface Restaurant {
  _id: string;
  name: string;
}

export interface Dish {
  dish: Dish2;
  orderNumber: number;
}

export interface Dish2 {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  currency: string;
  visible: boolean;
  restaurant: string;
  allergens: string[];
}

export interface Category {
  category: Category2;
  orderNumber: number;
}

export interface Category2 {
  _id: string;
  name: string;
  icon: string;
  restaurant: string;
}
