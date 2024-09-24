import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Import auth từ cấu hình Firebase của bạn

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async () => {
    setError(""); // Clear any previous errors

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Success",
        "Password reset email sent. Please check your inbox."
      );
      navigation.goBack(); // Quay lại màn hình đăng nhập sau khi gửi email
    } catch (err) {
      console.error("Lỗi gửi email đặt lại mật khẩu:", err.code);
      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email format. Please check your email.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        default:
          setError("Failed to send password reset email. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

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

      <Button
        mode="contained"
        style={styles.resetButton}
        onPress={handleForgotPassword}
      >
        Send Reset Email
      </Button>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  resetButton: {
    backgroundColor: "#00c853",
    paddingVertical: 10,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    alignItems: "center",
    marginTop: 15,
  },
  backButtonText: {
    color: "#00c853",
    fontWeight: "bold",
  },
});
