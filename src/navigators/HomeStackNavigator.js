import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import MealDetail from "../screens/MealDetailScreen";
import MealsScreen from "../screens/MealsScreen";
import ReviewForm from "../screens/Vote/ReviewForm";
import UserEditScreen from "../screens/UserEditScreen";
import AddMeal from "../Database/Meals/AddMeal";
import UpdateMeal from "../Database/Meals/UpdateMeal";
import UserProfile from "../screens/UserProfile";
import Notification from "../screens/Notification";

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={screenOptions} // Sử dụng tùy chọn chung cho màn hình này
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={screenOptions}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ title: "User Profile" }} // Tiêu đề cho màn hình UserProfile
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={screenOptions}
      />

      <Stack.Screen
        name="UserEditScreen"
        component={UserEditScreen}
        options={{ title: "Edit Profile" }} // Tiêu đề cho màn hình UserEdit
      />
      <Stack.Screen
        name="MealsScreen"
        component={MealsScreen}
        options={{ title: "Meals List" }} // Tiêu đề cho màn hình Meals
      />
      <Stack.Screen
        name="MealDetail"
        component={MealDetail}
        options={{ title: "Meal Details" }} // Tiêu đề cho màn hình MealDetail
      />
      <Stack.Screen
        name="ReviewForm"
        component={ReviewForm}
        options={{ title: "Submit Review" }} // Tiêu đề cho màn hình ReviewForm
      />
      <Stack.Screen
        name="AddMeal"
        component={AddMeal}
        options={screenOptions} // Sử dụng tùy chọn chung cho màn hình này
      />
      <Stack.Screen
        name="UpdateMeal"
        component={UpdateMeal}
        options={screenOptions} // Sử dụng tùy chọn chung cho màn hình này
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
