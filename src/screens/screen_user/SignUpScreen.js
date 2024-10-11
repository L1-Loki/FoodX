import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Checkbox } from "react-native-paper";
import { auth, db } from "../../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

export default function SignUpScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(""); // State để lưu lỗi nếu có

  const handleSignUp = async () => {
    try {
      // Đăng ký người dùng với email và password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Gửi email xác nhận
      await sendEmailVerification(user);
      alert("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");

      // Lưu thông tin người dùng vào Firestore, sử dụng email thay vì UID
      await setDoc(doc(db, "users", user.email), {
        fullName,
        phoneNumber,
        email: user.email, // Lưu email của người dùng
      });

      // Đăng xuất người dùng để buộc họ xác thực email trước khi đăng nhập
      await signOut(auth);

      // Điều hướng đến màn hình đăng nhập
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Error during sign up:", error.message);

      // Kiểm tra mã lỗi và hiển thị thông báo tương ứng
      if (error.code === "auth/email-already-in-use") {
        setError("Email đã được sử dụng. Vui lòng sử dụng email khác.");
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new account</Text>
      <TextInput
        label="Phone number"
        mode="outlined"
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        label="Email"
        mode="outlined"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        label="Name"
        mode="outlined"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        label="Password"
        mode="outlined"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.rememberMeContainer}>
        <Checkbox
          status={rememberMe ? "checked" : "unchecked"}
          onPress={() => setRememberMe(!rememberMe)}
        />
        <Text>Remember</Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        mode="contained"
        style={styles.signUpButton}
        onPress={handleSignUp}
      >
        Register
      </Button>
      <View style={styles.footer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.signInText}>Login</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  signUpButton: {
    backgroundColor: "#00c853",
    paddingVertical: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signInText: {
    color: "#00c853",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});
