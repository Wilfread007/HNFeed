import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HNStory } from '../../types';
import { faviconUrl, parseDomain, relativeTime } from '../../utils';
import { Icon } from 'react-native-elements';


function UpvoteTriangle(): React.JSX.Element {
  return <View style={triStyles.shape} />;
}

const triStyles = StyleSheet.create({
  shape: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#cc4e00',
    marginRight: 4,
    marginTop: 1,
  },
});

interface StoryCardProps {
  story: HNStory;
  onPress: (story: HNStory) => void;
}

export const StoryCard = memo(function StoryCard({
  story,
  onPress,
}: StoryCardProps): React.JSX.Element {
  const domain = parseDomain(story.url);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(story)}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={story.title}
      testID={`story-card-${story.id}`}
    >
      <View style={styles.faviconWrapper}>
        <Image
          source={{ uri: faviconUrl(domain) }}
          style={styles.favicon}
          defaultSource={require('../../assets/placeholder.jpg')}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {story.title}
        </Text>

        <View style={styles.meta}>
          <Text style={styles.domain} numberOfLines={1}>
            {domain}
          </Text>

          <View style={styles.dot} />

          <View style={styles.scorePill}>
            <UpvoteTriangle />
            <Text style={styles.scoreText}>{story.score}</Text>
          </View>

          <View style={styles.dot} />

          <Text style={styles.time}>{relativeTime(story.time)}</Text>
        </View>
      </View>

      <View style={styles.chevronWrapper}>
        <Icon name="chevron-right" type='entypo' size={16} color="#c8c8c8" />
      </View>
    </TouchableOpacity>
  );
});

export const STORY_CARD_HEIGHT = 90;

const CHEVRON_ARM = 6;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    minHeight: STORY_CARD_HEIGHT,
  },

  faviconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0f4f8',
    marginRight: 12,
    flexShrink: 0,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  favicon: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },

  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
    lineHeight: 20,
    letterSpacing: -0.1,
  },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  domain: {
    fontSize: 12,
    color: '#8a8a8a',
    fontWeight: '400',
    flexShrink: 1,
    maxWidth: 110,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#d0d0d0',
    flexShrink: 0,
  },

  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f0',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f5c9b3',
  },
  scoreText: {
    fontSize: 12,
    color: '#cc4e00',
    fontWeight: '600',
  },

  time: {
    fontSize: 12,
    color: '#8a8a8a',
    flexShrink: 0,
  },

  chevronWrapper: {
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronTop: {
    width: CHEVRON_ARM,
    height: 1.5,
    backgroundColor: '#c8c8c8',
    borderRadius: 1,
    transform: [{ rotate: '45deg' }, { translateY: 1.5 }],
  },
  chevronBottom: {
    width: CHEVRON_ARM,
    height: 1.5,
    backgroundColor: '#c8c8c8',
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }, { translateY: -1.5 }],
  },
});