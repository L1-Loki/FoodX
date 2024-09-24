import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Danh sách hình ảnh
const imageAssets = [
  { id: "1", source: require("../../assets/salad.jpg"), uri: "salad.jpg" },
  {
    id: "2",
    source: require("../../assets/banh_dau.jpg"),
    uri: "banh_dau.jpg",
  },
  {
    id: "3",
    source: require("../../assets/hamburger.jpg"),
    uri: "hamburger.jpg",
  },
  {
    id: "4",
    source: require("../../assets/fried-egg.jpg"),
    uri: "fried-egg.jpg",
  },
  { id: "5", source: require("../../assets/pizza.jpg"), uri: "pizza.jpg" },
  {
    id: "6",
    source: require("../../assets/cupcakes.jpg"),
    uri: "cupcakes.jpg",
  },
  { id: "7", source: require("../../assets/Noodles.jpg"), uri: "Noodles.jpg" },
  { id: "8", source: require("../../assets/Drink.jpg"), uri: "Drink.jpg" },
  { id: "9", source: require("../../assets/dessert.jpg"), uri: "dessert.jpg" },
];

const AddMeal = ({ navigation }) => {
  const [meal, setMeal] = useState({
    title: "",
    distance: "",
    image: null,
    items: "",
    price: "",
  });

  const handleChange = (name, value) => {
    setMeal((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMeal = async () => {
    try {
      const mealData = {
        title: meal.title,
        distance: meal.distance,
        image: meal.image ? meal.image.uri : "adaptive-icon.png", // Gán đường dẫn ảnh, có thể là mặc định nếu không có ảnh
        items: Number(meal.items), // Chuyển đổi thành số
        price: Number(meal.price), // Chuyển đổi thành số
      };
      await addDoc(collection(db, "meals"), mealData);
      Alert.alert("Success", "Meal added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding meal: ", error);
      Alert.alert("Error", "Failed to add meal!");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={meal.title}
        onChangeText={(text) => handleChange("title", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Distance"
        value={meal.distance}
        onChangeText={(text) => handleChange("distance", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Items"
        value={meal.items}
        onChangeText={(text) => handleChange("items", text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={meal.price}
        onChangeText={(text) => handleChange("price", text)}
        keyboardType="numeric"
      />

      {/* Hiển thị hình ảnh đã chọn */}
      {meal.image && (
        <Image source={meal.image.source} style={styles.selectedImage} />
      )}

      <FlatList
        data={imageAssets}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setMeal((prev) => ({ ...prev, image: item }))}
          >
            <Image source={item.source} style={styles.imageThumbnail} />
          </TouchableOpacity>
        )}
        style={styles.imageList}
      />

      <Button title="Add Meal" onPress={handleAddMeal} color="#00c853" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    marginVertical: 10,
    paddingTop: 10,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  selectedImage: {
    width: "100%",
    height: "40%",
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imageList: {
    marginBottom: 10,
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default AddMeal;
