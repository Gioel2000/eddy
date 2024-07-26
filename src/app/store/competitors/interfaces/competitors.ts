export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';

export interface CompetitorTO {
  _id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  image: string;
  channels: any[];
  googleMapsLink: string;
  googlePlaceId: string;
  latitude: number;
  longitude: number;
  active: boolean;
  status: string;
}

export interface CompetitorModel {
  _id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  image: string;
  channels: any[];
  googleMapsLink: string;
  googlePlaceId: string;
  latitude: number;
  longitude: number;
  active: boolean;
  status: string;
  reputation: ReputationModel;
  rating: RatingModel[];
  clientTypes: ClientTypeModel[];
  reviews: ReviewModel[];
  categories: CategoryTO[];
  sentiment: SentimentTO[];
  channelsRatings: any[];
  isDownloading: boolean;
  isExluded: boolean;
}

export interface Channel {
  _id: string;
  source: string;
  url: string;
}

export interface ReputationModel {
  average: number;
  graph: Graph[];
}

export interface Graph {
  date: string;
  average: number;
}

export interface RatingModel {
  rating: number;
  totalCount: number;
  filteredCount: number;
}

export interface ClientTypeModel {
  clientType: string;
  totalCount: number;
  filteredCount: number;
  totalRating: number;
  filteredRating: number;
}

export interface ReviewModel {
  _id: string;
  name: string;
  title: string;
  country: string;
  language: string;
  text: string;
  date: string;
  channel: Channel2;
  rating: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
  translations: Translation[];
  sentiments: any[];
  replyLink: string;
  hasReplied: boolean;
  clientsType: string[];
  reviewId: any;
  externalSource: any;
}

export interface Channel2 {
  source: string;
}

export interface Translation {
  title: string;
  language: string;
  text: string;
}

export interface CategoryTO {
  category: string;
  totalRating: number;
  filteredRating: number;
}

export interface SentimentTO {
  category: string;
  good: number;
  neutral: number;
  bad: number;
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
