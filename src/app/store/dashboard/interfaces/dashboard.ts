export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';
export interface Graph {
  date: string;
  average: number;
}

export interface BrandReputationTO {
  average: number;
  graph: Graph[];
}

export interface RatingTO {
  rating: number;
  totalCount: number;
  filteredCount: number;
}

export interface TypeTO {
  clientType: string;
  totalCount: number;
  filteredCount: number;
  totalRating: number;
  filteredRating: number;
}

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

export interface ChannelTO {
  channel: string;
  totalRating: number;
  filteredRating: number;
  totalCount: number;
  filteredCount: number;
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
