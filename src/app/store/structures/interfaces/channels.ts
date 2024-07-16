export interface ChannelsTOModel {
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
  channel: ChannelsTOModel | null;
  address: string | null;
  checked: boolean;
}
