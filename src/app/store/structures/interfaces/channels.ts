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
  latitude: number;
  longitude: number;
  address: string | null;
}

export interface ChannelsModel {
  key: 'google' | 'tripadvisor' | 'the_fork';
  name: string;
  channel: ChannelsTOModel | null;
  address: string | null;
  checked: boolean;
}
