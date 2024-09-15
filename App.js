import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CategoriesScreen from "../Lab1_b4/screens/CategoriesScreen";
import MealsScreen from "../Lab1_b4/screens/MealsScreen";
import MealDetailScreen from "../Lab1_b4/screens/MealDetailScreen";
import FavoritesScreen from "../Lab1_b4/screens/FavoritesScreen";
import SettingsScreen from "../Lab1_b4/screens/SettingsScreen";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const CategoriesStackNavigator = () => (
  <Stack.Navigator initialRouteName="Categories">
    <Stack.Screen name="Categories" component={CategoriesScreen} />
    <Stack.Screen name="Meals" component={MealsScreen} />
    <Stack.Screen name="MealDetail" component={MealDetailScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === "Categories") {
          iconName = "list";
        } else if (route.name === "Favorites") {
          iconName = "heart";
        }
        return <FontAwesome name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Categories" component={CategoriesStackNavigator} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
  </Tab.Navigator>
);

const DrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Meals" component={TabNavigator} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
