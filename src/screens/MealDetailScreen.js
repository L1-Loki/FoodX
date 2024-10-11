import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"; // Thêm deleteDoc
import { db } from "../../firebaseConfig";
import { AntDesign, MaterialIcons } from "@expo/vector-icons"; // Thêm MaterialIcons
import { auth } from "../../firebaseConfig"; // Import Firebase Auth
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { ReviewForm } from "../screens/Vote/ReviewForm";

const MealDetailScreen = ({ route, navigation }) => {
  const { mealId } = route.params; // Lấy mealId truyền từ MealsScreen
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const fetchMealData = async () => {
        try {
          const mealRef = doc(db, "meals", mealId);
          const mealDoc = await getDoc(mealRef);
          if (mealDoc.exists()) {
            const mealData = mealDoc.data();
            setSelectedMeal({ id: mealDoc.id, ...mealData });

            // Kiểm tra món ăn có trong favorites hay không
            const favoriteRef = doc(db, "favorites", mealId);
            const favoriteDoc = await getDoc(favoriteRef);
            setIsFavorite(favoriteDoc.exists());
          } else {
            Alert.alert("Error", "Meal not found!");
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
          Alert.alert("Error", "Failed to load meal details.");
        } finally {
          setLoading(false);
        }
      };

      fetchMealData();
    });

    return unsubscribe;
  }, [mealId, navigation]);

  // Thêm hoặc xóa khỏi favorites
  const toggleFavorite = async (meal) => {
    const mealRef = doc(db, "favorites", meal.id);
    try {
      if (isFavorite) {
        await deleteDoc(mealRef);
        setIsFavorite(false);
      
      } else {
        await setDoc(mealRef, {
          title: meal.title,
          image: meal.image || "https://via.placeholder.com/80",
        });
        setIsFavorite(true);
        Alert.alert("Added", `${meal.title} added to favorites.`);
      }
    } catch (error) {
      Alert.alert("Error", "Could not update favorites.");
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => toggleFavorite(selectedMeal)}>
          <AntDesign
            name={isFavorite ? "heart" : "hearto"}
            size={24}
            color={isFavorite ? "red" : "#000"}
            style={styles.heartIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFavorite, selectedMeal]);

  useEffect(() => {
    const fetchImage = async () => {
      if (selectedMeal && selectedMeal.image) {
        try {
          const storage = getStorage();
          const imageRef = ref(storage, selectedMeal.image);
          const url = await getDownloadURL(imageRef);
          setSelectedMeal((prev) => ({ ...prev, imageUrl: url }));
        } catch (error) {
          console.error("Error fetching image from storage: ", error);
          Alert.alert("Error", "Failed to load meal image.");
        }
      }
    };

    fetchImage();
  }, [selectedMeal]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00c853" />
      </View>
    );
  }

  if (!selectedMeal) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errorText}>No meal details available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {selectedMeal.imageUrl ? (
        <Image source={{ uri: selectedMeal.imageUrl }} style={styles.image} />
      ) : (
        <Text style={styles.errorText}>No image available.</Text>
      )}
      <Text style={styles.title}>{selectedMeal.title}</Text>
      <View style={styles.detailsContainer}>
        <MaterialIcons name="restaurant-menu" size={24} color="#555" />
        <Text style={styles.details}>
          {selectedMeal.items} items | {selectedMeal.distance}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <MaterialIcons name="attach-money" size={24} color="green" />
        <Text style={styles.price}>${selectedMeal.price.toFixed(2)}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <MaterialIcons name="star" size={24} color="gold" />
        <Text style={styles.rating}>
          {selectedMeal.rating
            ? `${selectedMeal.rating.toFixed(1)} / 5 | ${
                selectedMeal.reviews.length
              } reviews`
            : "No reviews yet"}
        </Text>
        <AntDesign
          name="right"
          size={24}
          color="black"
          style={styles.arrowIcon}
          onPress={() =>
            navigation.navigate("ReviewForm", {
              mealId: selectedMeal.id,
              email: currentUser?.email || "",
              fullName: currentUser?.fullName || "",
            })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Căn trái các phần tử
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    position: "relative",
  },
  rating: {
    fontSize: 16,
    marginLeft: 10, // Thêm khoảng cách bên trái giữa icon và text
    color: "#555",
  },
  arrowIcon: {
    position: "absolute", // Đặt icon ở vị trí tuyệt đối
    right: 10, // Cách lề phải
  },
  details: {
    fontSize: 16,
    marginLeft: 10, // Thêm khoảng cách bên trái giữa icon và text
    color: "#555",
  },
  fullName: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10, // Khoảng cách giữa icon và text
  },
  price: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 10, // Khoảng cách giữa icon và text
  },
  heartIcon: {
    marginRight: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default MealDetailScreen;
