import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CategoriesScreen from "../screens/CategoriesScreen";
import MealsScreen from "../screens/MealsScreen";
import MealDetailScreen from "../screens/MealDetailScreen";

const Stack = createStackNavigator();

const CategoriesStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CategoriesScreen"
      component={CategoriesScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Meals" component={MealsScreen} />
    <Stack.Screen name="MealDetail" component={MealDetailScreen} />
  </Stack.Navigator>
);

export default CategoriesStackNavigator;
