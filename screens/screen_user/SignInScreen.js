import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Checkbox } from "react-native-paper";
import { auth } from "../../firebaseConfig";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRememberMe, setIsRememberMe] = useState(false);

  const handleSignIn = async () => {
    setError(""); // Xóa lỗi trước khi thử đăng nhập
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Đăng nhập thành công");
      navigation.navigate("Home");
    } catch (err) {
      console.error("Lỗi đăng nhập:", err.code); // In mã lỗi ra console

      // Kiểm tra mã lỗi và hiển thị thông báo tương ứng
      switch (err.code) {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let’s you in</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
      />
      <TextInput
        label="Password"
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

      <Button
        mode="contained"
        style={styles.loginButton}
        onPress={handleSignIn}
      >
        Login
      </Button>

      <Text style={styles.orText}>or</Text>

      <View style={styles.socialButtonsContainer}>
        <IconButton
          icon="facebook"
          size={24}
          onPress={() => console.log("Continue with Facebook")}
        />
        <IconButton
          icon="google"
          size={24}
          onPress={() => console.log("Continue with Google")}
        />
        <IconButton
          icon="apple"
          size={24}
          onPress={() => console.log("Continue with Apple")}
        />
      </View>

      <View style={styles.footer}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignInWithPhone")}
        >
          <Text style={styles.signupText}>Signin with phone number</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 10,
    marginBottom: 20,
  },
  orText: {
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
