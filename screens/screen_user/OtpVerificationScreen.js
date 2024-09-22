import React, { useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";

export default function OtpVerificationScreen() {
  const [otp, setOtp] = useState("");

  // Tạo ref cho các ô nhập OTP
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Hàm xử lý khi người dùng nhập hoặc xóa ký tự
  const handleChangeText = (text, index) => {
    const newOtp = otp.split("");
    newOtp[index] = text;
    setOtp(newOtp.join(""));

    // Chuyển focus sang ô tiếp theo nếu có ký tự
    if (text && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
    // Chuyển focus về ô trước đó nếu ký tự bị xóa
    else if (!text && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Code has been sent to +1 111******99</Text>

      <View style={styles.otpContainer}>
        {inputRefs.map((ref, index) => (
          <TextInput
            key={index}
            mode="outlined"
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={otp[index] || ""}
            onChangeText={(text) => handleChangeText(text, index)}
            ref={ref}
            // Chuyển focus vào ô đầu tiên khi người dùng bắt đầu nhập
            onFocus={() => index === 0 && ref.current.focus()}
          />
        ))}
      </View>

      <Text style={styles.resendText}>Resend code in 55s</Text>

      <Button mode="contained" style={styles.verifyButton}>
        Verify
      </Button>
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
    marginBottom: 20,
    textAlign: "center",
  },
  infoText: {
    textAlign: "center",
    marginBottom: 30,
    color: "#999",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: "20%",
    textAlign: "center",
  },
  resendText: {
    textAlign: "center",
    marginBottom: 30,
    color: "#999",
  },
  verifyButton: {
    backgroundColor: "#00c853",
    paddingVertical: 10,
  },
});
