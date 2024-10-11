import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../../../firebaseConfig"; // Import Firebase Auth
import { db, storage } from "../../../firebaseConfig";

const AddMeal = ({ navigation }) => {
  const [meal, setMeal] = useState({
    title: "",
    distance: "",
    image: null,
    items: "",
    price: "",
  });
  const [fullName, setFullName] = useState("Anonymous"); // Để lưu tên người dùng

  const currentUser = auth.currentUser;

  useEffect(() => {
    // Lấy fullName của người dùng từ Firestore
    const fetchUserFullName = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid); // Giả sử email là document ID
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setFullName(userData.fullName || "Anonymous"); // Lấy tên đầy đủ hoặc đặt tên mặc định
        } else {
          console.log("User document not found");
        }
      }
    };

    fetchUserFullName();
  }, [currentUser]);

  const handleChange = (name, value) => {
    setMeal((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setMeal((prev) => ({ ...prev, image: pickerResult.assets[0] })); // Cập nhật ảnh
    }
  };

  const handleAddMeal = async () => {
    try {
      let imageUrl = "adaptive-icon.png"; // Hình ảnh mặc định nếu không có hình
      if (meal.image) {
        const response = await fetch(meal.image.uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `meals/${meal.image.fileName}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      const mealData = {
        title: meal.title,
        distance: meal.distance,
        image: imageUrl,
        items: Number(meal.items),
        price: Number(meal.price),
        fullName: fullName, // Thêm thông tin fullName của người dùng
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
      {meal.image && (
        <Image source={{ uri: meal.image.uri }} style={styles.selectedImage} />
      )}
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

      <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
        <Text style={styles.buttonText}>Add Meal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
    backgroundColor: "#f9f9f9",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  imageButton: {
    backgroundColor: "#00c853",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#00c853",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddMeal;
