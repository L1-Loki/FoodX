import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Entypo from "@expo/vector-icons/Entypo";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-paper";
import { auth } from "../../firebaseConfig"; // Ensure Firebase Authentication is imported
import DateTimePicker from "@react-native-community/datetimepicker"; // Import DateTimePicker
import Fontisto from "@expo/vector-icons/Fontisto";

const UserEditScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false); // State for showing DateTimePicker

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(getFirestore(), "users", user.email);
        const userData = await getDoc(userDocRef);

        if (userData.exists()) {
          const userInfo = userData.data();
          setName(userInfo.fullName || "");
          setDob(
            userInfo.dob ? new Date(userInfo.dob.seconds * 1000) : new Date()
          );
          setPhone(userInfo.phoneNumber || "");
          setEmail(userInfo.email || "");
          setGender(userInfo.gender || "");
          setImageUri(userInfo.imageUri || "");
        } else {
          Alert.alert("Error", "User not found.");
        }
      } else {
        Alert.alert("Error", "User not authenticated.");
      }
    };

    fetchUserData();
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      uploadImage(uri);
    }
  };

  const uploadImage = async (uri) => {
    const storage = getStorage();
    const imageRef = ref(storage, `userImages/${new Date().getTime()}.jpg`);

    const response = await fetch(uri);
    const blob = await response.blob();

    try {
      const snapshot = await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(snapshot.ref);
      setImageUri(url);
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(getFirestore(), "users", user.email);

      try {
        await updateDoc(userDocRef, {
          fullName: name,
          dob: { seconds: Math.floor(dob.getTime() / 1000) },
          phoneNumber: phone,
          email,
          gender,
          imageUri,
        });
        Alert.alert("Information Saved", "Your information has been updated!");
        navigation.goBack();
      } catch (error) {
        console.error("Error updating document: ", error);
        Alert.alert("Error", "Failed to save information.");
      }
    } else {
      Alert.alert("Error", "User not authenticated.");
    }
  };

  const showDatePickerDialog = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false); // Đóng picker khi không chọn ngày
      return;
    }

    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  // Giá trị hợp lệ cho dob
  const validDob = dob instanceof Date && !isNaN(dob) ? dob : new Date();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePick}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Image
              source={{
                uri: "https://i.pinimg.com/736x/03/eb/d6/03ebd625cc0b9d636256ecc44c0ea324.jpg",
              }}
              style={styles.avatar}
            />
            <Entypo name="pencil" size={24} color="black" style={styles.icon} />
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        label="Full Name"
        mode="outlined"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity onPress={showDatePickerDialog}>
        <View style={styles.dateInputContainer}>
          <Text style={styles.dateInput}>
            {dob ? dob.toLocaleDateString() : "Select date"}
          </Text>
          <Fontisto
            name="date"
            size={24}
            color="black"
            style={styles.datePickerIcon}
          />
        </View>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={validDob}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <TextInput
        label="Phone Number"
        mode="outlined"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        label="Email"
        mode="outlined"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Select your gender" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 100,
  },
  input: {
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  icon: {
    position: "absolute",
    right: -30,
    bottom: 5,
  },
  dateInput: {
    flex: 1,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  datePickerIcon: {
    marginLeft: 10,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#00cc66",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default UserEditScreen;
