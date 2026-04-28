import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { OfflineBanner } from '../../components/OfflineBanner';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { useDebounce } from '../../hooks/useDebounce';
import { useArticleStore } from '../../store';
import { HNStory, SortOrder } from '../../types';
import { FeedStackParamList } from '../../types';
import { SortToggle } from './SortToggle';
import { STORY_CARD_HEIGHT, StoryCard } from './StoryCard';

type Props = NativeStackScreenProps<FeedStackParamList, 'ArticleList'>;

export function ArticleListScreen({ navigation }: Props): React.JSX.Element {
  const stories = useArticleStore(s => s.stories);
  const isLoading = useArticleStore(s => s.isLoading);
  const isRefreshing = useArticleStore(s => s.isRefreshing);
  const error = useArticleStore(s => s.error);
  const sortOrder = useArticleStore(s => s.sortOrder);
  const loadStories = useArticleStore(s => s.loadStories);
  const refreshStories = useArticleStore(s => s.refreshStories);
  const setSortOrder = useArticleStore(s => s.setSortOrder);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  const listRef = useRef<FlatList<HNStory>>(null);
  const scrollOffsetRef = useRef(0);

  React.useEffect(() => {
    loadStories();
  }, [loadStories]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (scrollOffsetRef.current > 0) {
        listRef.current?.scrollToOffset({
          offset: scrollOffsetRef.current,
          animated: false,
        });
      }
    });
    return unsubscribe;
  }, [navigation]);

  const displayedStories = useMemo(() => {
    let filtered = stories;

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      filtered = stories.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.by.toLowerCase().includes(q),
      );
    }

    return [...filtered].sort((a, b) =>
      sortOrder === 'score' ? b.score - a.score : b.time - a.time,
    );
  }, [stories, sortOrder, debouncedQuery]);

  const handlePress = useCallback(
    (story: HNStory) => {
      navigation.navigate('ArticleDetail', { story });
    },
    [navigation],
  );

  const handleSortChange = useCallback(
    (order: SortOrder) => setSortOrder(order),
    [setSortOrder],
  );

  const keyExtractor = useCallback((item: HNStory) => String(item.id), []);

  const getItemLayout = useCallback(
    (_: ArrayLike<HNStory> | null | undefined, index: number) => ({
      length: STORY_CARD_HEIGHT,
      offset: STORY_CARD_HEIGHT * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<HNStory>) => (
      <StoryCard story={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  const ListHeader = useMemo(
    () => (
      <View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search stories..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          accessibilityLabel="Search stories"
          testID="search-input"
        />
        <SortToggle current={sortOrder} onChange={handleSortChange} />
      </View>
    ),
    [sortOrder, handleSortChange, searchQuery],
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <OfflineBanner />
        <SkeletonLoader />
      </View>
    );
  }

  if (error && stories.length === 0) {
    return (
      <View style={styles.container}>
        <OfflineBanner />
        <ErrorState message={error} onRetry={loadStories} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OfflineBanner />
      <FlatList
        ref={listRef}
        data={displayedStories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyState
            title={debouncedQuery ? 'No results' : 'Nothing to show'}
            subtitle={
              debouncedQuery
                ? `No stories match "${debouncedQuery}".`
                : 'Pull down to refresh.'
            }
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshStories}
            tintColor="#ff6600"
            colors={['#ff6600']}
          />
        }
        onScroll={e => {
          scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        contentContainerStyle={
          displayedStories.length === 0 ? styles.emptyContainer : undefined
        }
        windowSize={Platform.OS === 'android' ? 5 : 10}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInput: {
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    fontSize: 15,
    color: '#1a1a1a',
  },
  emptyContainer: {
    flex: 1,
  },
});
