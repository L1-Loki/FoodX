import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FavoritesScreen from "../screens/FavoritesScreen";
import MealDetailScreen from "../screens/MealDetailScreen";
import MealsScreen from "../screens/MealsScreen";

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

const FavoritesStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={screenOptions} // Sử dụng tùy chọn chung cho màn hình này
      />
      <Stack.Screen
        name="MealsScreen"
        component={MealsScreen}
        options={{ title: "Meals List" }} // Tiêu đề cho màn hình Meals
      />
      <Stack.Screen
        name="MealDetailScreen"
        component={MealDetailScreen}
        options={{ title: "Meal Details" }} // Tiêu đề cho màn hình MealDetail
      />
    </Stack.Navigator>
  );
};

export default FavoritesStackNavigator;
