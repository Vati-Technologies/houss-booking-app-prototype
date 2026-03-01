import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Theme } from '../../constants/Theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.primary.default,
        tabBarInactiveTintColor: Theme.colors.text.muted,
        tabBarStyle: {
          backgroundColor: Theme.colors.background.card,
          borderTopColor: Theme.colors.border,
          elevation: 0,
          shadowOpacity: 0,
          height: 80,
          paddingBottom: 25,
        },
        tabBarLabelStyle: {
          ...Theme.typography.caption,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <Feather name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="maintenance/index"
        options={{
          title: 'Maintenance',
          tabBarIcon: ({ color }) => <Feather name="tool" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="security"
        options={{
          title: 'Security',
          tabBarIcon: ({ color }) => <Feather name="shield" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
