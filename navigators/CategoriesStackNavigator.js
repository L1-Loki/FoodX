import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CategoriesScreen from "../screens/CategoriesScreen";
import MealsScreen from "../screens/MealsScreen";
import MealDetailScreen from "../screens/MealDetailScreen";
import AddMeal from "../Database/Meals/AddMeal";
import UpdateMeal from "../Database/Meals/UpdateMeal";
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
    <Stack.Screen
      name="UpdateMeal"
      component={UpdateMeal}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddMeal"
      component={AddMeal}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default CategoriesStackNavigator;
