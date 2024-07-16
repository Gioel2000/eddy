export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';
export interface CompetitorSuggestedModel {
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
