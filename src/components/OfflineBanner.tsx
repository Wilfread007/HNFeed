import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import Icon from 'react-native-vector-icons/Ionicons';

export function OfflineBanner(): React.JSX.Element | null {
  const { isConnected } = useNetworkStatus();
  const translateY = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isConnected ? -50 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected, translateY]);

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="cloud-offline-outline" size={18} color="#ef4444" />
        <Text style={[styles.text, { marginLeft: 6 }]}>
          No internet connection
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 999,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
