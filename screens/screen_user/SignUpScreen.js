import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button, Checkbox } from "react-native-paper";
import {  fb_auth,  db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUpScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState(""); // Thêm password cho việc đăng ký
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignUp = async () => {
    // if (!email || !password || !fullName || !phoneNumber) {
    //   alert("Vui lòng điền đầy đủ thông tin.");
    //   return;
    // }
    try {
      // Đăng ký người dùng với email và password
      const userCredential = await createUserWithEmailAndPassword(
        fb_auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User created:", user);
      // Lưu thông tin người dùng vào Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        phoneNumber,
        email,
      });

      alert("Đăng ký thành công!");
      navigation.navigate("Home"); 
    } catch (error) {
      console.error("Error during sign up:", error.message);
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo tài khoản mới</Text>

      <TextInput
        label="Số điện thoại"
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
        label="Họ và tên"
        mode="outlined"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        label="Mật khẩu"
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
        <Text>Ghi nhớ đăng nhập</Text>
      </View>

      <Button
        mode="contained"
        style={styles.signUpButton}
        onPress={handleSignUp} // Thay đổi sự kiện khi nhấn nút để đăng ký
      >
        Đăng ký
      </Button>

      <View style={styles.footer}>
        <Text>Bạn đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.signInText}>Đăng nhập</Text>
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
});
