export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';

export interface CompetitorTO {
  _id: string;
  name: string;
  image: string;
  channels: {
    _id: string;
    source: string;
    url: string;
  }[];
  gMapsUrl: string;
  active: boolean;
}

export interface CompetitorModel {
  _id: string;
  name: string;
  image: string;
  channels: Channel[];
  gMapsUrl: string;
  active: boolean;
  reputation: ReputationModel;
  rating: RatingModel[];
  clientTypes: ClientTypeModel[];
  reviews: ReviewModel[];
  categories: CategoryTO[];
  sentiment: SentimentTO[];
  channelsRatings: any[];
  address: string;
  city: string;
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

export type AddCompetitor = {
  name: string;
  address: string;
  city: string;
  zipCode: string;
  image: string;
  googleMapsLink: string;
  latitude: number;
  longitude: number;
};

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
