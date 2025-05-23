import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../../firebaseConfig"; // Import storage từ Firebase
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps"; // Thêm import MapView
import * as Location from "expo-location"; // Thêm import Location

// Component UpdateMeal
const UpdateMeal = ({ route, navigation }) => {
  const { mealId } = route.params;
  const [meal, setMeal] = useState({
    title: "",
    distance: "",
    image: "",
    category: "Overview", // Giá trị mặc định
    customCategory: "",
    price: "",
    location: { latitude: 10.9821, longitude: 106.6459 }, // Thêm trường location
  });
  const [userLocation, setUserLocation] = useState(null);
  const [email, setEmail] = useState("Anonymous");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const currentUser = auth.currentUser;

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
            image: mealData.image || "",
            price: mealData.price.toString(),
            location: mealData.location || {
              latitude: 10.9821,
              longitude: 106.6459,
            }, // Thêm location từ Firestore
          });
        } else {
          Alert.alert("Error", "Meal not found!");
        }
      } catch (error) {
        console.error("Error fetching meal: ", error);
        Alert.alert("Error", "Failed to fetch meal data.");
      }
    };
    fetchUseremail();
    fetchMeal();
  }, [mealId]);

  const fetchUseremail = async () => {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setEmail(userData.email || "Anonymous");
      } else {
        console.log("User document not found");
      }
    }
  };
  // Lấy vị trí hiện tại của người dùng
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    };

    getLocation();
  }, []);

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

      try {
        const storageRef = ref(storage, `meals/${mealId}.jpg`);
        const img = await fetch(imageUri);
        const bytes = await img.blob();
        await uploadBytes(storageRef, bytes);

        const downloadUrl = await getDownloadURL(storageRef);
        setMeal((prevMeal) => ({
          ...prevMeal,
          image: downloadUrl,
        }));

      } catch (error) {
        console.error("Error uploading image: ", error);
        Alert.alert("Error", "Failed to upload image.");
      }
    }
  };

  // Hàm cập nhật dữ liệu meal
  const handleUpdateMeal = async () => {
    if (!meal.title || !meal.distance || !meal.price) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const mealRef = doc(db, "meals", mealId);
      const updatedData = {
        title: meal.title,
        distance: meal.distance,
        image: meal.image,
        category: isCustomCategory
          ? meal.customCategory
          : meal.category || "Overview",
        price: Number(meal.price),
        email: email,
        location: meal.location, 
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

  // Hàm chọn vị trí
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMeal((prevMeal) => ({
      ...prevMeal,
      location: { latitude, longitude },
      distance: calculateDistance(userLocation, { latitude, longitude }), // Tính khoảng cách
    }));
  };

  // Hàm tính khoảng cách giữa hai tọa độ
  const calculateDistance = (loc1, loc2) => {
    if (!loc1 || !loc2) return "0 km";

    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Bán kính trái đất tính bằng km

    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(loc1.latitude)) *
        Math.cos(toRad(loc2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(2) + " km"; // Trả về khoảng cách
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          <View style={styles.imageContainer}>
            {meal.image ? (
              <Image
                source={{ uri: meal.image }}
                style={styles.selectedImage}
              />
            ) : (
              <Image
                source={require("../../../assets/adaptive-icon.png")}
                style={styles.selectedImage}
              />
            )}
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
            editable={false} // Không cho phép chỉnh sửa
          />
          {/* <TextInput
            style={styles.input}
            placeholder="Number of Items"
            keyboardType="numeric"
            value={meal.items}
            onChangeText={(text) => handleChange("items", text)}
          /> */}
          <Picker
            selectedValue={meal.category}
            onValueChange={(itemValue) => {
              console.log("Selected category:", itemValue);
              handleChange("category", itemValue);
            }}
            style={styles.input}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Hamburger" value="Hamburger" />
            <Picker.Item label="Pizza" value="Pizza" />
            <Picker.Item label="Noodles" value="Noodles" />
            <Picker.Item label="Meat" value="Meat" />
            <Picker.Item label="Vegetables" value="Vegetables" />
            <Picker.Item label="Dessert" value="Dessert" />
            <Picker.Item label="Drink" value="Drink" />
            <Picker.Item label="Bread" value="Bread" />
            <Picker.Item label="Rice" value="Rice" />
            <Picker.Item label="Cheese" value="Cheese" />
            <Picker.Item label="Sushi" value="Sushi" />
            <Picker.Item label="Khác" value="Other" />
          </Picker>

          {meal.category === "Other" && (
            <TextInput
              style={styles.input}
              placeholder="Nhập danh mục tùy chỉnh"
              value={meal.customCategory}
              onChangeText={(text) => handleChange("customCategory", text)}
            />
          )}
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
          {/* Bản đồ để chọn vị trí */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: meal.location.latitude,
                longitude: meal.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={handleMapPress} // Thêm sự kiện khi nhấn vào bản đồ
            >
              <Marker coordinate={meal.location} title={"Meal Location"} />
            </MapView>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleUpdateMeal}>
            <Text style={styles.buttonText}>Update Meal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageLabel: {
    marginTop: 5,
    color: "#777",
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  formContainer: {
    marginBottom: 20,
  },
  mapContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: 200,
  },
});

export default UpdateMeal;
