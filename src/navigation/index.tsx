// src/navigation/index.tsx

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { ArticleDetailScreen } from '../features/articles/ArticleDetailScreen';
import { ArticleListScreen } from '../features/articles/ArticleListScreen';
import { BookmarksScreen } from '../features/bookmarks/BookmarksScreen';
import { FeedStackParamList, RootTabParamList } from '../types';
import { Icon } from 'react-native-elements';

const Tab = createBottomTabNavigator<RootTabParamList>();
const FeedStack = createNativeStackNavigator<FeedStackParamList>();

function FeedStackNavigator(): React.JSX.Element {
  return (
    <FeedStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#ff6600',
        headerTitleStyle: { fontWeight: '700', color: '#1a1a1a' },
      }}
    >
      <FeedStack.Screen
        name="ArticleList"
        component={ArticleListScreen}
        options={{ title: 'Hacker News' }}
      />
      <FeedStack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: '' }}
      />
    </FeedStack.Navigator>
  );
}

const BookmarksStack = createNativeStackNavigator<FeedStackParamList>();

function BookmarksStackNavigator(): React.JSX.Element {
  return (
    <BookmarksStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#ff6600',
        headerTitleStyle: { fontWeight: '700', color: '#1a1a1a' },
      }}
    >
      <BookmarksStack.Screen
        name="ArticleList"
        component={BookmarksScreen}
        options={{ title: 'Bookmarks' }}
      />
      <BookmarksStack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: '' }}
      />
    </BookmarksStack.Navigator>
  );
}

export function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#ff6600',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: { borderTopColor: '#eee' },
        }}
      >
        <Tab.Screen
          name="Feed"
          component={FeedStackNavigator}
          options={{
            tabBarLabel: 'Feed',
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="newspaper-outline"
                type="ionicon"
                color={color}
                size={size}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Bookmarks"
          component={BookmarksStackNavigator}
          options={{
            tabBarLabel: 'Bookmarks',
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="bookmark-outline"
                type="ionicon"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
