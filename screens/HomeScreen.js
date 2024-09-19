import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// Data for categories
const CATEGORIES = [
  { id: "1", title: "Hamburger", image: require("../assets/hamburger.jpg") },
  { id: "2", title: "Pizza", image: require("../assets/pizza.jpg") },
  { id: "3", title: "Noodles", image: require("../assets/Noodles.jpg") },
  { id: "4", title: "Fried Egg", image: require("../assets/fried-egg.jpg") },
  { id: "5", title: "Vegetables", image: require("../assets/salad.jpg") },
  { id: "6", title: "Dessert", image: require("../assets/dessert.jpg") },
  { id: "7", title: "Drink", image: require("../assets/Drink.jpg") },
  { id: "8", title: "Cupcakes", image: require("../assets/cupcakes.jpg") },
];

const HomeScreen = ({ navigation }) => {
  const renderCategoryItem = (itemData) => {
    return (
      <TouchableOpacity style={styles.categoryItem}>
        <Image source={itemData.item.image} style={styles.categoryImage} />
        <Text style={styles.categoryTitle}>{itemData.item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.screen}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://i.pinimg.com/736x/03/eb/d6/03ebd625cc0b9d636256ecc44c0ea324.jpg",
          }}
          style={styles.avatar}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.deliveryText}>Deliver to</Text>
          <Text style={styles.locationText}>Times Square</Text>
        </View>

        <View style={styles.headerRight}>
          <FontAwesome name="bell-o" size={24} color="black" />
          <FontAwesome name="shopping-cart" size={24} color="black" />
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="grey" />
        <TextInput
          placeholder="What are you craving?"
          style={styles.searchInput}
        />
      </View>

      {/* Special Offers Section */}
      <View style={styles.specialOffersContainer}>
        <Text style={styles.sectionTitle}>Special Offers</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.offerCard}>
        <Image
          source={require("../assets/hamburger.jpg")} 
          style={styles.offerImage}
        />
        <View style={styles.offerTextContainer}>
          <Text style={styles.offerText}>30% Discount Only</Text>
          <Text style={styles.offerText}>Valid For Today!</Text>
        </View>
      </View>

      {/* Categories Section */}
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={4} 
        contentContainerStyle={styles.categoriesContainer}
        scrollEnabled={false} 
      />

      <View style={styles.specialOffersContainer}>
        <Text style={styles.sectionTitle}>Discount Guaranteed!</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
  },
  deliveryText: {
    fontSize: 12,
    color: "gray",
  },
  locationText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  chevronIcon: {
    marginLeft: 5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    width: 60,
    justifyContent: "space-between",
  },
  headerTextContainer: {
    justifyContent: "center",
    marginLeft: 20,
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  specialOffersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAllText: {
    fontSize: 14,
    color: "#1e90ff",
  },
  offerCard: {
    backgroundColor: "#00cc66",
    borderRadius: 20,
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  offerImage: {
    width: 150,
    height: 150,
    borderRadius: 15,
    resizeMode: "cover",
  },
  offerTextContainer: {
    marginLeft: 15,
  },
  offerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  categoriesContainer: {
    justifyContent: "space-between",
  },
  categoryItem: {
    flex: 1,
    alignItems: "center",
    marginVertical: 10,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Make images circular
    resizeMode: "cover",
  },
  categoryTitle: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },
});

export default HomeScreen;
