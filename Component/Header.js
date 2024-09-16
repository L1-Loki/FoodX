import React from "react";
import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://your-image-url.com" }}
          style={styles.profileImage}
        />
        <Text style={styles.locationText}>Times Square</Text>
        <FontAwesome name="caret-down" size={16} color="green" />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="What are you craving?"
        placeholderTextColor="#ccc"
      />
      <View style={styles.iconsContainer}>
        <FontAwesome name="bell" size={24} color="white" />
        <FontAwesome
          name="shopping-bag"
          size={24}
          color="white"
          style={styles.iconSpacing}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#1b1b1b",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  locationText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#2d2d2d",
    borderRadius: 20,
    color: "white",
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 20,
  },
  iconsContainer: {
    flexDirection: "row",
  },
  iconSpacing: {
    marginLeft: 20,
  },
});

export default Header;
