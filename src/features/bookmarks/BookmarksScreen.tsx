import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { useBookmarkStore } from '../../store';
import { FeedStackParamList, HNStory } from '../../types';
import { faviconUrl, parseDomain, relativeTime } from '../../utils';
import { Image } from 'react-native';

export function BookmarksScreen(): React.JSX.Element {
  const bookmarks = useBookmarkStore(s => s.getBookmarks());
  const removeBookmark = useBookmarkStore(s => s.removeBookmark);
  const navigation = useNavigation<NativeStackNavigationProp<FeedStackParamList>>();

  const keyExtractor = useCallback((item: HNStory) => String(item.id), []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<HNStory>) => {
      const domain = parseDomain(item.url);
      return (
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.itemContent}
            onPress={() => navigation.navigate('ArticleDetail', { story: item })}
            accessibilityRole="button"
            accessibilityLabel={item.title}
          >
            <Image
              source={{ uri: faviconUrl(domain) }}
              style={styles.favicon}
              defaultSource={require('../../assets/placeholder.jpg')}
            />
            <View style={styles.textBlock}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.meta}>{domain} · ▲ {item.score} · {relativeTime(item.time)}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeBookmark(item.id)}
            accessibilityRole="button"
            accessibilityLabel="Remove bookmark"
            testID={`remove-bookmark-${item.id}`}
          >
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      );
    },
    [navigation, removeBookmark],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            title="No bookmarks yet"
            subtitle="Tap the bookmark icon on any article to save it here."
          />
        }
        contentContainerStyle={bookmarks.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8e8e8',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  favicon: {
    width: 28,
    height: 28,
    borderRadius: 5,
    marginRight: 12,
    marginTop: 2,
    backgroundColor: '#f0f0f0',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 20,
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#888',
  },
  removeButton: {
    padding: 16,
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 16,
    color: '#999',
  },
});
