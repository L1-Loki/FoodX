import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "../screens/SettingsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import MealDetailScreen from "../screens/MealDetailScreen"; // Nếu không sử dụng MealDetailScreen, bạn có thể xóa dòng này.

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false, // Tùy chọn cho các màn hình không hiển thị header
};

const SettingsStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={{ title: "Settings", headerShown: false }} // Tiêu đề cho màn hình Settings
    />
    <Stack.Screen
      name="FavoritesScreen"
      component={FavoritesScreen}
      options={{ title: "Favorites" }} // Tiêu đề cho màn hình Favorites
    />
    {/* 
    Nếu bạn cần sử dụng MealDetailScreen, hãy thêm nó vào đây với tiêu đề
    <Stack.Screen
      name="MealDetailScreen"
      component={MealDetailScreen}
      options={{ title: "Meal Details" }} // Tiêu đề cho màn hình MealDetail
    />
    */}
  </Stack.Navigator>
);

export default SettingsStackNavigator;
