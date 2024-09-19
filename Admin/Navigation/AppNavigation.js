// AppNavigator.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SettingsScreen from "../../screens/SettingsScreen"; // Đảm bảo đường dẫn chính xác
import AdminScreenMeal from "../Database/db_Meals"; // Đảm bảo đường dẫn chính xác

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack navigator containing AdminScreenMeal
const AdminStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AdminScreenMeal" component={AdminScreenMeal} />
    </Stack.Navigator>
  );
};

// Drawer navigator with Settings and AdminStack
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Settings" component={AdminStackNavigator} />
    </Drawer.Navigator>
  );
}