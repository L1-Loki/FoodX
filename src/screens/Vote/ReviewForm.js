import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const ReviewForm = ({ route, navigation }) => {
  const { mealId, email } = route.params; // Receive email instead of userId
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [creatorFullName, setCreatorFullName] = useState("");
  const [sortRating, setSortRating] = useState(0);
  const [userFullName, setUserFullName] = useState(""); // State to store user's fullName

  useEffect(() => {
    // Fetch thông tin của người dùng hiện tại từ Firestore bằng email
    const fetchUserFullName = async () => {
      try {
        const userDocRef = doc(db, "users", email);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserFullName(userData.fullName);
        } else {
          console.log("Không tìm thấy tài liệu người dùng!");
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng: ", error);
      }
    };

    // Lắng nghe cập nhật từ Firestore cho review của bữa ăn
    const reviewsCollectionRef = collection(db, "meals", mealId, "reviews");
    const unsubscribe = onSnapshot(reviewsCollectionRef, (snapshot) => {
      const fetchedReviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(fetchedReviews);
    });

    // Gọi hàm fetch user info
    fetchUserFullName();

    // Hủy đăng ký listener khi component bị hủy
    return () => unsubscribe();
  }, [mealId, email]);

  const submitReview = async () => {
    if (rating === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn đánh giá.");
      return;
    }

    const newReview = {
      email: email || "",
      fullName: userFullName || "",
      rating,
      reviewText: reviewText || "",
      date: new Date().toLocaleString(),
    };

    try {
      const reviewsCollection = collection(db, "meals", mealId, "reviews");
      const userReview = reviews.find((review) => review.email === email);

      if (userReview) {
        // Cập nhật review đã có
        const reviewDocRef = doc(reviewsCollection, userReview.id);
        await setDoc(reviewDocRef, newReview);
        Alert.alert("Thành công", "Đánh giá của bạn đã được cập nhật.");
      } else {
        // Thêm mới review
        await addDoc(reviewsCollection, newReview);
        Alert.alert("Thành công", "Đánh giá của bạn đã được gửi.");
      }

      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá: ", error);
      Alert.alert("Lỗi", "Không thể gửi đánh giá.");
    }
  };

  const handleSortRating = (value) => {
    setSortRating(value);
  };

  // Filter reviews based on rating
  const filteredReviews = reviews.filter(
    (review) => sortRating === 0 || review.rating === sortRating
  );
  const renderForm = () => <></>;
  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewUser}>{item.fullName}</Text>
      <Text style={styles.reviewRating}>Rating: {item.rating} ★</Text>
      <Text style={styles.reviewText}>{item.reviewText}</Text>
      <Text style={styles.reviewDate}>{item.date}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.sortContainer}>
        <FlatList
          data={[0, 1, 2, 3, 4, 5]}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSortRating(item)}
              style={styles.sortButton}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortRating === item && styles.selectedButtonText,
                ]}
              >
                {item === 0 ? "All" : `${item} Star${item > 1 ? "s" : ""}`}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.toString()}
          horizontal
        />
      </View>
      <View style={styles.ratingContainer}>
        <FlatList
          data={[1, 2, 3, 4, 5]}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setRating(item)}
              style={styles.starContainer}
            >
              <MaterialIcons
                name="star"
                size={30}
                color={item <= rating ? "gold" : "#ccc"}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Write your review..."
        value={reviewText}
        onChangeText={setReviewText}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <FlatList
        data={[...filteredReviews, { isForm: true }]}
        renderItem={({ item }) =>
          item.isForm ? renderForm() : renderReviewItem({ item })
        }
        keyExtractor={(item, index) =>
          item.isForm ? `form-${index}` : item.id
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 5,
    marginRight: 10,
  },
  sortButtonText: {
    color: "#007BFF",
  },
  selectedButtonText: {
    fontWeight: "bold",
    color: "gold",
  },
  ratingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  starContainer: {
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 24,
    padding: 10,
    marginBottom: 20,
    height: 100,
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  reviewItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 10,
  },
  reviewUser: {
    fontWeight: "bold",
  },
  reviewRating: {
    color: "#FFA500",
  },
  reviewText: {
    marginVertical: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: "#aaa",
  },
});

export default ReviewForm;
