import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../screens/screen_user/AuthContext";

import DrawerNavigator from "./DrawerNavigator";
import TabNavigator from "./TabNavigator";
import SignUpScreen from "../screens/screen_user/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import SignInScreen from "../screens/screen_user/SignInScreen";
import SignInWithPhone from "../screens/screen_user/SignInWithPhone";
import OTPScreen from "../screens/screen_user/OtpVerificationScreen";
import ForgetPass from "../screens/screen_user/ForgetPass";
import Onboarding1 from "../screens/Loading/Onboarding1";
import Onboarding2 from "../screens/Loading/Onboarding2";
import Onboarding3 from "../screens/Loading/Onboarding3";
import Onboarding4 from "../screens/Loading/Onboarding4";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  // Hiển thị ActivityIndicator trong khi loading
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
        // Khi người dùng đã đăng nhập
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          {/* Các màn hình onboarding */}
          <Stack.Screen
            name="Onboarding1"
            component={Onboarding1}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Onboarding2"
            component={Onboarding2}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="Onboarding3"
            component={Onboarding3}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Onboarding4"
            component={Onboarding4}
            options={{ headerShown: false }}
          /> */}
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
