export enum WEBSITE_FOCUS {
  DAILY_RENT = 'DAILY_RENT',
  RENT = 'RENT',
  SELLING = 'SELLING',
  ALL = 'ALL',
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteFocusResponse {
  websiteFocus: WEBSITE_FOCUS;
}

export interface SettingsState {
  websiteFocus: WEBSITE_FOCUS | null;
  isLoading: boolean;
  error: string | null;
} 