import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [strengthColor, setStrengthColor] = useState("gray"); // Màu mặc định

  const checkPasswordStrength = (password) => {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Mật khẩu mạnh
    const mediumPassword = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Mật khẩu trung bình

    if (strongPassword.test(password)) {
      setPasswordStrength("Mạnh");
      setStrengthColor("green"); // Màu xanh cho mật khẩu mạnh
    } else if (mediumPassword.test(password)) {
      setPasswordStrength("Trung bình.");
      setStrengthColor("orange"); // Màu vàng cho mật khẩu trung bình
    } else {
      setPasswordStrength(
        "Mật khẩu yếu. Vui lòng sử dụng ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
      setStrengthColor("red"); // Màu đỏ cho mật khẩu yếu
    }
  };

  const handleSignUp = async () => {
    try {
      if (
        !email ||
        !fullName ||
        !phoneNumber ||
        !password ||
        !confirmPassword
      ) {
        setError("Vui lòng điền đầy đủ thông tin.");
        return;
      }
      // So sánh mật khẩu và mật khẩu xác nhận
      if (password !== confirmPassword) {
        setError("Mật khẩu và mật khẩu xác nhận không khớp.");
        return;
      }
      // Kiểm tra độ mạnh của mật khẩu
      if (passwordStrength !== "Mạnh") {
        setError("Vui lòng chọn mật khẩu mạnh để tiếp tục.");
        return;
      }

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

      // Lưu thông tin người dùng vào Firestore
      await setDoc(doc(db, "users", user.email), {
        fullName,
        phoneNumber,
        email: user.email,
      });

      // Đăng xuất người dùng
      await signOut(auth);

      // Điều hướng đến màn hình đăng nhập
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Lỗi trong quá trình đăng ký:", error.message);

      // Kiểm tra mã lỗi và hiển thị thông báo tương ứng
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Email đã được sử dụng. Vui lòng sử dụng email khác.");
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register account</Text>
      <TextInput
        label="Phone"
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
        label="Full Name"
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
        onChangeText={(text) => {
          setPassword(text);
          checkPasswordStrength(text); // Kiểm tra độ mạnh mật khẩu
        }}
        secureTextEntry
      />
      <TextInput
        label="Confirm password"
        mode="outlined"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View style={styles.strengthBarContainer}>
        <View
          style={[styles.strengthBar, { backgroundColor: strengthColor }]}
        />
      </View>
      <Text style={styles.passwordStrength}>{passwordStrength}</Text>
      <View style={styles.rememberMeContainer}>
        <Checkbox
          status={rememberMe ? "checked" : "unchecked"}
          onPress={() => setRememberMe(!rememberMe)}
        />
        <Text>Remember me</Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity
        mode="contained"
        style={styles.signUpButton}
        onPress={handleSignUp}
      >
        <Text style={styles.submitButtonText}>Resgister</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text>You already have an account? </Text>
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
  strengthBarContainer: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "lightgray",
    overflow: "hidden",
    marginBottom: 10,
  },
  strengthBar: {
    height: "100%",
    width: "100%",
  },
  passwordStrength: {
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  signUpButton: {
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
