import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Checkbox } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome"; // Thay thế tên icon theo ý muốn

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isRememberMe, setIsRememberMe] = useState(false);
  const phoneInput = React.useRef(null);

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Icon name="user" size={60} color="#00c853" />
      </View>

      {/* Title */}
      <Text style={styles.title}>Login to Your Account</Text>

      {/* Phone Input */}
      <PhoneInput
        ref={phoneInput}
        defaultValue={phoneNumber}
        defaultCode="US"
        layout="first"
        onChangeFormattedText={(text) => setPhoneNumber(text)}
        withDarkTheme
        withShadow
        autoFocus
        containerStyle={styles.phoneInputContainer}
        textContainerStyle={styles.textInput}
        textInputStyle={styles.phoneTextInput}
      />

      {/* Remember Me */}
      <View style={styles.rememberMeContainer}>
        <Checkbox
          status={isRememberMe ? "checked" : "unchecked"}
          onPress={() => setIsRememberMe(!isRememberMe)}
          color="#28a745"
        />
        <Text style={styles.rememberMeText}>Remember me</Text>
      </View>

      {/* Sign in Button */}
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInButtonText}>Sign in</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.divider}>or continue with</Text>

      {/* Social Login Options */}
      <View style={styles.socialContainer}>
        <TouchableOpacity>
          <Icon name="facebook" size={24} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="google" size={24} color="#db4437" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="apple" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Sign up */}
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
  phoneInputContainer: {
    width: "100%",
    height: 60,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  phoneTextInput: {
    height: 50,
    paddingVertical: 10,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberMeText: {
    marginLeft: 10,
  },
  signInButton: {
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
  divider: {
    textAlign: "center",
    color: "#999",
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
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
