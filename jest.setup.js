import "react-native-gesture-handler/jestSetup";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

// Mock toàn bộ module firebase/auth
jest.mock("firebase/auth", () => {
  return {
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    getReactNativePersistence: jest.fn(() => jest.fn()), // Mock getReactNativePersistence
    // Bạn có thể thêm các hàm khác nếu cần thiết
  };
});
