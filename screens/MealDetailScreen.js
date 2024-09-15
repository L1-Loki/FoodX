import React, { useLayoutEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const MealDetailScreen = ({ route, navigation }) => {
  const { mealId } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Chi tiết món ăn ${mealId}`,
    });
  }, [navigation, mealId]);

  return (
    <View style={styles.screen}>
      <Text>Chi tiết món ăn {mealId}</Text>
      <Button title="Thêm vào Yêu thích" onPress={() => {}} />
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

export default MealDetailScreen;
