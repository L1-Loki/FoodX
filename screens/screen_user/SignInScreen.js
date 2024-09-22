import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Đăng nhập thành công");
      navigation.navigate("Home");
    } catch (err) {
      console.error("Lỗi đăng nhập:", err); // In lỗi ra console
      setError(err.message);
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
});
