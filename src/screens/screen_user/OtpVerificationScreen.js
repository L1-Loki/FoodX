import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function OTP({ route, navigation }) {
  const [otp, setOtp] = useState("");
  const { confirm } = route.params; // Nhận đối tượng xác thực từ navigation

  const handleConfirmOtp = async () => {
    try {
      // Xác thực mã OTP
      await confirm.confirm(otp);
      Alert.alert("Xác thực thành công", "Bạn đã đăng nhập thành công!");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Lỗi xác thực", "Mã OTP không hợp lệ.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập mã OTP</Text>
      <TextInput
        style={styles.otpInput}
        placeholder="Nhập mã OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOtp}>
        <Text style={styles.confirmButtonText}>Xác nhận OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  otpInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: "80%",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 18,
  },
  confirmButton: {
    backgroundColor: "#00c853",
    padding: 15,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
