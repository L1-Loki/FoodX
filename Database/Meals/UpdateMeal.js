import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

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

const UpdateMeal = ({ route, navigation }) => {
  const { mealId } = route.params;
  const [meal, setMeal] = useState({
    title: "",
    distance: "",
    image: "",
    items: "",
    price: "",
  });

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const mealRef = doc(db, "meals", mealId);
        const mealDoc = await getDoc(mealRef);

        if (mealDoc.exists()) {
          const mealData = mealDoc.data();
          setMeal({
            title: mealData.title,
            distance: mealData.distance,
            image: mealData.image || require("../../assets/adaptive-icon.png"), // Sử dụng require nếu không có ảnh
            items: mealData.items.toString(),
            price: mealData.price.toString(),
          });
        } else {
          Alert.alert("Error", "Meal not found!");
        }
      } catch (error) {
        console.error("Error fetching meal: ", error);
      }
    };

    fetchMeal();
  }, [mealId]);

  const handleUpdateMeal = async () => {
    try {
      const mealRef = doc(db, "meals", mealId);
      const updatedData = {
        title: meal.title,
        distance: meal.distance,
        image: meal.imageUri, // Cập nhật ảnh từ state
        items: Number(meal.items),
        price: Number(meal.price),
      };

      await updateDoc(mealRef, updatedData);
      Alert.alert("Success", "Meal updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating meal: ", error);
      Alert.alert("Error", "Failed to update meal!");
    }
  };

  const handleChange = (name, value) => {
    setMeal((prevMeal) => ({
      ...prevMeal,
      [name]: value,
    }));
  };

  const selectImageFromAssets = (imageUri, imageSource) => {
    setMeal((prevMeal) => ({
      ...prevMeal,
      image: imageSource,
      imageUri: imageUri,
    }));
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
        keyboardType="numeric"
        value={meal.items}
        onChangeText={(text) => handleChange("items", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={meal.price}
        onChangeText={(text) => handleChange("price", text)}
      />
      {meal.image ? (
        <Image source={meal.image} style={styles.selectedImage} />
      ) : (
        <Image
          source={require("../../assets/adaptive-icon.png")}
          style={styles.selectedImage}
        />
      )}

      <FlatList
        data={imageAssets}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => selectImageFromAssets(item.uri, item.source)}
          >
            <Image source={item.source} style={styles.assetImage} />
          </TouchableOpacity>
        )}
      />

      <Button title="Update Meal" onPress={handleUpdateMeal} color="#00c853" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  assetImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default UpdateMeal;
