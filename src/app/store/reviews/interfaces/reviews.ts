export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';

export interface ReviewTO {
  _id: string;
  name: string;
  title: string;
  country: string;
  language: string;
  text: string;
  date: string;
  channel: {
    source: string;
  };
  rating: number;
  createdAt: string;
  updatedAt: string;
  translations: any[];
  sentiments: any[];
  replyLink: string;
  hasReplied: boolean;
  clientsType?: string[];
  reviewId?: any;
  externalSource?: any;
  __v: number;
}

export interface SummaryTO {
  count: number;
  rating: number;
  ratingGrouped: {
    count: number;
    rating: number;
  }[];
}
