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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebaseConfig"; // Import storage từ Firebase
import * as ImagePicker from "expo-image-picker";

// Component UpdateMeal
const UpdateMeal = ({ route, navigation }) => {
  const { mealId } = route.params;
  const [meal, setMeal] = useState({
    title: "",
    distance: "",
    imageUrl: "",
    items: "",
    price: "",
  });

  // Lấy dữ liệu meal từ Firestore và hiển thị
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const mealRef = doc(db, "meals", mealId);
        const mealDoc = await getDoc(mealRef);

        if (mealDoc.exists()) {
          const mealData = mealDoc.data();
          console.log("Fetched meal data:", mealData);
          setMeal({
            title: mealData.title,
            distance: mealData.distance,
            imageUrl: mealData.image || "", // URL của ảnh từ Firebase Storage
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

  // Hàm tải ảnh từ thiết bị lên Firebase Storage
  const uploadImage = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert("Error", "Permission to access gallery is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const imageUri = pickerResult.assets[0].uri;

      const storageRef = ref(storage, `meals/${mealId}.jpg`);
      const img = await fetch(imageUri);
      const bytes = await img.blob();
      await uploadBytes(storageRef, bytes);

      const downloadUrl = await getDownloadURL(storageRef);

      setMeal((prevMeal) => ({
        ...prevMeal,
        imageUrl: downloadUrl,
      }));

      Alert.alert("Success", "Image uploaded successfully!");
    }
  };

  // Hàm cập nhật dữ liệu meal
  const handleUpdateMeal = async () => {
    try {
      const mealRef = doc(db, "meals", mealId);
      const updatedData = {
        title: meal.title,
        distance: meal.distance,
        imageUrl: meal.imageUrl, // URL ảnh từ Firebase Storage
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

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {meal.imageUrl ? ( // Sử dụng imageUrl để hiển thị hình ảnh
          <Image source={{ uri: meal.imageUrl }} style={styles.selectedImage} />
        ) : (
          <Image
            source={require("../../../assets/adaptive-icon.png")}
            style={styles.selectedImage}
          />
        )}
        <Text style={styles.imageLabel}>Selected Image</Text>
      </View>
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

      <TouchableOpacity style={styles.button} onPress={uploadImage}>
        <Text style={styles.buttonText}>Choose Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleUpdateMeal}>
        <Text style={styles.buttonText}>Update Meal</Text>
      </TouchableOpacity>
    </View>
  );
};

// Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: "#f5f5f5",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  imageLabel: {
    marginTop: 5,
    color: "#777",
  },
  button: {
    backgroundColor: "#00c853",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UpdateMeal;
