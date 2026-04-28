// __tests__/components/StoryCard.test.tsx
// Component interaction test using React Native Testing Library.
// Verifies that StoryCard renders correctly and fires onPress with
// the correct story object when tapped.

import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { StoryCard } from '../../src/features/articles/StoryCard';
import { HNStory } from '../../src/types';

const mockStory: HNStory = {
  id: 42,
  title: 'Why Rust is eating the world',
  url: 'https://www.rustlang.org/blog/post',
  by: 'ferris',
  score: 312,
  time: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
  type: 'story',
};

describe('StoryCard', () => {
  it('renders the story title', () => {
    const onPress = jest.fn();
    render(<StoryCard story={mockStory} onPress={onPress} />);
    expect(screen.getByText('Why Rust is eating the world')).toBeTruthy();
  });

  it('renders the domain parsed from the URL', () => {
    const onPress = jest.fn();
    render(<StoryCard story={mockStory} onPress={onPress} />);
    expect(screen.getByText('rustlang.org')).toBeTruthy();
  });

  it('renders the story score', () => {
    const onPress = jest.fn();
    render(<StoryCard story={mockStory} onPress={onPress} />);
    expect(screen.getByText('▲ 312')).toBeTruthy();
  });

  it('calls onPress with the story object when tapped', () => {
    const onPress = jest.fn();
    render(<StoryCard story={mockStory} onPress={onPress} />);
    fireEvent.press(screen.getByTestId('story-card-42'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(mockStory);
  });

  it('does not call onPress when not tapped', () => {
    const onPress = jest.fn();
    render(<StoryCard story={mockStory} onPress={onPress} />);
    expect(onPress).not.toHaveBeenCalled();
  });
});
