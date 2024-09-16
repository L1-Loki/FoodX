import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Giả định dữ liệu mẫu cho các món ăn
const MEALS = [
  {
    id: "1",
    title: "Mixed Salad Bowl",
    image: require("../assets/salad.jpg"), // Hình ảnh của món ăn
    items: 3,
    distance: "1.5 km",
    price: 18.0,
  },
  {
    id: "2",
    title: "Mixed Salad Bowl",
    image: require("../assets/banh_dau.jpg"), // Hình ảnh của món ăn
    items: 3,
    distance: "1.5 km",
    price: 8.0,
  },
  {
    id: "3",
    title: "Mixed Salad Bowl",
    image: require("../assets/hamburger.jpg"), // Hình ảnh của món ăn
    items: 3,
    distance: "1.5 km",
    price: 10.0,
  },
  {
    id: "4",
    title: "Mixed Salad Bowl",
    image: require("../assets/fried-egg.jpg"), // Hình ảnh của món ăn
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

const MealItem = ({ title, image, items, distance, price, onSelect }) => {
  return (
    <TouchableOpacity style={styles.mealItem} onPress={onSelect}>
      <View style={styles.mealInfo}>
        <Image source={image} style={styles.mealImage} />
        <View style={styles.mealDetails}>
          <Text style={styles.mealTitle}>{title}</Text>
          <Text style={styles.mealMeta}>
            {items} items | {distance}
          </Text>
          <Text style={styles.mealPrice}>${price.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MealsScreen = ({ route, navigation }) => {
  const { categoryId } = route.params;

  const renderMealItem = (itemData) => {
    return (
      <MealItem
        title={itemData.item.title}
        image={itemData.item.image}
        items={itemData.item.items}
        distance={itemData.item.distance}
        price={itemData.item.price}
        onSelect={() => {
          navigation.navigate("MealDetail", { mealId: itemData.item.id });
        }}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={MEALS}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id}
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
});

export default MealsScreen;
