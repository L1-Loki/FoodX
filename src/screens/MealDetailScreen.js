import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  arrayUnion,
  collection,
  addDoc,
  getDocs, // Add getDocs here
} from "firebase/firestore"; // Ensure getDocs is imported
import { db } from "../../firebaseConfig";
import { AntDesign, MaterialIcons, Entypo } from "@expo/vector-icons";
import { auth } from "../../firebaseConfig";
import { ReviewForm } from "../screens/Vote/ReviewForm";

const MealDetailScreen = ({ route, navigation }) => {
  const { mealId } = route.params;
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

            // Lấy đánh giá
            const reviewsRef = collection(db, "meals", mealId, "reviews");
            const reviewsSnapshot = await getDocs(reviewsRef); // Use getDocs here
            const reviews = reviewsSnapshot.docs.map((doc) => doc.data());

            // Cập nhật số lượng và đánh giá trung bình
            const totalRating = reviews.reduce(
              (acc, review) => acc + review.rating,
              0
            );
            const averageRating =
              reviews.length > 0 ? totalRating / reviews.length : 0;

            // Cập nhật lại selectedMeal với reviews
            setSelectedMeal((prevMeal) => ({
              ...prevMeal,
              reviews: reviews,
              rating: averageRating,
            }));

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

  const openInGoogleMaps = () => {
    if (selectedMeal && selectedMeal.location) {
      const { latitude, longitude } = selectedMeal.location;
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url).catch((err) => {
        console.error("Error opening Google Maps: ", err);
        Alert.alert("Error", "Unable to open Google Maps.");
      });
    } else {
      Alert.alert("Error", "No location available for this meal.");
    }
  };

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
      {selectedMeal.image ? (
        <Image source={{ uri: selectedMeal.image }} style={styles.image} />
      ) : (
        <Text style={styles.errorText}>No image available.</Text>
      )}
      <Text style={styles.title}>{selectedMeal.title}</Text>

      <TouchableOpacity onPress={openInGoogleMaps}>
        <View style={styles.detailsContainer}>
          <Entypo name="location-pin" size={24} color="#555" />
          <Text style={styles.details}>{selectedMeal.distance}</Text>
          <AntDesign
            name="right"
            size={24}
            color="black"
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <MaterialIcons name="attach-money" size={24} color="green" />
        <Text style={styles.price}>${selectedMeal.price.toFixed(2)}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <MaterialIcons name="star" size={24} color="gold" />
        <Text style={styles.rating}>
          {selectedMeal.rating
            ? `${selectedMeal.rating.toFixed(1)} / 5 | ${selectedMeal.reviews.length} reviews`
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
