import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FavoritesScreen from "../screens/FavoritesScreen";
import MealDetailScreen from "../screens/MealDetailScreen";
import MealsScreen from "../screens/MealsScreen";
import SettingsStackNavigator from "../navigators/SettingsStackNavigator";

const Stack = createStackNavigator();

const FavoritesStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="FavoritesScreen"
      component={FavoritesScreen}
      options={{ headerShown: false }}
    />{" "}
    <Stack.Screen
      name="MealsScreen"
      component={MealsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MealDetailScreen"
      options={{ headerShown: false }}
      component={MealDetailScreen}
    />
  </Stack.Navigator>
);

export default FavoritesStackNavigator;
