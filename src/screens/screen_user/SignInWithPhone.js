import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth } from "../../../firebaseConfig"; // Đảm bảo auth đã được khởi tạo đúng cách

export default function SignInWithPhone({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null); // Thêm state cho verificationId
  const [otp, setOtp] = useState(""); // Thêm state cho OTP
  const recaptchaVerifier = useRef(null); // Tạo ref cho RecaptchaVerifier

  useEffect(() => {
    recaptchaVerifier.current = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // Xử lý xác thực thành công
        },
        "expired-callback": () => {
          // Xử lý khi xác thực hết hạn
        },
      },
      auth
    );

    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }
    };
  }, []);

  const handleSignIn = async () => {
    if (!phoneNumber) {
      Alert.alert("Thông báo", "Vui lòng nhập số điện thoại.");
      return;
    }

    if (phoneNumber.length !== 10) {
      // Kiểm tra độ dài số điện thoại
      Alert.alert("Error", "Vui lòng nhập số điện thoại 10 chữ số hợp lệ.");
      return;
    }

    setLoading(true);

    try {
      const appVerifier = recaptchaVerifier.current; // Sử dụng ref đã khởi tạo

      // Gửi mã OTP tới số điện thoại người dùng nhập
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `+84${phoneNumber}`, // Thay đổi mã vùng phù hợp
        appVerifier
      );

      setVerificationId(confirmationResult.verificationId); // Lưu verificationId
      Alert.alert("Mã xác thực đã được gửi tới:", phoneNumber);
      // Chuyển sang màn hình nhập OTP
      navigation.navigate("OTP", { verificationId });
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!verificationId) {
      Alert.alert("Error", "Verification ID is missing.");
      return;
    }

    const credential = PhoneAuthProvider.credential(verificationId, otp);

    try {
      await signInWithCredential(auth, credential);
      Alert.alert("Success", "OTP Verified Successfully");
      console.log("Successfully authenticated");
      // Có thể chuyển hướng đến màn hình chính hoặc thực hiện hành động khác ở đây
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="user" size={60} color="#00c853" />
      </View>
      <Text style={styles.title}>Login to Your Account</Text>
      <TextInput
        style={styles.phoneInput}
        placeholder="Nhập số điện thoại của bạn"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <View id="recaptcha-container" />

      <TouchableOpacity
        style={styles.signInButton}
        onPress={handleSignIn}
        disabled={loading}
      >
        <Text style={styles.signInButtonText}>
          {loading ? "Loading..." : "Sign in"}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.otpInput}
        placeholder="Nhập mã OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity
        style={styles.otpButton}
        onPress={handleOtpVerification}
      >
        <Text style={styles.otpButtonText}>Verify OTP</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 80,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  phoneInput: {
    width: "100%",
    height: 60,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  otpInput: {
    width: "100%",
    height: 60,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  signInButton: {
    backgroundColor: "#00c853",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  otpButton: {
    backgroundColor: "#00c853",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  otpButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    color: "#00c853",
  },
});
