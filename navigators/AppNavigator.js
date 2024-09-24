import React from "react";
import { View, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../screens/screen_user/AuthContext";

import DrawerNavigator from "./DrawerNavigator";
import SignUpScreen from "../screens/screen_user/SignUpScreen";
import SignInScreen from "../screens/screen_user/SignInScreen";
import SignInWithPhone from "../screens/screen_user/SignInWithPhone";
import OTPScreen from "../screens/screen_user/OtpVerificationScreen";
import ForgetPass from "../screens/screen_user/ForgetPass";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00c853" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen
          name="Home"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OTP"
            component={OTPScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignInWithPhone"
            component={SignInWithPhone}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgetPass"
            component={ForgetPass}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
