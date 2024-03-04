export interface Languages {
  locale: string;
  name: string;
  flag: string;
  selected: boolean;
}

export type SetLanguage = Languages['locale'];
