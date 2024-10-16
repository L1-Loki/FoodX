// HomeScreen.test.js

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { HomeScreen } from "../screens/HomeScreen"; // Adjust the import based on your file structure
import { db, auth } from "../../firebaseConfig"; // Ensure this is correct
import { collection, getDocs } from "firebase/firestore";

jest.mock("../../firebaseConfig", () => ({
  db: {},
  auth: {
    currentUser: { email: "test@example.com" },
  },
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(),
}));

describe("HomeScreen", () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    // Mock the data returned from Firestore
    getDocs.mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({ title: "Pizza", image: "pizza_url" }),
        },
        {
          id: "2",
          data: () => ({ title: "Burger", image: "burger_url" }),
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", async () => {
    const { getByPlaceholderText, getByText } = render(
      <HomeScreen navigation={mockNavigation} />
    );

    // Check if the search input is rendered
    expect(getByPlaceholderText("What are you craving?")).toBeTruthy();

    // Wait for meals to be fetched and check if the titles are displayed
    await waitFor(() => {
      expect(getByText("Pizza")).toBeTruthy();
      expect(getByText("Burger")).toBeTruthy();
    });
  });

  it("navigates to MealScreen when a category is pressed", async () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      const categoryButton = getByText("Pizza"); // Adjust to match your category title
      fireEvent.press(categoryButton);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith("MealsScreen", {
      categoryTitle: "Pizza",
    });
  });

  it("shows an alert if the search input is empty", async () => {
    const { getByPlaceholderText, getByText } = render(
      <HomeScreen navigation={mockNavigation} />
    );
    const searchInput = getByPlaceholderText("What are you craving?");

    fireEvent.changeText(searchInput, ""); // Simulate an empty input
    fireEvent.submitEditing(searchInput);

    // Check for alert (you may want to implement a mock for Alert.alert if necessary)
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("SearchScreen", {
        query: "",
      });
    });
  });
});
