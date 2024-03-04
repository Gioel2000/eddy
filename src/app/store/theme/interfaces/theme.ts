export interface Theme {
  isThemeSystem: boolean;
  theme: 'light' | 'dark';
}

export type SetTheme = 'light' | 'dark' | 'system';
