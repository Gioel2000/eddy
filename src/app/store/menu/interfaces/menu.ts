export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';
export interface CategoryTO {
  _id: string;
  name: string;
  icon: string;
}

export type AddCategory = Omit<CategoryTO, '_id'>;
export type EditCategory = CategoryTO;
