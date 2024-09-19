import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Component để thêm món ăn
const AddMeal = () => {
  const [title, setTitle] = useState("");
  const [distance, setDistance] = useState("");
  const [image, setImage] = useState("");
  const [items, setItems] = useState("");
  const [price, setPrice] = useState("");

  // Hàm để tạo ID tự động
  const generateId = () => Date.now().toString();

  const handleAddMeal = async () => {
    try {
      const id = generateId(); // Tạo ID tự động

      await addDoc(collection(db, "meals"), {
        id, // Thêm ID vào dữ liệu
        title,
        distance,
        image,
        items: Number(items),
        price: Number(price),
      });
      Alert.alert("Success", "Meal added successfully!");
      setTitle("");
      setDistance("");
      setImage("");
      setItems("");
      setPrice("");
    } catch (error) {
      console.error("Error adding meal: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Distance"
        value={distance}
        onChangeText={setDistance}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Items"
        keyboardType="numeric"
        value={items}
        onChangeText={setItems}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <Button title="Add Meal" onPress={handleAddMeal} />
    </View>
  );
};

// Component để cập nhật món ăn
const UpdateMeal = ({ meals, setMeals }) => {
  const [mealId, setMealId] = useState("");
  const [title, setTitle] = useState("");
  const [distance, setDistance] = useState("");
  const [image, setImage] = useState("");
  const [items, setItems] = useState("");
  const [price, setPrice] = useState("");

  const handleUpdateMeal = async () => {
    try {
      const mealRef = doc(db, "meals", mealId);
      await updateDoc(mealRef, {
        title,
        distance,
        image,
        items: Number(items),
        price: Number(price),
      });
      Alert.alert("Success", "Meal updated successfully!");
      // Reset fields
      setMealId("");
      setTitle("");
      setDistance("");
      setImage("");
      setItems("");
      setPrice("");
      // Refresh the meal list
      fetchMeals();
    } catch (error) {
      console.error("Error updating meal: ", error);
    }
  };

  const fetchMeals = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "meals"));
      const mealsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMeals(mealsList);
    } catch (error) {
      console.error("Error fetching meals: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Meal ID"
        value={mealId}
        onChangeText={setMealId}
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Distance"
        value={distance}
        onChangeText={setDistance}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Items"
        keyboardType="numeric"
        value={items}
        onChangeText={setItems}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <Button title="Update Meal" onPress={handleUpdateMeal} />
    </View>
  );
};

// Component để xóa món ăn
const DeleteMeal = ({ fetchMeals }) => {
  const [mealId, setMealId] = useState("");

  const handleDeleteMeal = async () => {
    try {
      const mealRef = doc(db, "meals", mealId);
      await deleteDoc(mealRef);
      Alert.alert("Success", "Meal deleted successfully!");
      setMealId("");
      // Refresh the meal list
      fetchMeals();
    } catch (error) {
      console.error("Error deleting meal: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Meal ID"
        value={mealId}
        onChangeText={setMealId}
      />
      <Button title="Delete Meal" onPress={handleDeleteMeal} />
    </View>
  );
};

// Màn hình Admin chính
const AdminScreenMeal = () => {
  const [currentTab, setCurrentTab] = useState("add");
  const [meals, setMeals] = useState([]);

  const fetchMeals = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "meals"));
      const mealsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMeals(mealsList);
    } catch (error) {
      console.error("Error fetching meals: ", error);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case "add":
        return <AddMeal />;
      case "update":
        return <UpdateMeal meals={meals} setMeals={setMeals} />;
      case "delete":
        return <DeleteMeal fetchMeals={fetchMeals} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.tabs}>
        <Button title="Add Meal" onPress={() => setCurrentTab("add")} />
        <Button title="Update Meal" onPress={() => setCurrentTab("update")} />
        <Button title="Delete Meal" onPress={() => setCurrentTab("delete")} />
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
});

export default AdminScreenMeal;
