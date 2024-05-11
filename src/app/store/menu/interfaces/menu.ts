export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';
export interface CategoryTO {
  _id: string;
  name: string;
}

export interface DishTO {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  currency: string;
  visible: boolean;
  allergens: string[];
}

export type AddCategory = Omit<CategoryTO, '_id'>;
export type EditCategory = CategoryTO;
export type AddDish = {
  name: string;
  description?: string;
  file?: File;
  category: string;
  price: number;
  currency: string;
  visible: boolean;
  allergens: string;
};

export type EditDish = {
  _id: string;
  name: string;
  description?: string;
  file?: File;
  image: string | null;
  category: string;
  price: number;
  currency: string;
  visible: boolean;
  allergens: string;
};

export interface MenuTO {
  _id: string;
  name: string;
  description: string;
  image: string;
  dishes: {
    dish: string;
    orderNumber: number;
  }[];
  categories: {
    category: string;
    orderNumber: number;
  }[];
}

export type AddMenu = Omit<MenuTO, '_id'>;
export type EditMenu = MenuTO;
