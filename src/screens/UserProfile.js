import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  onSnapshot,
  unsubscribeMeals,
} from "firebase/firestore";
import { auth } from "../../firebaseConfig";
import { FontAwesome6, Entypo, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const UserProfile = ({ route }) => {
  const [userProfileData, setUserProfileData] = useState({
    followers: 0,
    following: 0,
    posts: 0,
    addedMeals: [],
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const db = getFirestore();
  const navigation = useNavigation();
  const [meals, setMeals] = useState([]);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const currentUser = auth.currentUser;
  const userId = route.params?.userId || currentUser?.email;
  const isCurrentUser = userId === currentUser?.email;

  useEffect(() => {
    if (userId) {
      const userDocRef = doc(db, "users", userId);
      const currentUserDocRef = doc(db, "users", currentUser.email);

      // Thiết lập listener cho tài liệu người dùng
      const unsubscribeUser = onSnapshot(userDocRef, async (userDoc) => {
        if (userDoc.exists()) {
          // Cập nhật dữ liệu người dùng
          setUserProfileData((prevState) => ({
            ...prevState,
            ...userDoc.data(),
          }));

          // Fetch danh sách món ăn của người dùng
          const mealsCollection = collection(db, "meals");
          const q = query(mealsCollection, where("email", "==", userId));

          // Declare unsubscribeMeals in the outer scope
          let unsubscribeMeals = null;

          // Thiết lập listener cho danh sách món ăn
          unsubscribeMeals = onSnapshot(q, async (mealsSnapshot) => {
            const userMeals = [];

            for (const mealDoc of mealsSnapshot.docs) {
              const mealData = mealDoc.data();
              const reviewsRef = collection(db, "meals", mealDoc.id, "reviews");
              const reviewsSnapshot = await getDocs(reviewsRef);
              const reviews = reviewsSnapshot.docs.map((doc) => doc.data());

              // sum , avg
              const totalRating = reviews.reduce(
                (acc, review) => acc + review.rating,
                0
              );
              const averageRating =
                reviews.length > 0 ? totalRating / reviews.length : 0;

              userMeals.push({
                id: mealDoc.id,
                ...mealData,
                reviews,
                rating: averageRating,
              });
            }

            // update list meal
            setUserProfileData((prevState) => ({
              ...prevState,
              addedMeals: userMeals,
            }));
          });

          // Kiểm tra người dùng hiện tại có theo dõi người dùng này không
          const currentUserDoc = await getDoc(currentUserDocRef);
          if (currentUserDoc.exists()) {
            const followingList = currentUserDoc.data().followingList || [];
            setIsFollowing(followingList.includes(userId));
          }
        } else {
          console.log("No such document!");
        }
      });

      return () => {
        unsubscribeUser(); // Unsubscribe from user document listener
        if (unsubscribeMeals) {
          unsubscribeMeals(); // Unsubscribe from meals listener if it exists
        }
      };
    }
  }, [userId, isCurrentUser]);

  useEffect(() => {
    if (userProfileData.fullName) {
      navigation.setOptions({
        title: userProfileData.fullName,
      });
    }
  }, [userProfileData.fullName, navigation]);

  const handleFollowUser = async () => {
    try {
      const currentUserDoc = await getDoc(doc(db, "users", currentUser.email));
      const currentUserData = currentUserDoc.exists()
        ? currentUserDoc.data()
        : { followingList: [], following: 0 }; // Default if no data

      const followingList = currentUserData.followingList || [];
      const isFollowing = followingList.includes(userId);

      // Immediate UI update
      setIsFollowing(!isFollowing);

      if (isFollowing) {
        // Unfollow logic
        await updateDoc(doc(db, "users", currentUser.email), {
          following: Math.max((currentUserData.following || 0) - 1, 0),
          followingList: arrayRemove(userId),
        });

        await updateDoc(doc(db, "users", userId), {
          followers: Math.max((userProfileData.followers || 0) - 1, 0),
          followersList: arrayRemove(currentUser.email),
        });

        setUserProfileData((prevState) => ({
          ...prevState,
          following: Math.max((prevState.following || 0) - 1, 0),
          followers: Math.max((prevState.followers || 0) - 1, 0),
        }));
      } else {
        // Follow logic
        await updateDoc(doc(db, "users", currentUser.email), {
          following: (currentUserData.following || 0) + 1,
          followingList: arrayUnion(userId),
        });

        await updateDoc(doc(db, "users", userId), {
          followers: (userProfileData.followers || 0) + 1,
          followersList: arrayUnion(currentUser.email),
        });

        setUserProfileData((prevState) => ({
          ...prevState,
          following: (prevState.following || 0) + 1,
          followers: (prevState.followers || 0) + 1,
        }));
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái theo dõi: ", error);
    }
  };

  const handleAddPost = async (newMealData) => {
    try {
      // Đếm số lượng meals của người dùng hiện tại dựa trên email
      const updatedPostsCount = await getPostCountByEmail(
        auth.currentUser.email
      );
      console.log("Adding meal:", newMealData);
      // Cập nhật số bài đăng trong Firestore cho người dùng
      await updateDoc(doc(db, "users", userId), {
        posts: updatedPostsCount,
      });

      // Cập nhật lại trong state
      setUserProfileData((prevState) => ({
        ...prevState,
        posts: updatedPostsCount,
        addedMeals: [...prevState.addedMeals, newMealData], // Thêm món mới vào danh sách món ăn
      }));

      console.log("Post count updated successfully.");
    } catch (error) {
      console.error("Lỗi khi thêm bài viết: ", error);
    }
  };

  // Hàm lấy số bài đăng (meals) dựa trên email người dùng
  const getPostCountByEmail = async (email) => {
    try {
      // Truy vấn để lấy các meals có userEmail trùng với email người dùng
      const q = query(collection(db, "meals"), where("email", "==", email));

      // Lấy danh sách meals thỏa điều kiện
      const querySnapshot = await getDocs(q);

      // Đếm số lượng meals
      const postCount = querySnapshot.size;

      return postCount;
    } catch (error) {
      console.error("Lỗi khi đếm số bài viết: ", error);
      return 0;
    }
  };

  const closeMenu = () => {
    setModalVisible(false);
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<AntDesign key={i} name="star" size={16} color="gold" />);
    }
    // Add half stars
    for (let i = 0; i < halfStars; i++) {
      stars.push(
        <AntDesign key={fullStars + i} name="star" size={16} color="gold" />
      );
    }
    // Add empty stars
    for (let i = 0; i < 5 - fullStars - halfStars; i++) {
      stars.push(
        <AntDesign
          key={fullStars + halfStars + i}
          name="staro"
          size={16}
          color="gold"
        />
      );
    }
    return stars;
  };

  const handleEditProfile = () => {
    navigation.navigate("UserEditScreen", { userId });
  };

  const handleLongPress = (item, event) => {
    setSelectedMeal(item);
    setMenuPosition({
      x: event.nativeEvent.pageX - 50,
      y: event.nativeEvent.pageY - 100,
    });
    setModalVisible(true);
  };

  const handleDelete = async (mealId) => {
    try {
      console.log("Attempting to delete meal with id:", mealId);
      // Xóa món ăn khỏi Firestore
      await deleteDoc(doc(db, "meals", mealId));

      // Cập nhật danh sách meals trong state
      setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId));

      // Đếm lại số lượng bài đăng của người dùng hiện tại
      const updatedPostsCount = await getPostCountByEmail(
        auth.currentUser.email
      );

      // Cập nhật số lượng bài đăng trong Firestore cho người dùng
      await updateDoc(doc(db, "users", userId), {
        posts: updatedPostsCount,
      });

      console.log("Meal deleted successfully.");
    } catch (error) {
      console.error("Lỗi xóa bữa ăn: ", error); // Ghi log lỗi để theo dõi
      Alert.alert("Lỗi", "Không thể xóa bữa ăn.");
    }
  };

  if (!userProfileData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    if (item.type === "profile") {
      return (
        <View style={styles.profileSection}>
          <Image
            source={{ uri: userProfileData.imageUri }}
            style={styles.avatar}
          />
          <Text style={styles.fullName}>{userProfileData.fullName}</Text>
          <Text style={styles.userName}>{userProfileData.userName}</Text>
          {/* <Text style={styles.bio}>{userProfileData.bio} 123</Text> */}
          <View style={styles.statsSection}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{userProfileData.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{userProfileData.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{userProfileData.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>
          <View style={styles.actionsSection}>
            {!isCurrentUser && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleFollowUser}
              >
                <Text style={styles.buttonText}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
            )}

            {isCurrentUser && (
              <>
                <TouchableOpacity
                  style={styles.buttonOutline}
                  onPress={() => {
                    navigation.navigate("AddMeal", {
                      onAddMeal: async (newMealData) => {
                        await handleAddPost(newMealData);
                      },
                    });
                  }}
                >
                  <Text style={styles.buttonOutlineText}>Post</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonOutline}
                  onPress={handleEditProfile}
                >
                  <Text style={styles.buttonOutlineText}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      );
    } else if (item.type === "meal") {
      return (
        <TouchableOpacity
          style={styles.mealItem}
          onPress={() => navigation.navigate("MealDetail", { mealId: item.id })}
          onLongPress={(e) => handleLongPress(item, e)}
        >
          <Image
            source={{ uri: item.image || "https://via.placeholder.com/80" }}
            style={styles.mealImage}
          />
          <View style={styles.mealDetails}>
            <Text style={styles.mealTitle}>{item.title}</Text>
            <View style={styles.location}>
              <Entypo name="location-pin" size={14} color="#555" />
              <Text style={styles.mealMeta}>{item.distance}</Text>
            </View>
            <Text style={styles.mealPrice}>${item.price}</Text>
            <View style={styles.starsContainer}>
              {renderStars(item.rating)}
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };
  const data = [
    { type: "profile", id: "profile" }, // Add a unique id for the profile item
    ...userProfileData.addedMeals.map((meal, index) => ({
      type: "meal",
      id: meal.id,
      ...meal,
    })), // Ensure each meal has an id
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
      />
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.menuContainer,
                  { top: menuPosition.y, left: menuPosition.x },
                ]}
              >
                {isCurrentUser && (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        navigation.navigate("UpdateMeal", {
                          mealId: selectedMeal.id,
                        });
                      }}
                    >
                      <Text style={styles.menuItem}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false); // Đóng modal trước khi thực hiện xóa
                        handleDelete(selectedMeal.id);
                      }}
                    >
                      <Text style={styles.menuItem}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5", // Thay đổi màu nền để tạo sự tươi sáng hơn
    paddingTop: 40,
    padding: 10,
  },
  profileSection: {
    alignItems: "center",
    backgroundColor: "#fff", // Thêm màu nền trắng cho phần thông tin người dùng
    borderRadius: 24,
    padding: 20,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 14,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#ffff", // Thêm đường viền cho ảnh đại diện
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Thay đổi màu sắc cho tên
  },
  userName: {
    fontSize: 18,
    color: "gray",
  },
  bio: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    color: "#666", // Thay đổi màu sắc cho mô tả
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    width: "100%",
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "gray",
  },
  actionsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#1DA1F2",
    padding: 10,
    borderRadius: 24,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: "#1DA1F2",
    padding: 10,
    borderRadius: 24,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonOutlineText: {
    color: "#1DA1F2",
    fontWeight: "bold",
  },
  mealsSection: {
    paddingTop: 20,
  },
  mealItem: {
    flexDirection: "row",
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 3,
    padding: 15,
    alignItems: "center",
  },
  mealImage: {
    width: 110,
    height: 110,
    borderRadius: 24,
    marginRight: 15,
  },
  mealDetails: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  mealMeta: {
    fontSize: 14,
    color: "#555",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "green",
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: "row",
  },
  listContainer: {
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});

export default UserProfile;
