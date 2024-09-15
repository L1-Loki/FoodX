import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const MealsScreen = ({ route, navigation }) => {
  const { categoryId } = route.params;

  return (
    <View style={styles.screen}>
      <Text>Món ăn trong danh mục {categoryId}</Text>
      <Button
        title="Xem chi tiết món ăn"
        onPress={() => {
          navigation.navigate("MealDetail", { mealId: 1 }); // Truyền ID món ăn
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MealsScreen;
