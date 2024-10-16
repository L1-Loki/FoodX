import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Card } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";

const Notification = ({ route }) => {
  const { followerId } = route.params;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!followerId) {
      console.error("followerId is undefined or null");
      return;
    }

    const db = getFirestore();
    const q = query(
      collection(db, "notifications"),
      where("followerId", "==", followerId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sắp xếp thông báo theo thời gian, thông báo mới nhất ở đầu
      newNotifications.sort(
        (a, b) => b.timestamp?.toDate() - a.timestamp?.toDate()
      );
      setNotifications(newNotifications);
    });

    return () => unsubscribe();
  }, [followerId]);

  const handleNotificationPress = async (notification) => {
    // Chỉ cập nhật isRead khi người dùng nhấn vào thông báo
    if (!notification.isRead) {
      const db = getFirestore();
      const docRef = doc(db, "notifications", notification.id);
      await updateDoc(docRef, { isRead: true });
    }
  };

  const handleDeleteNotification = async (id) => {
    const db = getFirestore();
    await deleteDoc(doc(db, "notifications", id));
  };

  const renderRightActions = (id) => {
    return (
      <TouchableOpacity
        onPress={() => handleDeleteNotification(id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
    );
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <Card style={styles.card}>
          <View style={styles.notificationContainer}>
            {/* Chấm đỏ cho thông báo chưa đọc và chấm xanh cho đã đọc */}
            <View
              style={[
                styles.dot,
                { backgroundColor: item.isRead ? "green" : "red" },
              ]}
            />
            <Card.Content>
              <Text style={styles.notificationText}>{item.message}</Text>
              <Text style={styles.timestamp}>
                {item.timestamp?.toDate().toLocaleString()}
              </Text>
            </Card.Content>
          </View>
        </Card>
      </Swipeable>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>
      {unreadCount > 0 && (
        <Text style={styles.unreadCount}>
          Có {unreadCount} thông báo chưa đọc
        </Text>
      )}
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noNotifications}>Không có thông báo nào.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    paddingTop: 40,
    color: "#333333",
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "#fff",
    padding: 15,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  notificationText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
    color: "#999999",
    marginTop: 5,
  },
  noNotifications: {
    fontSize: 16,
    textAlign: "center",
    color: "#aaaaaa",
    paddingTop: 20,
  },
  unreadCount: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
    height: "85%",
    borderRadius: 24,
    margin: 5,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default Notification;
