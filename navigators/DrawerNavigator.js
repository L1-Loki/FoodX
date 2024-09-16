// DrawerNavigator.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import FavoritesStackNavigator from "./FavoritesStackNavigator";
import SettingsStackNavigator from "./SettingsStackNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen
      name="Main"
      component={TabNavigator}
      options={{ headerShown: false, title: "Home" }}
    />
    <Drawer.Screen name="Favorites" component={FavoritesStackNavigator} />
    <Drawer.Screen name="Settings" component={SettingsStackNavigator} />
  </Drawer.Navigator>
);

export default DrawerNavigator;
