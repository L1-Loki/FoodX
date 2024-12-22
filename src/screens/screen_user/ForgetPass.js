import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig"; // Import auth và Firestore từ cấu hình Firebase của bạn
import { collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore methods

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
      // Truy vấn Firestore để kiểm tra email
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Nếu không tìm thấy email trong Firestore
        setError("No account found with this email.");
      } else {
        // Nếu email tồn tại, gửi email đặt lại mật khẩu
        await sendPasswordResetEmail(auth, email);
        Alert.alert(
          "Success",
          "Password reset email sent. Please check your inbox."
        );
        navigation.goBack(); // Quay lại màn hình đăng nhập sau khi gửi email
      }
    } catch (err) {
      console.error("Lỗi gửi email đặt lại mật khẩu:", err.code);
      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email format. Please check your email.");
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

      <TouchableOpacity
        mode="contained"
        style={styles.resetButton}
        onPress={handleForgotPassword}
      >
        <Text style={styles.submitButtonText}>Send</Text>
      </TouchableOpacity>

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
