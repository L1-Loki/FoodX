import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { LogBox } from "react-native";
const Onboarding1 = ({ navigation }) => {
    useEffect(() => {
        // Chuyển sang Onboarding3 sau 2 giây
        const timer = setTimeout(() => {
          navigation.navigate("Onboarding2");
        }, 2000);
    
        // Xóa timer khi component unmount
        return () => clearTimeout(timer);
      }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>
          Food
          <Text style={styles.highlight}>X</Text>
        </Text>
      </View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    </View>
  );
};
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 150, // Tăng kích thước logo
    height: 150,
    marginRight: 15, // Tăng khoảng cách giữa logo và chữ
  },
  title: {
    fontSize: 48, // Tăng kích thước chữ tiêu đề
    fontWeight: "bold", // Chữ in đậm hơn
    color: "#000",
  },
  highlight: {
    color: "#00C853", // Màu xanh cho chữ "X"
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: "center",
  },
});

export default Onboarding1;
