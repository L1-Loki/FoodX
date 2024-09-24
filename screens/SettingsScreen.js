import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
// Dữ liệu mẫu cho danh sách cài đặt
const settingsData = [
  { id: "1", title: "Chế độ tối sáng" },
  // { id: "2", title: "Chuyển sang admin" },
  { id: "3", title: "Cập nhật dữ liệu" },
  { id: "4", title: "Xóa dữ liệu" },
  { id: "5", title: "Đăng xuất" },
];

const SettingsScreen = ({ navigation }) => {
  const handlePress = (setting) => {
    if (setting.id === "2") {
      navigation.navigate("AdminScreenMeal"); // Điều hướng tới màn hình admin
    } else if (setting.id === "5") {
      signOut(auth).then(() => {
        navigation.navigate("SignIn");
      });
    }
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={settingsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.itemText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  item: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  itemText: {
    fontSize: 18,
  },
});

export default SettingsScreen;
