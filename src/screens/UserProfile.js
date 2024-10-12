import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { auth } from "../../firebaseConfig";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";

const UserProfile = ({ route }) => {
  const [userProfileData, setUserProfileData] = useState({
    followers: 0,
    following: 0,
    posts: 0,
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const db = getFirestore();
  const navigation = useNavigation();

  const currentUser = auth.currentUser;
  const userId = route.params?.userId || currentUser?.email;
  const isCurrentUser = userId === currentUser?.email;

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", userId));
          const currentUserDoc = await getDoc(
            doc(db, "users", currentUser.email)
          );
          if (userDoc.exists()) {
            setUserProfileData((prevState) => ({
              ...prevState,
              ...userDoc.data(),
            }));

            if (currentUserDoc.exists()) {
              const followingList = currentUserDoc.data().followingList || [];
              setIsFollowing(followingList.includes(userId));
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };

      fetchUserData();
    }
  }, [userId]);

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
        : { followingList: [], following: 0 }; // Đảm bảo following là 0 nếu không có dữ liệu

      const followingList = currentUserData.followingList || [];
      const isFollowing = followingList.includes(userId);

      setIsFollowing(!isFollowing); // Update the UI state immediately

      if (isFollowing) {
        // Unfollow
        await updateDoc(doc(db, "users", currentUser.email), {
          following: Math.max((currentUserData.following || 0) - 1, 0), // Tránh NaN
          followingList: arrayRemove(userId),
        });

        await updateDoc(doc(db, "users", userId), {
          followers: Math.max((userProfileData.followers || 0) - 1, 0), // Tránh NaN
          followersList: arrayRemove(currentUser.email),
        });

        setUserProfileData((prevState) => ({
          ...prevState,
          following: Math.max((prevState.following || 0) - 1, 0), // Tránh NaN
          followers: Math.max((prevState.followers || 0) - 1, 0), // Tránh NaN
        }));
      } else {
        // Follow
        await updateDoc(doc(db, "users", currentUser.email), {
          following: (currentUserData.following || 0) + 1, // Đảm bảo following là số
          followingList: arrayUnion(userId),
        });

        await updateDoc(doc(db, "users", userId), {
          followers: (userProfileData.followers || 0) + 1, // Đảm bảo followers là số
          followersList: arrayUnion(currentUser.email),
        });

        setUserProfileData((prevState) => ({
          ...prevState,
          following: (prevState.following || 0) + 1, // Đảm bảo following là số
          followers: (prevState.followers || 0) + 1, // Đảm bảo followers là số
        }));
      }
    } catch (error) {
      console.error("Error updating follow status: ", error);
    }
  };

  const handleAddPost = async () => {
    try {
      const updatedPostsCount = userProfileData.posts + 1;
      await updateDoc(doc(db, "users", userId), {
        posts: updatedPostsCount,
      });
      setUserProfileData((prevState) => ({
        ...prevState,
        posts: updatedPostsCount,
      }));
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate("UserEditScreen", { userId });
  };

  if (!userProfileData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: userProfileData.imageUri }}
          style={styles.avatar}
        />
        <Text style={styles.fullName}>{userProfileData.fullName}</Text>
        <Text style={styles.userName}>{userProfileData.userName}</Text>
        <Text style={styles.bio}>{userProfileData.bio}</Text>
      </View>
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
          <TouchableOpacity style={styles.button} onPress={handleFollowUser}>
            <Text style={styles.buttonText}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.buttonOutline} onPress={handleAddPost}>
          <Text style={styles.buttonOutlineText}>Post</Text>
        </TouchableOpacity>
        {isCurrentUser && (
          <TouchableOpacity
            style={styles.buttonOutline}
            onPress={handleEditProfile}
          >
            <Text style={styles.buttonOutlineText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
  },
  actionsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1DA1F2",
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: "#1DA1F2",
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 40,
  },
  buttonOutlineText: {
    color: "#1DA1F2",
    fontWeight: "bold",
    fontSize: 16,
  },
  edituserSection: {
    alignItems: "flex-end",
    marginBottom: 50,
  },
  edituser: {
    borderWidth: 2,
    borderColor: "#1DA1F2",
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
    color: "#1DA1F2",
  },
});

export default UserProfile;
