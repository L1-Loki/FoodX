import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

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

const MealDetailScreen = ({ route, navigation }) => {
  const { mealId } = route.params; // Lấy mealId truyền từ MealsScreen
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const mealRef = doc(db, "meals", mealId);
        const mealDoc = await getDoc(mealRef);

        if (mealDoc.exists()) {
          const mealData = mealDoc.data();
          setSelectedMeal({ id: mealDoc.id, ...mealData });
        } else {
          Alert.alert("Error", "Meal not found!");
        }
      } catch (error) {
        console.error("Error fetching meal: ", error);
        Alert.alert("Error", "Failed to load meal details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealId]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color="#00c853" />
      </View>
    );
  }

  if (!selectedMeal) {
    return (
      <View style={styles.screen}>
        <Text>No meal details available.</Text>
      </View>
    );
  }

  // Lấy hình ảnh từ đối tượng images
  const imageSource = images[selectedMeal.image] || null;

  return (
    <View style={styles.screen}>
      {imageSource ? (
        <Image source={imageSource} style={styles.image} />
      ) : (
        <Text>No image available.</Text>
      )}
      <Text style={styles.title}>{selectedMeal.title}</Text>
      <Text style={styles.details}>
        {selectedMeal.items} items | {selectedMeal.distance}
      </Text>
      <Text style={styles.price}>Price: ${selectedMeal.price.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  details: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginVertical: 5,
  },
  price: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
    marginVertical: 10,
  },
});

export default MealDetailScreen;
