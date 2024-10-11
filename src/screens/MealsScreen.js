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
import AntDesign from "@expo/vector-icons/AntDesign";
import { db } from "../../firebaseConfig";

const MealsScreen = ({ navigation }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  // Lấy danh sách meals từ Firestore
  const fetchMeals = useCallback(async () => {
    try {
      const mealCollection = collection(db, "meals");
      const mealSnapshot = await getDocs(mealCollection);
      const mealList = mealSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMeals(mealList);
    } catch (error) {
      setError("Error fetching meals.");
    }
  }, []);

  // Lấy danh sách favorites từ Firestore
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

  // Lấy dữ liệu meals và favorites
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchMeals();
      await fetchFavorites();
      setLoading(false);
    };

    fetchData();
  }, [fetchMeals, fetchFavorites]);

  // Thêm hoặc xóa khỏi favorites
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
        });
        setFavorites((prev) => new Set(prev).add(meal.id));
       
      }
    } catch (error) {
      Alert.alert("Error", "Could not update favorites.");
    }
  };

  // Xóa meal
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

  // Đóng menu
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id}
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
  mealItem: {
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  mealDetails: {
    flex: 1,
    marginLeft: 10,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mealMeta: {
    color: "#888",
    fontSize: 12,
  },
  mealPrice: {
    color: "green",
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 16,
  },
  heartIcon: {
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 10,
    elevation: 5,
    padding: 10,
  },
  menuItem: {
    padding: 10,
    fontSize: 16,
  },
});

export default MealsScreen;
