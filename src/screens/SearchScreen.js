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
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
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

  // Fetch meals from Firestore
  const fetchMeals = async () => {
    try {
      const mealCollection = collection(db, "meals");
      const mealSnapshot = await getDocs(mealCollection);
      const mealList = mealSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
        });
        setFavorites((prev) => new Set(prev).add(meal.id));
      }
    } catch (error) {
      console.error("Error toggling favorite: ", error);
      Alert.alert("Error", "Failed to update favorites.");
    }
  };

  // Filter meals and users based on search query
  const filteredMeals = meals.filter(
    (meal) =>
      meal.title && meal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Text style={styles.mealMeta}>
            {item.items} items | {item.distance}
          </Text>
          <Text style={styles.mealPrice}>${item.price}</Text>
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
          source={{ uri: item.profilePic || "https://via.placeholder.com/80" }}
          style={styles.mealImage}
        />
        <View style={styles.mealDetails}>
          <Text style={styles.mealTitle}>{item.fullName}</Text>
          <Text style={styles.mealMeta}>User</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ActivityIndicator style={styles.loading} size="large" color="#00c853" />
    );
  }

  return (
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
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      }
      ListEmptyComponent={<Text>No results found.</Text>}
      contentContainerStyle={styles.listContainer}
    />
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
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  mealDetails: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mealMeta: {
    color: "#666",
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "green",
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
});

export default SearchScreen;
