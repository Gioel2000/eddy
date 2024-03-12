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
