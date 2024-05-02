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
  sentiments: Sentiment[];
  replyLink: string;
  hasReplied: boolean;
  clientsType?: string[];
  reviewId?: any;
  externalSource?: any;
  aiReply: string;
  categories: {
    category: string;
    rating: number;
  }[];
  __v: number;
}

export interface Sentiment {
  category: string[];
  positive: string[];
  negative: any[];
  score: number;
  sentence: string;
  words: string[];
  wordsIt: string[];
}

export interface SummaryTO {
  count: number;
  rating: number;
  ratingGrouped: {
    count: number;
    rating: number;
  }[];
}

export interface SentimentTO {
  word: string;
  bad: number;
  good: number;
  neutral: number;
}
