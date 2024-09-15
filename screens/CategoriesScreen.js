import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const CATEGORIES = [
  { id: "1", title: "Italian", color: "#f54242" },
  { id: "2", title: "Quick & Easy", color: "#f5428d" },
  // Thêm các danh mục khác...
];

const CategoryGridTile = ({ title, color, onSelect }) => {
  return (
    <TouchableOpacity
      style={[styles.gridItem, { backgroundColor: color }]}
      onPress={onSelect}
    >
      <View>
        <Text>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const CategoriesScreen = ({ navigation }) => {
  const renderGridItem = (itemData) => {
    return (
      <CategoryGridTile
        title={itemData.item.title}
        color={itemData.item.color}
        onSelect={() => {
          navigation.navigate("Meals", { categoryId: itemData.item.id });
        }}
      />
    );
  };

  return (
    <FlatList data={CATEGORIES} renderItem={renderGridItem} numColumns={2} />
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 15,
    height: 150,
  },
});

export default CategoriesScreen;
