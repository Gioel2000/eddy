export interface RestaurantTOModel {
  _id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  zipCode: string;
  email?: string;
  telephone: string;
  website: string;
  image: string;
  openaiLimit: number;
  googlePlaceId: string;
  status: 'created' | 'channels' | 'competitors' | 'completed';
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

export interface ChannelModelTO {
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
  email?: string;
  telephone: string;
  website: string;
  image: string;
  channels: ChannelModelTO[];
  openaiLimit: number;
  type: string;
  competitors: string[];
  googlePlaceId: string;
  status: 'created' | 'channels' | 'competitors' | 'completed';
}

export type AddRestaurant = Omit<RestaurantSettedTO, '_id' | 'openaiLimit'> & {
  image: File | string;
  googleMapsLink: string;
  latitude: number;
  longitude: number;
  type: 'restaurant' | 'bar' | 'pub' | 'pizzeria';
};

export type EditRestaurant = {
  id: string;
  restaurant: Omit<RestaurantTOModel, 'openaiLimit'> &
    Omit<RestaurantTOModel, '_id'> &
    Omit<RestaurantTOModel, 'status'> & { image: File | string | null };
};

export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';
