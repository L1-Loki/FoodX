import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { getDistance } from "geolib";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { LogBox } from "react-native";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../../firebaseConfig";

LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop']);

const AddMeal = ({ navigation, route }) => {
  const { onAddMeal } = route.params;
  const [meal, setMeal] = useState({
    title: "",
    distance: "",
    image: null,
    category: "Overview", // Giá trị mặc định
    customCategory: "",
    price: "",
    location: null,
  });
  const [email, setEmail] = useState("Anonymous");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [meals, setMeals] = useState([]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUseremail = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setEmail(userData.email || "Anonymous");
        } else {
          console.log("User 123 document not found");
        }
      }
    };

    fetchUseremail();
    fetchMeals();
    getCurrentLocation(); // Lấy vị trí hiện tại ngay khi tải
  }, [currentUser]);

  useEffect(() => {
    navigation.setOptions({
      onAddMeal: handleAddMeal, // Đặt hàm handleAddMeal vào trong options
    });
  }, [navigation]);

  const fetchMeals = async () => {
    const mealsCollection = collection(db, "meals");
    const mealsSnapshot = await getDocs(mealsCollection);
    const mealsList = mealsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMeals(mealsList);
  };

  const handleChange = (name, value) => {
    console.log(`Changing ${name} to ${value}`);
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
      setMeal((prev) => ({ ...prev, image: pickerResult.assets[0] }));
    }
  };

  const handleOpenMap = async () => {
    if (meal.location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${meal.location.latitude},${meal.location.longitude}`;
      await Linking.openURL(url);
    } else {
      Alert.alert("Location is not available");
    }
  };

  const handleAddMeal = async () => {
    if (!meal.title || !meal.distance || !meal.price || !meal.category) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      let imageUrl = "adaptive-icon.png";
      if (meal.image) {
        const response = await fetch(meal.image.uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `meals/${meal.image.fileName}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      const mealData = {
        title: meal.title,
        distance: `${meal.distance} km`,
        image: imageUrl,
        category: isCustomCategory
          ? meal.customCategory
          : meal.category || "Overview",
        price: Number(meal.price),
        email: email,
        location: meal.location,
      };

      // Kiểm tra giá trị của mealData
      console.log("Meal data before adding:", mealData);

      // Thêm món ăn vào Firestore
      const docRef = await addDoc(collection(db, "meals"), mealData);
      console.log("Document written with ID: ", docRef.id);

      // Lấy danh sách người theo dõi
      const userDoc = await getDoc(doc(db, "users", email));
      if (userDoc.exists()) {
        const followers = userDoc.data().followersList || [];
        if (Array.isArray(followers)) {
          const notificationsRef = collection(db, "notifications");
          const fullName = userDoc.data().fullName || [];

          for (const follower of followers) {
            await addDoc(notificationsRef, {
              followerId: follower,
              mealId: docRef.id,
              message: `${fullName} đã thêm món ăn mới: ${meal.title}!`,
              timestamp: new Date(), // Kiểm tra đúng loại dữ liệu ở đây
            });
          }
          console.log("Notifications sent for followers.");
        } else {
          console.error("Followers is not an array:", followers);
        }
      }

      if (typeof onAddMeal === "function") {
        onAddMeal(docRef.id);
      }

      Alert.alert("Success", "Meal added successfully!");
      setMeal({
        title: "",
        distance: "",
        image: null,
        category: "Overview",
        customCategory: "",
        price: "",
        location: null,
      });
      fetchMeals();
    } catch (error) {
      console.error("Error adding meal: ", error);
      Alert.alert("Error", "Failed to add meal!");
    }
  };

  useEffect(() => {
    console.log("Current meal state:", meal);
  }, [meal]);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        setCurrentLocation(location);
      }
    } catch (error) {
      console.log("Error getting location: ", error);
    }
  };

  const handleMapPress = (e) => {
    const { coordinate } = e.nativeEvent;
    setMeal((prev) => ({
      ...prev,
      location: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
      distance: calculateDistance(coordinate.latitude, coordinate.longitude), // Tính khoảng cách khi chọn vị trí
    }));
  };

  const calculateDistance = (latitude, longitude) => {
    if (currentLocation) {
      const distance = getDistance(
        {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
        { latitude, longitude }
      );
      return (distance / 1000).toFixed(2); // Trả về khoảng cách tính bằng km
    }
    return 0;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer} key={meal.id}>
          {meal.image && (
            <Image
              source={{ uri: meal.image.uri }}
              style={styles.selectedImage}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={meal.title}
            onChangeText={(text) => handleChange("title", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Distance (km)"
            value={meal.distance ? `${meal.distance} km` : ""}
            editable={false}
          />
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
            value={meal.price}
            onChangeText={(text) => handleChange("price", text)}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.imageButton}
            onPress={handleImagePicker}
          >
            <Text style={styles.buttonText}>Select Image</Text>
          </TouchableOpacity>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 10.9821,
              longitude: 106.6459,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            {meal.location && (
              <Marker
                coordinate={{
                  latitude: meal.location.latitude,
                  longitude: meal.location.longitude,
                }}
                title="Selected Location"
              />
            )}
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.coords.latitude,
                  longitude: currentLocation.coords.longitude,
                }}
                title="Your Location"
              />
            )}
          </MapView>

          <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
            <Text style={styles.buttonText}>Add Meal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: "#4CAF50",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default AddMeal;
