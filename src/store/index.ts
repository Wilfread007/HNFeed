import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { fetchTopStories } from '../api/hackerNews';
import { ArticleListState, BookmarksState, HNStory, SortOrder } from '../types';


interface ArticleActions {
  loadStories: () => Promise<void>;
  refreshStories: () => Promise<void>;
  setSortOrder: (order: SortOrder) => void;
}

type ArticleStore = ArticleListState & ArticleActions;

export const useArticleStore = create<ArticleStore>((set, get) => ({
  stories: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  sortOrder: 'score',

  loadStories: async () => {
    if (get().isLoading || get().stories.length > 0) return;
    set({ isLoading: true, error: null });
    try {
      const stories = await fetchTopStories();
      set({ stories, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      set({ isLoading: false, error: message });
    }
  },

  refreshStories: async () => {
    set({ isRefreshing: true, error: null });
    try {
      const stories = await fetchTopStories();
      set({ stories, isRefreshing: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      set({ isRefreshing: false, error: message });
    }
  },

  setSortOrder: (sortOrder: SortOrder) => set({ sortOrder }),
}));

interface BookmarkActions {
  toggleBookmark: (story: HNStory) => void;
  isBookmarked: (id: number) => boolean;
  removeBookmark: (id: number) => void;
  getBookmarks: () => HNStory[];
}

type BookmarkStore = BookmarksState & BookmarkActions;

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarkedIds: {},

      toggleBookmark: (story: HNStory) => {
        const current = get().bookmarkedIds;
        if (current[story.id]) {
          const { [story.id]: _removed, ...rest } = current;
          set({ bookmarkedIds: rest });
        } else {
          set({ bookmarkedIds: { ...current, [story.id]: story } });
        }
      },

      removeBookmark: (id: number) => {
        const current = get().bookmarkedIds;
        const { [id]: _removed, ...rest } = current;
        set({ bookmarkedIds: rest });
      },

      isBookmarked: (id: number) => Boolean(get().bookmarkedIds[id]),

      getBookmarks: () => Object.values(get().bookmarkedIds),
    }),
    {
      name: 'hn-bookmarks',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
