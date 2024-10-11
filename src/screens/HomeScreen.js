import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert, // Thêm Alert để hiển thị thông báo lỗi
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "../Theme/ThemeContext";

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
  { id: "8", title: "More", image: require("../../assets/more.png") },
];

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái query tìm kiếm

  // Xử lý tìm kiếm và chuyển hướng sang màn hình SearchScreen
  const handleSearchSubmit = () => {
    if (searchQuery.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập từ khóa tìm kiếm.");
      return;
    }

    navigation.navigate("SearchScreen", { query: searchQuery });
  };

  const renderCategoryItem = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => {
          if (itemData.item.title === "More") {
            navigation.navigate("Categories");
          } else {
            // Thực hiện hành động khác nếu cần cho các mục khác
          }
        }}
      >
        <Image source={itemData.item.image} style={styles.categoryImage} />
        <Text style={styles.categoryTitle}>{itemData.item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.userEditContainer}>
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
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <FontAwesome name="bell-o" size={24} color="black" />
          <FontAwesome name="shopping-cart" size={24} color="black" />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="grey" />
        <TextInput
          placeholder="What are you craving?"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={handleSearchSubmit} // Thực hiện tìm kiếm khi nhấn Enter
        />
      </View>

      {/* Special Offers Section */}
      <View style={styles.specialOffersContainer}>
        <Text style={styles.sectionTitle}>Special Offers</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[styles.offerCard, { backgroundColor: theme.colors.primary }]}
      >
        <Image
          source={require("../../assets/hamburger.jpg")}
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
    borderRadius: 25,
    marginRight: 10,
  },
  deliveryText: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    width: 60,
    justifyContent: "space-between",
  },
  headerTextContainer: {
    justifyContent: "center",
    marginLeft: 10,
  },
  userEditContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
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
    paddingHorizontal: 5,
  },
  categoryImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  categoryTitle: {
    marginTop: 7,
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default HomeScreen;
