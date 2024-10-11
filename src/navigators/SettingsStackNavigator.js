import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "../screens/SettingsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

const Stack = createStackNavigator();

const SettingsStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="FavoritesScreen"
      component={FavoritesScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default SettingsStackNavigator;
