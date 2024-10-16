import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";

import { Checkbox } from "react-native-paper";
// import { signInWithGoogle } from "../../API/GoogleSignin"; // Import hàm đăng nhập Google
import { auth } from "../../../firebaseConfig";

// WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [userInfor, setUserInfor] = React.useState(null);
  // const [request, response, promtAsyns] = Google.useAuthRequest({
  //   androidClientId:
  //     "412206916441-lccg0k2nls2k3odj0cm0r38apdppg5fv.apps.googleusercontent.com",
  //   webClientId:
  //     "412206916441-vpqm8doc32a3t47o1esfdqj8d4lcmsfp.apps.googleusercontent.com",
  // });
  const [isRememberMe, setIsRememberMe] = useState(false);

  const handleSignIn = async () => {
    setError(""); // Xóa lỗi trước khi thử đăng nhập
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      // Đăng nhập bằng email và password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Kiểm tra xem email đã được xác thực hay chưa
      if (user.emailVerified) {
        console.log("Đăng nhập thành công và email đã được xác thực");
        navigation.navigate("Home"); // Điều hướng đến màn hình Home nếu email đã xác thực
      } else {
        // Hiển thị thông báo yêu cầu xác minh email
        Alert.alert(
          "Email chưa xác thực",
          "Email của bạn chưa được xác thực. Vui lòng kiểm tra email để xác nhận.",
          [
            {
              text: "OK",
              onPress: async () => {
                // Đăng xuất người dùng và điều hướng về màn hình đăng nhập
                await signOut(auth);
                navigation.navigate("SignIn");
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.code); // In mã lỗi ra console

      // Kiểm tra mã lỗi và hiển thị thông báo tương ứng
      switch (error.code) {
        case "auth/invalid-email":
          setError("Invalid email format. Please check your email.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/too-many-requests":
          setError("Too many login attempts. Please try again later.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }
  };

  // Hàm xử lý đăng nhập bằng Google
  // const handleGoogleSignIn = async () => {
  //   try {
  //     const userCredential = await signInWithGoogle(); // Gọi hàm đăng nhập Google từ API
  //     console.log("Đăng nhập Google thành công:", userCredential.user);
  //     navigation.navigate("Home"); // Điều hướng đến màn hình Home
  //   } catch (error) {
  //     console.error("Lỗi đăng nhập Google:", error);
  //     setError("Failed to sign in with Google. Please try again.");
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let’s you in</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Email"
        style={styles.input}
        keyboardType="email-address"
        testID="email-input"
        autoCapitalize="none"
        mode="outlined"
      />
      <TextInput
        label="Password"
        testID="password-input"
        accessibilityLabel="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        mode="outlined"
      />
      <View style={styles.rememberMeContainer}>
        <Checkbox
          status={isRememberMe ? "checked" : "unchecked"}
          onPress={() => setIsRememberMe(!isRememberMe)}
          color="#28a745"
        />
        <Text style={styles.rememberMeText}>Remember me</Text>

        <View style={styles.fg_pass}>
          <TouchableOpacity onPress={() => navigation.navigate("ForgetPass")}>
            <Text style={styles.signupText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        mode="contained"
        style={styles.loginButton}
        onPress={handleSignIn}
      >
        <Text style={styles.submitButtonText}>Login</Text>
      </TouchableOpacity>

      {/* <Text style={styles.orText}>or</Text>

      <View style={styles.socialButtonsContainer}>
        <IconButton
          icon="facebook"
          size={24}
          onPress={() => console.log("Continue with Facebook")}
        />
        <IconButton
          icon="google"
          size={24}
          //onPress={promtAsyns} // Gọi hàm đăng nhập Google khi nhấn nút
          onPress={() => console.log("Continue with Google")}
        />
        <IconButton
          icon="apple"
          size={24}
          onPress={() => console.log("Continue with Apple")}
        />
      </View> */}

      <View style={styles.footer}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.footer}>
        <TouchableOpacity>
          <Text
            style={styles.signupText}
            onPress={() => navigation.navigate("SignInWithPhone")}
          >
            Signin with phone number
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 50,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: "#00c853",
    padding: 15,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  errorText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#999",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#00c853",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  fg_pass: {
    marginLeft: "auto",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  rememberMeText: {
    marginLeft: 10,
  },
});
