import React, { useEffect, useState } from "react";
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
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const MealsScreen = ({ navigation }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [modalVisible, setModalVisible] = useState(false);

  const images = {
    "banh_dau.jpg": require("../assets/banh_dau.jpg"),
    "salad.jpg": require("../assets/salad.jpg"),
    "hamburger.jpg": require("../assets/hamburger.jpg"),
    "fried-egg.jpg": require("../assets/fried-egg.jpg"),
    "pizza.jpg": require("../assets/pizza.jpg"),
    "Noodles.jpg": require("../assets/Noodles.jpg"),
    "cupcakes.jpg": require("../assets/cupcakes.jpg"),
    "Drink.jpg": require("../assets/Drink.jpg"),
    "dessert.jpg": require("../assets/dessert.jpg"),
  };

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const mealCollection = collection(db, "meals");
        const mealSnapshot = await getDocs(mealCollection);

        if (mealSnapshot.empty) {
          setMeals([]);
          return;
        }

        const mealList = mealSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched meals: ", mealList);
        setMeals(mealList);
      } catch (error) {
        console.error("Error fetching meals: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleDeletePress = async (mealId) => {
    try {
      await deleteDoc(doc(db, "meals", mealId));
      Alert.alert("Success", "Meal deleted successfully!");
      setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId));
      setModalVisible(false); // Đóng menu sau khi xóa
    } catch (error) {
      console.error("Error deleting meal: ", error);
      Alert.alert("Error", "Failed to delete meal!");
    }
  };

  const handleLongPress = (event, item) => {
    setSelectedMeal(item);
    setMenuPosition({
      x: event.nativeEvent.pageX - 50,
      y: event.nativeEvent.pageY - 100,
    });
    setModalVisible(true);
  };

  const closeMenu = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00c853" />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const renderMealItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mealItem}
      onLongPress={(event) => handleLongPress(event, item)}
      onPress={() => navigation.navigate("MealDetail", { mealId: item.id })}
    >
      <View style={styles.mealInfo}>
        <Image
          source={images[item.image] || require("../assets/adaptive-icon.png")}
          style={styles.mealImage}
        />
        <View style={styles.mealDetails}>
          <Text style={styles.mealTitle}>{item.title}</Text>
          <Text style={styles.mealMeta}>
            {item.items} items | {item.distance}
          </Text>
          <Text style={styles.mealPrice}>${item.price}</Text>
        </View>
      </View>
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
                  onPress={() => navigation.navigate("AddMeal")}
                >
                  <Text style={styles.menuItem}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    if (selectedMeal?.id) {
                      navigation.navigate("UpdateMeal", {
                        mealId: selectedMeal.id,
                      });
                    } else {
                      Alert.alert("Error", "No meal selected!");
                    }
                  }}
                >
                  <Text style={styles.menuItem}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeletePress(selectedMeal.id)}
                >
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
