export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';
export interface CategoryTO {
  _id: string;
  name: string;
  icon: string;
}

export interface DishTO {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  currency: string;
  visible: true;
  allergens: string[];
}

export type AddCategory = Omit<CategoryTO, '_id'>;
export type EditCategory = CategoryTO;
export type AddDish = {
  name: string;
  description?: string;
  image?: File;
  category: string;
  price: number;
  currency: string;
  visible: boolean;
  allergens: string[];
};
