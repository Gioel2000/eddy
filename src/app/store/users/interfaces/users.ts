export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';
export interface UserPayload {
  name: string;
  surname: string;
  email: string;
  role: string;
}

export interface UserTO {
  _id: string;
  name: string;
  surname: string;
  email: string;
  icon: string;
  restaurants: string[];
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
