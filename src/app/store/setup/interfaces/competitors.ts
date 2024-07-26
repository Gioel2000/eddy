export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';
export interface CompetitorSuggestedTO {
  competitorReference: {
    id: string;
    channels: boolean;
  } | null;
  name: string;
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  phone: string;
  website: string;
  url: string;
  photos: {
    height: number;
    html_attributions: string[];
    photo_reference: string;
    width: number;
  }[];
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
}

export type AddCompetitor = {
  name: string;
  address: string;
  zipCode: string;
  city: string;
  telephone: string;
  email: string;
  website: string;
  image: string | File;
  type: string;
  googleMapsLink: string;
  googlePlaceId: string;
  latitude: number;
  longitude: number;
};

export interface CompetitorSuggestedModel extends CompetitorSuggestedTO {
  selected: boolean;
  isAdded: boolean;
}

export interface ChannelTO {
  channel: {
    source: string;
    api: {
      url: string;
      id: string;
    };
  };
  name: string;
  image: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
}

export interface ChannelsModel {
  key: 'google' | 'tripadvisor' | 'thefork';
  name: string;
  channel: ChannelTO | null;
  address: string | null;
  checked: boolean;
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
