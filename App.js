import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/screens/screen_user/AuthContext";
import { ThemeProvider } from "./src/Theme/ThemeContext"; // Import ThemeProvider
import AppNavigator from "./src/navigators/AppNavigator";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}
