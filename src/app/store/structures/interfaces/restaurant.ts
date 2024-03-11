export interface RestaurantTOModel {
  _id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  email: string;
  telephone: string;
  website: string;
  image: string;
  openaiLimit: number;
}

export interface License {
  _id: string;
  activedOn: string;
  active: boolean;
  key: string;
  createdOn: string;
}

export interface Service {
  _id: string;
  hotelName: string;
  source: string;
  api: Api;
}

export interface Api {
  url: string;
  pageName: string;
  cn: string;
}

export interface Competitor {
  _id: string;
  name: string;
  source: string;
  api: Api;
}

export interface Admin {
  _id: string;
  name: string;
  surname: string;
  email: string;
  icon: string;
}

export interface DataGraphModel {
  date: Date;
  average: number;
}

export interface RestaurantModel extends RestaurantTOModel {
  show: boolean;
}

export interface SetTO {
  message: string;
  expireDate: string;
}

export interface Channels {
  _id: string;
  source: string;
  url: string;
}

export interface RestaurantSettedTO {
  _id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  email: string;
  telephone: string;
  website: string;
  image: string;
  channels: Channels[];
  openaiLimit: number;
  __v: number;
}

export type AddRestaurant = Omit<RestaurantTOModel, 'openaiLimit'> &
  Omit<RestaurantTOModel, '_id'> & { googleMapsLink: string } & { image: string };

export type EditRestaurant = {
  id: string;
  restaurant: Omit<RestaurantTOModel, 'openaiLimit'> & Omit<RestaurantTOModel, '_id'>;
};

export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';
