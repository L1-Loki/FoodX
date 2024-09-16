import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const CategoryGridTile = ({ title, image, color, onSelect }) => {
  return (
    <TouchableOpacity style={styles.gridItem} onPress={onSelect}>
      <ImageBackground
        source={image}
        style={styles.bgImage}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    padding: 2,
    margin: 15,
    height: 150,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 6,
  },
  bgImage: {
    flex: 1,
    justifyContent: "center",
  },
  imageStyle: {
    borderRadius: 15,
  },
  innerContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Overlay mờ cho text
    paddingVertical: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});

export default CategoryGridTile;
