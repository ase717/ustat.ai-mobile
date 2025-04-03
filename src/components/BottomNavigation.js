import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation as PaperBottomNavigation } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const BottomNavigation = ({ state, descriptors, navigation }) => {
  return (
    <PaperBottomNavigation
      navigationState={state}
      onIndexChange={(index) => {
        const selectedRoute = state.routes[index];
        
        navigation.dispatch(
          CommonActions.navigate({
            name: selectedRoute.name,
            merge: true,
          })
        );
      }}
      renderScene={() => null} // We don't need to render any scene here
      barStyle={styles.bar}
      activeColor={colors.primary.main}
      inactiveColor={colors.grey[600]}
      renderIcon={({ route, focused, color }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Dashboard') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'Blog') {
          iconName = focused ? 'newspaper' : 'newspaper-outline';
        } else if (route.name === 'Packages') {
          iconName = focused ? 'cube' : 'cube-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={24} color={color} />;
      }}
      renderLabel={({ route, focused, color }) => {
        return null; // Hide labels to save space
      }}
    />
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.common.white,
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
    height: 60,
    justifyContent: 'center',
  },
});

export default BottomNavigation;