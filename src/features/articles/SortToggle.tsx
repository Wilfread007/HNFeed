import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SortOrder } from '../../types';
import { Icon } from 'react-native-elements';

interface SortToggleProps {
  current: SortOrder;
  onChange: (order: SortOrder) => void;
}

export const SortToggle = memo(function SortToggle({
  current,
  onChange,
}: SortToggleProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, current === 'score' && styles.active]}
        onPress={() => onChange('score')}
        accessibilityRole="button"
        accessibilityState={{ selected: current === 'score' }}
        testID="sort-score"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="caretup" type='antdesign' size={14} style={{ top: 1 }} color={current === 'score' ? '#ff6600' : '#888'} />
          <Text style={[styles.label, current === 'score' && styles.activeLabel]}>
            Score
          </Text>
        </View>

      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, current === 'time' && styles.active]}
        onPress={() => onChange('time')}
        accessibilityRole="button"
        accessibilityState={{ selected: current === 'time' }}
        testID="sort-time"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="schedule" size={16} color={current === 'time' ? '#ff6600' : '#888'} />
          <Text
            style={[
              styles.label,
              current === 'time' && styles.activeLabel,
              { marginLeft: 4 },
            ]}
          >
            Recent
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 3,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  active: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#888',
  },
  activeLabel: {
    color: '#ff6600',
    fontWeight: '700',
  },
});
