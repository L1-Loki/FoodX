import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import MealDetail from "../screens/MealDetailScreen";
import MealsScreen from "../screens/MealsScreen";
import ReviewForm from "../screens/Vote/ReviewForm";
import UserEditScreen from "../screens/UserEditScreen";
import UserProfile from "../screens/UserProfile";

const Stack = createStackNavigator();

const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="MealDetail" component={MealDetail} />
    <Stack.Screen
      name="MealsScreen"
      component={MealsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="UserEditScreen"
      component={UserEditScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="UserProfile" component={UserProfile} />
    <Stack.Screen name="ReviewForm" component={ReviewForm} />
  </Stack.Navigator>
);

export default HomeStackNavigator;
