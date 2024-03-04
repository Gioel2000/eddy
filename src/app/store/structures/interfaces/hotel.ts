export interface HotelTOModel {
  alarms: any[];
  _id: string;
  categories: any[];
  website: string;
  city: string;
  telephone: string;
  email: string;
  zipCode: string;
  address: string;
  name: string;
  license: License;
  hotelInfos: any[];
  services: Service[];
  competitors: Competitor[];
  admins: Admin[];
  graphData: DataGraphModel[];
  widgetInfos: string[];
  diamondsNeoId: string;
}

export interface License {
  _id: string;
  activedOn: string;
  active: boolean;
  key: string;
  createdOn: string;
}

export interface Service {
  _id: string;
  hotelName: string;
  source: string;
  api: Api;
}

export interface Api {
  url: string;
  pageName: string;
  cn: string;
}

export interface Competitor {
  _id: string;
  name: string;
  source: string;
  api: Api;
}

export interface Admin {
  _id: string;
  name: string;
  surname: string;
  email: string;
  icon: string;
}

export interface DataGraphModel {
  date: Date;
  average: number;
}

export interface HotelModel extends HotelTOModel {
  selected: boolean;
  show: boolean;
}

export type CheckHotel = { id: HotelModel['_id']; selected: boolean };
