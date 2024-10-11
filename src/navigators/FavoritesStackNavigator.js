import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FavoritesScreen from "../screens/FavoritesScreen";

const Stack = createStackNavigator();

const FavoritesStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="FavoritesScreen"
      component={FavoritesScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default FavoritesStackNavigator;
