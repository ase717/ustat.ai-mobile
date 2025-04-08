import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';
import AccountSubscriptionScreen from '../screens/AccountSubscriptionScreen';
import colors from '../theme/colors';

// Import calculation screens
import InfazScreen from '../screens/calculations/InfazScreen';
import VekaletUcretiScreen from '../screens/calculations/VekaletUcretiScreen';
import HarcGiderScreen from '../screens/calculations/HarcGiderScreen';
import MaasScreen from '../screens/calculations/MaasScreen';
import IscilikAlacaklariScreen from '../screens/calculations/IscilikAlacaklariScreen';
import IsKazasiScreen from '../screens/calculations/IsKazasiScreen';
import TrafikKazasiScreen from '../screens/calculations/TrafikKazasiScreen';

// Placeholder components for the new screens
const SearchScreen = (props) => <DashboardScreen {...props} />; // Pass navigation props
const ProjectsScreen = (props) => <DashboardScreen {...props} />; // Pass navigation props
const CalculationsScreen = (props) => <DashboardScreen {...props} />; // Pass navigation props
const PetitionsScreen = (props) => <DashboardScreen {...props} />; // Pass navigation props
const ContractsScreen = (props) => <DashboardScreen {...props} />; // Pass navigation props

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create separate stack navigators for each tab
const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SearchMain" component={DashboardScreen} />
    <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
    <Stack.Screen name="AccountSubscription" component={AccountSubscriptionScreen} />
  </Stack.Navigator>
);

const ProjectsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProjectsMain" component={DashboardScreen} />
    <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
    <Stack.Screen name="AccountSubscription" component={AccountSubscriptionScreen} />
  </Stack.Navigator>
);

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardMain" component={DashboardScreen} />
    <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
    <Stack.Screen name="AccountSubscription" component={AccountSubscriptionScreen} />
    
    {/* Calculation Screens */}
    <Stack.Screen name="InfazScreen" component={InfazScreen} />
    <Stack.Screen name="VekaletUcretiScreen" component={VekaletUcretiScreen} />
    <Stack.Screen name="HarcGiderScreen" component={HarcGiderScreen} />
    <Stack.Screen name="MaasScreen" component={MaasScreen} />
    <Stack.Screen name="IscilikAlacaklariScreen" component={IscilikAlacaklariScreen} />
    <Stack.Screen name="IsKazasiScreen" component={IsKazasiScreen} />
    <Stack.Screen name="TrafikKazasiScreen" component={TrafikKazasiScreen} />
  </Stack.Navigator>
);

const PetitionsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PetitionsMain" component={DashboardScreen} />
    <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
    <Stack.Screen name="AccountSubscription" component={AccountSubscriptionScreen} />
  </Stack.Navigator>
);

const ContractsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ContractsMain" component={DashboardScreen} />
    <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
    <Stack.Screen name="AccountSubscription" component={AccountSubscriptionScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Projects') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Petitions') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Contracts') {
            iconName = focused ? 'document' : 'document-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.grey[600],
        headerShown: false,
        tabBarLabel: ({ focused, color }) => {
          let label = '';
          
          if (route.name === 'Search') {
            label = 'Arama';
          } else if (route.name === 'Projects') {
            label = 'Projeler';
          } else if (route.name === 'Dashboard') {
            label = 'Hesaplama';
          } else if (route.name === 'Petitions') {
            label = 'Dilekçeler';
          } else if (route.name === 'Contracts') {
            label = 'Sözleşmeler';
          }
          
          return <Text style={{ color, fontSize: 11, textAlign: 'center', marginBottom: 2 }}>{label}</Text>;
        },
        tabBarStyle: {
          backgroundColor: 'rgba(10, 5, 20, 0.95)',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          height: 73,
          paddingBottom: 6,
          paddingTop: 4,
          paddingHorizontal: 10,
        },
      })}
    >
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Petitions" component={PetitionsScreen} />
      <Tab.Screen name="Contracts" component={ContractsScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator; 