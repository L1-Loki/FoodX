import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  getFirestore,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [userInfo, setUserInfo] = useState({ fullName: "", imageUri: "" });
  const [error, setError] = useState("");
  const [meals, setMeals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const user = auth.currentUser;
  const userId = user.email;

  useEffect(() => {
    const db = getFirestore();

    // Lấy thông tin người dùng
    const fetchUserInfo = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserInfo({
            fullName: data.fullName || "No name provided",
            imageUri: data.imageUri || "https://via.placeholder.com/80",
          });
        } else {
          console.log("Không có tài liệu nào!");
          setError("Người dùng không tìm thấy.");
        }
      } catch (err) {
        console.error("Lỗi thông tin người dùng:", err);
        setError("Lỗi thông tin người dùng. Vui lòng thử lại sau.");
      }
    };

    // Lấy thông báo chưa đọc
    const fetchNotifications = async () => {
      try {
        const notificationsSnapshot = await getDocs(
          query(
            collection(db, "notifications"),
            where("followerId", "==", userId)
          )
        );

        const allNotifications = notificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotifications(allNotifications); // Cập nhật state với tất cả thông báo
      } catch (err) {
        console.error("Lỗi lấy thông báo:", err);
      }
    };

    // Lắng nghe thay đổi món ăn
    const unsubscribeMeals = onSnapshot(collection(db, "meals"), (snapshot) => {
      const mealList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMeals(mealList);
    });

    // Lắng nghe thông báo
    const unsubscribeNotifications = onSnapshot(
      query(collection(db, "notifications"), where("followerId", "==", userId)),
      (snapshot) => {
        const allNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(allNotifications); // Cập nhật state với tất cả thông báo
        console.log("Cập nhật thông báo:", allNotifications.length);
      }
    );

    // Gọi các hàm để lấy dữ liệu
    fetchUserInfo();
    fetchNotifications();

    // Hủy lắng nghe khi component unmount
    return () => {
      unsubscribeMeals();
      unsubscribeNotifications();
    };
  }, [userId]);

  const handleCategorySelect = (category) => {
    // Chuyển hướng đến màn hình Meal với danh mục đã chọn
    navigation.navigate("MealScreen", { categoryTitle: category.title });
  };

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
            navigation.navigate("MealsScreen", {
              categoryTitle: itemData.item.title,
            });
          }
        }}
      >
        <Image source={itemData.item.image} style={styles.categoryImage} />
        <Text style={styles.categoryTitle}>{itemData.item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderMealItem = (meal) => (
    <View style={styles.mealCard}>
      <Image source={{ uri: meal.image }} style={styles.mealImage} />
      <Text style={styles.mealTitle}>{meal.title}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.userEditContainer}>
          <Image
            source={{
              uri: userInfo.imageUri || "https://via.placeholder.com/80",
            }}
            style={styles.avatar}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.locationText}>{userInfo.fullName}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Notification", { followerId: userId });
            }}
          >
            <Feather name="bell" size={24} color="black" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="grey" />
        <TextInput
          placeholder="What are you craving?"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={handleSearchSubmit}
        />
      </View>

      <View style={styles.specialOffersContainer}>
        <Text style={styles.sectionTitle}>Special Offers</Text>
        {/* <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity> */}
      </View>
      <View style={[styles.offerCard]}>
        <Image
          source={require("../../assets/hamburger.jpg")}
          style={styles.offerImage}
        />
        {/* <View style={styles.offerTextContainer}>
          <Text style={styles.offerText}>30% Discount Only</Text>
          <Text style={styles.offerText}>Valid For Today!</Text>
        </View> */}
      </View>

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
          <Text
            style={styles.seeAllText}
            onPress={() =>
              navigation.navigate("MealsScreen", {
                showAll: true,
              })
            }
          >
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {meals.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            onPress={() =>
              navigation.navigate("MealDetail", { mealId: meal.id })
            }
          >
            {renderMealItem(meal)}
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRight: {
    alignItems: "flex-end",
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
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  specialOffersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAllText: {
    color: "blue",
  },
  offerCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginVertical: 10,
  },
  offerImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  offerTextContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  offerText: {
    color: "white",
    fontSize: 16,
  },
  categoriesContainer: {
    paddingVertical: 10,
  },
  categoryItem: {
    flex: 1,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  categoryTitle: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  mealCard: {
    backgroundColor: "#fff",
    margin: 5,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    width: 200,
    height: 200,
    borderRadius: 24,
  },
  mealImage: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  headerRight: {
    position: "relative",
    marginRight: 10, // Thêm khoảng cách bên phải
  },
  badge: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#ff3b1f",
    borderRadius: 10,
    padding: 5,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default HomeScreen;
