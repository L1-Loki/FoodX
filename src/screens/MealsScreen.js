import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { AntDesign, FontAwesome, Entypo } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";

const MealsScreen = ({ navigation }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  // Fetch meals from Firestore
  const fetchMeals = useCallback(async () => {
    try {
      const mealCollection = collection(db, "meals");
      const mealSnapshot = await getDocs(mealCollection);

      const mealList = await Promise.all(
        mealSnapshot.docs.map(async (doc) => {
          const mealData = { id: doc.id, ...doc.data() };

          // Fetch reviews for each meal
          const reviewsRef = collection(db, "meals", mealData.id, "reviews");
          const reviewsSnapshot = await getDocs(reviewsRef);
          const reviews = reviewsSnapshot.docs.map((doc) => doc.data());

          // Calculate total and average rating
          const totalRating = reviews.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          const averageRating =
            reviews.length > 0 ? totalRating / reviews.length : 0;

          return { ...mealData, reviews, rating: averageRating };
        })
      );

      setMeals(mealList);
    } catch (error) {
      setError("Error fetching meals.");
    }
  }, []);

  // Fetch favorites from Firestore
  const fetchFavorites = useCallback(async () => {
    try {
      const favoritesCollection = collection(db, "favorites");
      const favoritesSnapshot = await getDocs(favoritesCollection);
      const favoritesSet = new Set(favoritesSnapshot.docs.map((doc) => doc.id));

      setFavorites(favoritesSet);
    } catch (error) {
      setError("Error fetching favorites.");
    }
  }, []);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<AntDesign key={i} name="star" size={16} color="gold" />);
    }
    // Add half stars
    for (let i = 0; i < halfStars; i++) {
      stars.push(
        <AntDesign key={fullStars + i} name="star" size={16} color="gold" />
      );
    }
    // Add empty stars
    for (let i = 0; i < 5 - fullStars - halfStars; i++) {
      stars.push(
        <AntDesign
          key={fullStars + halfStars + i}
          name="staro"
          size={16}
          color="gold"
        />
      );
    }
    return stars;
  };

  // Fetch meals and favorites on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchMeals();
      await fetchFavorites();
      setLoading(false);
    };

    fetchData();
  }, [fetchMeals, fetchFavorites]);

  // Toggle favorite status
  const toggleFavorite = async (meal) => {
    const mealRef = doc(db, "favorites", meal.id);
    try {
      if (favorites.has(meal.id)) {
        await deleteDoc(mealRef);
        setFavorites(
          (prev) => new Set([...prev].filter((id) => id !== meal.id))
        );
      } else {
        await setDoc(mealRef, {
          title: meal.title,
          image: meal.image || "https://via.placeholder.com/80",
          price: meal.price, // Lưu giá
          distance: meal.distance, // Lưu khoảng cách
          rating: meal.rating, // Lưu đánh giá
        });
        setFavorites((prev) => new Set(prev).add(meal.id));
      }
    } catch (error) {
      Alert.alert("Error", "Could not update favorites.");
    }
  };

  // Delete meal
  const handleDelete = async (mealId) => {
    try {
      await deleteDoc(doc(db, "meals", mealId));
      setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId));
      setModalVisible(false);
      Alert.alert("Deleted", "Meal deleted successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to delete meal.");
    }
  };

  // Mở menu
  const handleLongPress = (event, item) => {
    setSelectedMeal(item);
    setMenuPosition({
      x: event.nativeEvent.pageX - 50,
      y: event.nativeEvent.pageY - 100,
    });
    setModalVisible(true);
  };

  // Close menu
  const closeMenu = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00c853" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const renderMealItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mealItem}
      onPress={() => navigation.navigate("MealDetail", { mealId: item.id })}
      onLongPress={(e) => handleLongPress(e, item)}
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/80" }}
        style={styles.mealImage}
      />
      <View style={styles.mealDetails}>
        <Text style={styles.mealTitle}>{item.title}</Text>
        <View style={styles.location}>
          <Entypo name="location-pin" size={14} color="#555" />
          <Text style={styles.mealMeta}>{item.distance}</Text>
        </View>
        <Text style={styles.mealPrice}>${item.price}</Text>
        <View style={styles.starsContainer}>{renderStars(item.rating)}</View>
      </View>
      <TouchableOpacity onPress={() => toggleFavorite(item)}>
        <AntDesign
          name={favorites.has(item.id) ? "heart" : "hearto"}
          size={24}
          color={favorites.has(item.id) ? "red" : "#000"}
          style={styles.heartIcon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.menuContainer,
                  { top: menuPosition.y, left: menuPosition.x },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("AddMeal");
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.menuItem}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("UpdateMeal", {
                      mealId: selectedMeal.id,
                    });
                  }}
                >
                  <Text style={styles.menuItem}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(selectedMeal.id)}>
                  <Text style={styles.menuItem}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  mealItem: {
    flexDirection: "row",
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
    padding: 15,
    alignItems: "center",
  },
  mealImage: {
    width: 110,
    height: 110,
    borderRadius: 8,
    marginRight: 15,
  },
  mealDetails: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  mealMeta: {
    fontSize: 14,
    color: "#555",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "green",
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: "row",
  },
  heartIcon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
  },
});

export default MealsScreen;
