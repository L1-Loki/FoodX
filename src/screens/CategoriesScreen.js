import React, { useLayoutEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import CategoryGridTile from "./CategoryGridTile"; // Import your CategoryGridTile component

const CATEGORIES = [
  {
    id: "1",
    title: "Italian",
    image: require("../../assets/cupcakes.jpg"),
  },
  {
    id: "2",
    title: "Quick Easy",
    image: require("../../assets/pizza.jpg"),
  },
  {
    id: "3",
    title: "Breakfast",
    image: require("../../assets/fried-egg.jpg"),
  },
  {
    id: "4",
    title: "Dessert",
    image: require("../../assets/salad.jpg"),
  },
  {
    id: "5",
    title: "Vegan",
    image: require("../../assets/banh_dau.jpg"),
  },
  {
    id: "6",
    title: "Gluten Free",
    image: require("../../assets/hamburger.jpg"),
  },
  // Add more categories if needed
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
          navigation.navigate("Meals", {
            categoryId: itemData.item.id,
          });
        }}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={CATEGORIES}
        renderItem={renderGridItem}
        numColumns={2}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 40, 
  },
  container: {
    paddingVertical: 10,
  },
});

export default CategoriesScreen;
