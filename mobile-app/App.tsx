import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import DashboardScreen from './src/screens/DashboardScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#1a1a1a" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = focused ? 'home' : 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#10B981',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            backgroundColor: '#1F2937',
            borderTopColor: '#374151',
          },
          headerStyle: {
            backgroundColor: '#1F2937',
          },
          headerTintColor: '#FFFFFF',
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}