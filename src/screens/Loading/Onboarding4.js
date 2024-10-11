import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const Onboarding4 = ({ navigation }) => {
  // Hàm hoàn thành onboarding và điều hướng đến màn hình SignIn
  const finishOnboarding = async () => {
    navigation.navigate("SignIn"); // Điều hướng đến màn hình SignIn
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/pay.png")} style={styles.image} />
      <Text style={styles.title}>Easy Payment</Text>
      <Text style={styles.description}>
        Pay easily with various payment options.
      </Text>
      <TouchableOpacity onPress={finishOnboarding} style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: "40%",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00C853",
    marginVertical: 20,
    paddingTop: "40%",
  },
  description: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#00C853",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Onboarding4;
