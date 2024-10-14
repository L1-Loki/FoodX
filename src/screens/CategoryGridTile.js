import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const CategoryGridTile = ({ title, image, onSelect }) => {
  return (
    <TouchableOpacity style={styles.gridItem} onPress={onSelect}>
      <View style={styles.innerContainer}>
        <Image source={image} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 10,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
});

export default CategoryGridTile;
