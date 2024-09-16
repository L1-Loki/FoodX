// TabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import HomeStackNavigator from "./HomeStackNavigator";
import CategoriesStackNavigator from "./CategoriesStackNavigator";
import FavoritesStackNavigator from "./FavoritesStackNavigator";
import SettingsStackNavigator from "./SettingsStackNavigator";

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === "Home") {
          iconName = "home";
        } else if (route.name === "Categories") {
          iconName = "th-list";
        } else if (route.name === "Favorites") {
          iconName = "heart";
        } else if (route.name === "Settings") {
          iconName = "gear";
        }
        return <FontAwesome name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeStackNavigator}
      options={{ title: "Home", headerShown: false }} 
    />
    <Tab.Screen
      name="Categories"
      component={CategoriesStackNavigator}
      options={{ title: "Categories", headerShown: false }} 
    />
  </Tab.Navigator>
);

export default TabNavigator;
