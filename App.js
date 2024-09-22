import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./screens/screen_user/AuthContext";
import AppNavigator from "./navigators/AppNavigator";
import SignInWithPhone from "./screens/screen_user/SignInWithPhone";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
