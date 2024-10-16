import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CategoriesScreen from "../screens/CategoriesScreen";
import MealsScreen from "../screens/MealsScreen";
import MealDetailScreen from "../screens/MealDetailScreen";
import AddMeal from "../../src/Database/Meals/AddMeal";
import UpdateMeal from "../../src/Database/Meals/UpdateMeal";
import ReviewForm from "../../src/screens/Vote/ReviewForm";

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

const CategoriesStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CategoriesScreen"
        component={CategoriesScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name="Meals"
        component={MealsScreen}
        options={{ title: "Meals List" }} // Tiêu đề cho màn hình Meals
      />
      <Stack.Screen
        name="MealDetail"
        component={MealDetailScreen}
        options={{ title: "Meal Details" }} // Tiêu đề cho màn hình MealDetail
      />
      <Stack.Screen
        name="UpdateMeal"
        component={UpdateMeal}
        options={screenOptions}
      />
      <Stack.Screen
        name="AddMeal"
        component={AddMeal}
        options={screenOptions}
      />
      <Stack.Screen
        name="ReviewForm"
        component={ReviewForm}
        options={{ title: "Rating" }} // Tiêu đề cho màn hình ReviewForm
      />
    </Stack.Navigator>
  );
};

export default CategoriesStackNavigator;
