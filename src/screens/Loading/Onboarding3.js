import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const Onboarding3 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/order.png")}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Order Your Food</Text>
        <Text style={styles.description}>
          Quick and easy food delivery to your doorstep.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Onboarding4")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Next</Text>
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
    paddingTop:"40%",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  textContainer: {
    alignItems: "center", // Center text content
    marginVertical: 20, // Add margin between image and text
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00C853",
   paddingTop:"50%"
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

export default Onboarding3;
