// DrawerNavigator.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import FavoritesStackNavigator from "./FavoritesStackNavigator";
import SettingsStackNavigator from "./SettingsStackNavigator";
import HomeStackNavigator from "./HomeStackNavigator";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={({ route }) => ({
      drawerIcon: ({ color, size }) => {
        let iconName;
        if (route.name === "Main") {
          iconName = "home";
        } else if (route.name === "Favorites") {
          iconName = "heart";
        } else if (route.name === "Settings") {
          iconName = "cog";
        }
        return <FontAwesome name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Drawer.Screen
      name="Main"
      component={TabNavigator}
      options={{ headerShown: false, title: "Home" }}
    />
    <Drawer.Screen name="Favorites" component={FavoritesStackNavigator} />
  </Drawer.Navigator>
);

export default DrawerNavigator;
