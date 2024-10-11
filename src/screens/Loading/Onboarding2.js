import React, { useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

const Onboarding2 = ({ navigation }) => {
  useEffect(() => {
    // Chuyển sang Onboarding3 sau 2 giây
    const timer = setTimeout(() => {
      navigation.navigate("SignIn");
    }, 2000);

    // Xóa timer khi component unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../../../assets/crispy-spicy-chicken-wings.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to FoodX! 🖐</Text>
        <Text style={styles.description}>
          Enjoy the best food delivery experience!
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    color: "#00C853",
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Onboarding2;
