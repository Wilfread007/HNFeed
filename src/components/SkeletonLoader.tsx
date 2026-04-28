import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const SKELETON_ITEM_HEIGHT = 90;

function SkeletonItem(): React.JSX.Element {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.item, { opacity }]}>
      <View style={styles.favicon} />
      <View style={styles.content}>
        <View style={styles.titleLong} />
        <View style={styles.titleShort} />
        <View style={styles.meta} />
      </View>
    </Animated.View>
  );
}

export function SkeletonLoader(): React.JSX.Element {
  return (
    <View testID="skeleton-loader">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    height: SKELETON_ITEM_HEIGHT,
    alignItems: 'center',
  },
  favicon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#d0d0d0',
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  titleLong: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#d0d0d0',
    width: '90%',
  },
  titleShort: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#d0d0d0',
    width: '60%',
  },
  meta: {
    height: 11,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    width: '40%',
  },
});
