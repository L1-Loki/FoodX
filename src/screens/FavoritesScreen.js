import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { AntDesign, Entypo } from "@expo/vector-icons";

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meals, setMeals] = useState([]); // Lưu các món ăn

  // Fetch favorites from Firestore
  const fetchFavorites = async () => {
    setLoading(true); // Đặt loading về true khi bắt đầu fetch
    try {
      const favoritesCollection = collection(db, "favorites");
      const favoritesSnapshot = await getDocs(favoritesCollection);

      const favoriteMeals = favoritesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFavorites(new Set(favoriteMeals.map((meal) => meal.id))); // Lưu ID vào Set
      setMeals(favoriteMeals); // Lưu danh sách món ăn
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Error fetching favorites. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Hàm để render các ngôi sao đánh giá
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <AntDesign
          key={i}
          name={i < rating ? "star" : "staro"}
          size={16}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  const toggleFavorite = async (meal) => {
    const mealRef = doc(db, "favorites", meal.id);
    try {
      if (favorites.has(meal.id)) {
        await deleteDoc(mealRef);
        setFavorites(
          (prev) => new Set([...prev].filter((id) => id !== meal.id))
        );
        setMeals((prev) => prev.filter((m) => m.id !== meal.id)); // Cập nhật danh sách món ăn
      } else {
        await setDoc(mealRef, {
          title: meal.title,
          image: meal.image || "https://via.placeholder.com/80",
          price: meal.price,
          distance: meal.distance,
          rating: meal.rating,
        });
        setFavorites((prev) => new Set(prev).add(meal.id));
        setMeals((prev) => [...prev, { id: meal.id, ...meal }]); // Cập nhật danh sách món ăn
      }
    } catch (error) {
      Alert.alert("Error", "Could not update favorites.");
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mealItem}
      onPress={() => navigation.navigate("MealDetail", { mealId: item.id })}
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

  return (
    <View style={styles.screen}>
      <FlatList
        data={meals}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
    width: 80,
    height: 80,
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
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealMeta: {
    marginLeft: 5,
    color: "#555",
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "green",
  },
  starsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  heartIcon: {
    marginLeft: 10,
  },
});

export default FavoritesScreen;
