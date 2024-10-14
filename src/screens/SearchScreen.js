import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import { AntDesign, FontAwesome, Entypo } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { query, where } from "firebase/firestore";

const SearchScreen = ({ navigation, route }) => {
  const { query: initialQuery } = route.params;
  const [meals, setMeals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [favorites, setFavorites] = useState(new Set());
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState("all");
  const [ratingRange, setRatingRange] = useState("all");
  const [distanceRange, setDistanceRange] = useState("all");

  // Fetch meals from Firestore and their reviews
  const fetchMeals = async () => {
    try {
      const mealCollection = collection(db, "meals");
      const mealSnapshot = await getDocs(mealCollection);
      const mealList = [];

      for (const mealDoc of mealSnapshot.docs) {
        const mealData = mealDoc.data();
        const reviewsRef = collection(db, "meals", mealDoc.id, "reviews");
        const reviewsSnapshot = await getDocs(reviewsRef);
        const reviews = reviewsSnapshot.docs.map((doc) => doc.data());

        // Calculate total and average rating
        const totalRating = reviews.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        const averageRating =
          reviews.length > 0 ? totalRating / reviews.length : 0;

        mealList.push({
          id: mealDoc.id,
          ...mealData,
          reviews,
          rating: averageRating,
        });
      }

      setMeals(mealList);
    } catch (error) {
      console.error("Error fetching meals: ", error);
      setError(error.message);
    }
  };
  // Fetch favorites from Firestore
  const fetchFavorites = async () => {
    try {
      const favoritesCollection = collection(db, "favorites");
      const favoritesSnapshot = await getDocs(favoritesCollection);
      const favoritesSet = new Set(favoritesSnapshot.docs.map((doc) => doc.id));
      setFavorites(favoritesSet);
    } catch (error) {
      console.error("Error fetching favorites: ", error);
    }
  };

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

  // Fetch users by fullName from Firestore
  const fetchUsersByFullName = async () => {
    try {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users by fullName: ", error);
      setError(error.message);
    }
  };

  // Fetch meals, favorites, and users
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchMeals();
        await fetchFavorites();
        await fetchUsersByFullName();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle favorite meals
  const toggleFavorite = async (meal) => {
    const favoritesRef = doc(db, "favorites", meal.id);
    try {
      if (favorites.has(meal.id)) {
        await deleteDoc(favoritesRef);
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.delete(meal.id);
          return newFavorites;
        });
      } else {
        await setDoc(favoritesRef, {
          title: meal.title,
          image: meal.image || "https://via.placeholder.com/80",
          price: meal.price,
          distance: meal.distance,
          rating: meal.rating,
        });
        setFavorites((prev) => new Set(prev).add(meal.id));
      }
    } catch (error) {
      console.error("Error toggling favorite: ", error);
      Alert.alert("Error", "Failed to update favorites.");
    }
  };

  // Filter meals and users based on search query and selected filters
  const filteredMeals = meals.filter((meal) => {
    const matchesSearchQuery =
      meal.title &&
      meal.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriceRange =
      priceRange === "all" ||
      (priceRange === "low" && meal.price < 10) || // Adjust the price thresholds as needed
      (priceRange === "high" && meal.price >= 10);
    const matchesRatingRange =
      ratingRange === "all" ||
      (ratingRange === "low" && meal.rating < 3) || // Adjust the rating thresholds as needed
      (ratingRange === "high" && meal.rating >= 3);
    const matchesDistanceRange =
      distanceRange === "all" ||
      (distanceRange === "near" && meal.distance < 5) || // Adjust the distance thresholds as needed
      (distanceRange === "far" && meal.distance >= 5);

    return (
      matchesSearchQuery &&
      matchesPriceRange &&
      matchesRatingRange &&
      matchesDistanceRange
    );
  });

  const filteredUsers = users.filter(
    (user) =>
      user.fullName &&
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMealItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mealItem}
      onPress={() => navigation.navigate("MealDetail", { mealId: item.id })}
    >
      <View style={styles.mealInfo}>
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
      </View>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mealItem}
      onPress={() => navigation.navigate("UserProfile", { userId: item.id })}
    >
      <View style={styles.mealInfo}>
        <Image
          source={{ uri: item.imageUri || "https://via.placeholder.com/80" }}
          style={styles.avataImage}
        />
        <View style={styles.mealDetails}>
          <Text style={styles.mealTitle}>{item.fullName}</Text>
          <Text style={styles.mealMeta}>User</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  if (loading) {
    return (
      <ActivityIndicator style={styles.loading} size="large" color="#00c853" />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={[...filteredMeals, ...filteredUsers]}
        renderItem={({ item }) =>
          item.title ? renderMealItem({ item }) : renderUserItem({ item })
        }
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.searchContainer}>
              <FontAwesome name="search" size={20} color="grey" />
              <TextInput
                placeholder="Search for meals or users..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
              <TouchableOpacity onPress={openFilterModal}>
                <FontAwesome name="filter" size={20} color="grey" />
              </TouchableOpacity>
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
          </View>
        }
        ListEmptyComponent={<Text>No results found.</Text>}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={closeFilterModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>

            <Text style={styles.filterLabel}>Price Range</Text>
            <TouchableOpacity onPress={() => setPriceRange("all")}>
              <Text style={styles.filterOption}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPriceRange("low")}>
              <Text style={styles.filterOption}>Low ($0 - $10)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPriceRange("high")}>
              <Text style={styles.filterOption}>High (≥ $10)</Text>
            </TouchableOpacity>

            <Text style={styles.filterLabel}>Rating Range</Text>
            <TouchableOpacity onPress={() => setRatingRange("all")}>
              <Text style={styles.filterOption}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRatingRange("low")}>
              <Text style={styles.filterOption}>Low (≤ 3 stars)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRatingRange("high")}>
              <Text style={styles.filterOption}>High (≥ 3 stars)</Text>
            </TouchableOpacity>

            <Text style={styles.filterLabel}>Distance Range</Text>
            <TouchableOpacity onPress={() => setDistanceRange("all")}>
              <Text style={styles.filterOption}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDistanceRange("near")}>
              <Text style={styles.filterOption}>Near (≤ 5 km)</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDistanceRange("far")}>
              <Text style={styles.filterOption}>Far (≥ 5 km)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeFilterModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
    paddingTop: 50,
    padding: 10,
  },
  headerContainer: {
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 20, // Tăng kích thước của borderRadius
    marginBottom: 20,
    borderWidth: 1, // Thêm border để nhìn rõ hơn
    borderColor: "#ccc", // Màu của border
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  mealItem: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
    elevation: 3,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  mealInfo: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between", // Chia đều không gian giữa các phần tử
    alignItems: "center",
  },
  mealImage: {
    width: 120,
    height: 120,
    borderRadius: 24,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#ffff",
  },
  avataImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#ffff",
  },
  mealDetails: {
    flex: 1,
    marginLeft: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
  heartIcon: {
    justifyContent: "center", // Căn giữa theo chiều dọc trong container
    alignItems: "center", // Căn giữa theo chiều ngang trong container
    marginLeft: 10,
  },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: {
    color: "red",
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  filterOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  starsContainer: {
    flexDirection: "row",
  },
});

export default SearchScreen;
