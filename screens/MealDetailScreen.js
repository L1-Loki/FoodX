import React from "react";
import { FlatList, View, Text, Image, StyleSheet } from "react-native";

const meals = [
  {
    id: "1",
    title: "Mixed Salad Bowl",
    image: require("../assets/salad.jpg"),
    items: 3,
    distance: "1.5 km",
    price: 18.0,
  },
  {
    id: "2",
    title: "Mixed Salad Bowl",
    image: require("../assets/banh_dau.jpg"),
    items: 3,
    distance: "1.5 km",
    price: 8.0,
  },
  {
    id: "3",
    title: "Mixed Salad Bowl",
    image: require("../assets/hamburger.jpg"),
    items: 3,
    distance: "1.5 km",
    price: 10.0,
  },
  {
    id: "4",
    title: "Mixed Salad Bowl",
    image: require("../assets/fried-egg.jpg"),
    items: 3,
    distance: "1.5 km",
    price: 5.0,
  },
  {
    id: "5",
    title: "Dessert Cake",
    image: require("../assets/pizza.jpg"),
    items: 4,
    distance: "2.3 km",
    price: 22.0,
  },
  {
    id: "6",
    title: "Dessert Cake",
    image: require("../assets/cupcakes.jpg"),
    items: 4,
    distance: "2.3 km",
    price: 22.0,
  },
];

const MealDetailScreen = ({ route, navigation }) => {
  const { mealId } = route.params; // Lấy mealId truyền MealsScreen

  // Tìm kiếm
  const selectedMeal = meals.find((meal) => meal.id === mealId);

  return (
    <View style={styles.screen}>
      <Image source={selectedMeal.image} style={styles.image} />
      <Text style={styles.title}>{selectedMeal.title}</Text>
      <Text style={styles.details}>
        {selectedMeal.items} items | {selectedMeal.distance}
      </Text>
      <Text style={styles.price}>Price: ${selectedMeal.price.toFixed(2)}</Text>

      {/* <FlatList
        data={selectedMeal.ingredients} // Giả sử có mảng ingredients trong selectedMeal
        keyExtractor={(item, index) => index.toString()} // Tạo key cho từng mục
        renderItem={renderIngredientItem} // Hàm để hiển thị từng item
        style={styles.ingredientList}
        contentContainerStyle={styles.ingredientListContainer} // Để tùy chỉnh layout
      /> */}
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
  ingredientListContainer: {
    paddingBottom: 16,
  },
  ingredientItem: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  ingredientList: {
    marginTop: 16,
  },
});

export default MealDetailScreen;
