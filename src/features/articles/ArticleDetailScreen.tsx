import InAppBrowser from 'react-native-inappbrowser-reborn';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useLayoutEffect } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBookmarkStore } from '../../store';
import { FeedStackParamList } from '../../types';
import { parseDomain, relativeTime } from '../../utils';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<FeedStackParamList, 'ArticleDetail'>;

const BRAND_COLOR = '#ff6600';

async function openInAppBrowser(url: string): Promise<void> {
  try {
    const isAvailable = await InAppBrowser.isAvailable();

    if (isAvailable) {
      await InAppBrowser.open(url, {
        dismissButtonStyle: 'close',
        preferredBarTintColor: '#ffffff',
        preferredControlTintColor: BRAND_COLOR,
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        showTitle: true,
        toolbarColor: '#ffffff',
        secondaryToolbarColor: '#000000',
        navigationBarColor: '#000000',
        navigationBarDividerColor: '#ffffff',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        animations: {
          startEnter: Platform.OS === 'android' ? 'slide_in_right' : '',
          startExit: Platform.OS === 'android' ? 'slide_out_left' : '',
          endEnter: Platform.OS === 'android' ? 'slide_in_left' : '',
          endExit: Platform.OS === 'android' ? 'slide_out_right' : '',
        },
      });
    } else {
      await Linking.openURL(url);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to open link.';
    Alert.alert('Error', message);
  }
}

export function ArticleDetailScreen({ route, navigation }: Props): React.JSX.Element {
  const { story } = route.params;
  const domain = parseDomain(story.url);

  const isBookmarked = useBookmarkStore(s => s.isBookmarked(story.id));
  const toggleBookmark = useBookmarkStore(s => s.toggleBookmark);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        title: story.title,
        message: `${story.title}\n${story.url}`,
        url: story.url,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Share failed';
      Alert.alert('Share failed', message);
    }
  }, [story]);

  const handleBookmark = useCallback(() => {
    toggleBookmark(story);
  }, [story, toggleBookmark]);

  const handleOpenURL = useCallback(async () => {
    let url = story.url;
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    await openInAppBrowser(url);
  }, [story.url]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>

          <TouchableOpacity
            onPress={handleShare}
            accessibilityLabel="Share article"
            accessibilityRole="button"
            style={styles.headerButton}
            testID="share-button"
          >
            <Icon name="share-social-outline" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBookmark}
            accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            accessibilityRole="button"
            style={styles.headerButton}
            testID="bookmark-button"
          >
            <Icon
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isBookmarked ? '#ff6600' : '#000'}
            />
          </TouchableOpacity>

        </View>
      ),
    });
  }, [navigation, handleShare, handleBookmark, isBookmarked]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{story.title}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>By</Text>
        <Text style={styles.metaValue}>{story.by}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Score</Text>
        <Text style={[styles.metaValue, styles.score]}>▲ {story.score} points</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Posted</Text>
        <Text style={styles.metaValue}>{relativeTime(story.time)}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sourceDomain}>{domain}</Text>

      <TouchableOpacity
        onPress={handleOpenURL}
        accessibilityRole="link"
        accessibilityLabel={`Open article: ${story.url}`}
        testID="article-url"
        activeOpacity={0.7}
      >
        <Text style={styles.url} numberOfLines={3}>
          {story.url}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.readButton}
        onPress={handleOpenURL}
        accessibilityRole="button"
        accessibilityLabel="Read full article"
        testID="read-article-button"
        activeOpacity={0.85}
      >
        <Text style={styles.readButtonText}>Read Article ↗</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 30,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  metaLabel: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
    width: 52,
  },
  metaValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  score: {
    color: '#ff6600',
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e8e8e8',
    marginVertical: 20,
  },
  sourceDomain: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  url: {
    fontSize: 15,
    color: '#0070c9',
    textDecorationLine: 'underline',
    lineHeight: 22,
    marginBottom: 24,
  },
  readButton: {
    backgroundColor: '#ff6600',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  readButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 6,
  },
  headerButtonText: {
    fontSize: 18,
  },
});