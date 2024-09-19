import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore();

const meals = [
  {
    id: "1",
    title: "Mixed Salad Bowl",
    image: require("./assets/Salad.jpg"), // Lưu link hình ảnh
    items: 3,
    distance: "1.5 km",
    price: 18.0,
  },
  {
    id: "2",
    title: "Mixed Salad Bowl",
    image: "path/to/banh_dau.jpg", // Hình ảnh của món ăn
    items: 3,
    distance: "1.5 km",
    price: 8.0,
  },
  {
    id: "3",
    title: "Mixed Salad Bowl",
    image: "path/to/hamburger.jpg", // Hình ảnh của món ăn
    items: 3,
    distance: "1.5 km",
    price: 10.0,
  },
  {
    id: "4",
    title: "Mixed Salad Bowl",
    image: "path/to/fried-egg.jpg", // Hình ảnh của món ăn
    items: 3,
    distance: "1.5 km",
    price: 5.0,
  },
  {
    id: "5",
    title: "Dessert Cake",
    image: "path/to/pizza.jpg",
    items: 4,
    distance: "2.3 km",
    price: 22.0,
  },
  {
    id: "6",
    title: "Dessert Cake",
    image: "path/to/cupcakes.jpg",
    items: 4,
    distance: "2.3 km",
    price: 22.0,
  },
];

const addMealsToFirestore = async () => {
  try {
    meals.forEach(async (meal) => {
      await db.collection('meals').add(meal);
    });
    console.log("Meals added successfully!");
  } catch (error) {
    console.error("Error adding meals: ", error);
  }
};

// Gọi hàm để thêm dữ liệu
addMealsToFirestore();
