export interface UserTO {
  role: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  sub: string;
  _id: string;
  surname: string;
  restaurants: any[];
  icon: string;
  updatedAt: string;
}

export interface UserModel {
  role: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  sub: string;
  _id: string;
  surname: string;
  restaurants: any[];
  icon: string;
  updatedAt: string;
}

export type UserEdit = {
  name: string;
  surname: string;
  file: File | null;
};

export type StateModel = 'loaded' | 'loading' | 'error' | 'empty';
