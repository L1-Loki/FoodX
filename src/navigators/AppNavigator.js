import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../screens/screen_user/AuthContext";

import DrawerNavigator from "./DrawerNavigator";
import TabNavigator from "./TabNavigator";
import SignUpScreen from "../screens/screen_user/SignUpScreen";
import SignInScreen from "../screens/screen_user/SignInScreen";
import SignInWithPhone from "../screens/screen_user/SignInWithPhone";
import OTPScreen from "../screens/screen_user/OtpVerificationScreen";
import ForgetPass from "../screens/screen_user/ForgetPass";
import Onboarding1 from "../screens/Loading/Onboarding1";
import Onboarding2 from "../screens/Loading/Onboarding2";

const Stack = createStackNavigator();

const onboardingScreens = [
  { name: "Onboarding1", component: Onboarding1 },
  { name: "Onboarding2", component: Onboarding2 },
  // Bạn có thể thêm các màn hình onboarding khác vào đây
];

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
          {/* Render các màn hình onboarding */}
          {onboardingScreens.map((screen) => (
            <Stack.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
              options={{ headerShown: false }}
            />
          ))}
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
