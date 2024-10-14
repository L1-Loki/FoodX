import React, { useLayoutEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import CategoryGridTile from "./CategoryGridTile"; // Import your CategoryGridTile component

const CATEGORIES = [
  {
    id: "1",
    title: "Hamburger",
    image: require("../../assets/hamburger_3300650.png"),
  },
  { id: "2", title: "Pizza", image: require("../../assets/pizza_3595455.png") },
  {
    id: "3",
    title: "Noodles",
    image: require("../../assets/noodles_1531382.png"),
  },
  {
    id: "4",
    title: "Meat",
    image: require("../../assets/ham-leg_12480739.png"),
  },
  {
    id: "5",
    title: "Vegetables",
    image: require("../../assets/vegetables_4251938.png"),
  },
  {
    id: "6",
    title: "Dessert",
    image: require("../../assets/piece-cake_10636732.png"),
  },
  {
    id: "7",
    title: "Drink",
    image: require("../../assets/cocktail_2039730.png"),
  },
  {
    id: "8",
    title: "Bread",
    image: require("../..//assets/bakery_992710.png"),
  },

  {
    id: "9",
    title: "Rice",
    image: require("../../assets/rice-bowl_4545214.png"),
  },
  {
    id: "10",
    title: "Cheese",
    image: require("../../assets/cheese_590706.png"),
  },
  {
    id: "11",
    title: "Sushi",
    image: require("../../assets/sushi_2252075.png"),
  },
  {
    id: "12",
    title: "Other",
    image: require("../../assets/more.png"),
  },
];

const CategoriesScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Categories",
    });
  }, [navigation]);

  const renderGridItem = (itemData) => {
    return (
      <CategoryGridTile
        style={styles.container}
        title={itemData.item.title}
        image={itemData.item.image}
        onSelect={() => {
          if (itemData.item.id === "12") {
            navigation.navigate("MealsScreen", {
              showAll: true,
            });
          } else {
            navigation.navigate("MealsScreen", {
              categoryTitle: itemData.item.title,
              categoryId: itemData.item.id,
              showAll: false,
            });
          }
        }}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={CATEGORIES}
        renderItem={renderGridItem}
        numColumns={4}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    width: 40,
    height: 40,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 50,
  },
});

export default CategoriesScreen;
