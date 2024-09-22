import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Đảm bảo đường dẫn chính xác
import FontAwesome from "@expo/vector-icons/FontAwesome";


const MealsScreen = ({ navigation }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        console.log('Fetching meals...');
        const mealCollection = collection(db, 'meals');
        const mealSnapshot = await getDocs(mealCollection);
        
        console.log('Meal snapshot:', mealSnapshot);
        console.log('Meal snapshot empty:', mealSnapshot.empty);

        if (mealSnapshot.empty) {
          console.log('No meals found.');
          setMeals([]);
          return;
        }

        const mealList = mealSnapshot.docs.map(doc => {
          console.log('Document data:', doc.data());
          return { id: doc.id, ...doc.data() };
        });
        console.log('Fetched meals:', mealList);

        setMeals(mealList);
      } catch (error) {
        console.error("Error fetching meals: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const renderMealItem = ({ item }) => (
    <MealItem
      title={item.title}
      image={item.image}
      items={item.items}
      distance={item.distance}
      price={item.price}
      onSelect={() => navigation.navigate('MealDetail', { mealId: item.id })}
    />
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const MealItem = ({ title, image, items, distance, price, onSelect }) => (
  <TouchableOpacity style={styles.mealItem} onPress={onSelect}>
    <View style={styles.mealInfo}>
      <Image source={{ uri: image }} style={styles.mealImage} />
      <View style={styles.mealDetails}>
        <Text style={styles.mealTitle}>{title}</Text>
        <Text style={styles.mealMeta}>{items} items | {distance}</Text>
        <Text style={styles.mealPrice}>${price}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  mealItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    elevation: 3,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  mealInfo: {
    flexDirection: 'row',
    padding: 10,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  mealDetails: {
    flex: 1,
    marginLeft: 10,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealMeta: {
    color: '#888',
    fontSize: 12,
  },
  mealPrice: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
  },
});

export default MealsScreen;
