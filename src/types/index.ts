export interface HNStory {
  id: number;
  title: string;
  url: string;
  by: string;
  score: number;
  time: number;
  type: 'story' | 'comment' | 'ask' | 'show' | 'job' | 'poll';
}

export interface HNRawItem {
  id: number;
  title?: string;
  url?: string;
  by?: string;
  score?: number;
  time?: number;
  type?: string;
}

export type SortOrder = 'score' | 'time';

export interface ArticleListState {
  stories: HNStory[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  sortOrder: SortOrder;
}

export interface BookmarksState {
  bookmarkedIds: Record<number, HNStory>;
}

export type RootStackParamList = {
  ArticleList: undefined;
  ArticleDetail: { story: HNStory };
};

export type RootTabParamList = {
  Feed: undefined;
  Bookmarks: undefined;
};

export type FeedStackParamList = {
  ArticleList: undefined;
  ArticleDetail: { story: HNStory };
};
