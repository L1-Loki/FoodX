import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native"; // Nhớ import act
import SignInScreen from "../screens/screen_user/SignInScreen"; // Đường dẫn tới file SignInScreen của bạn
import { signInWithEmailAndPassword } from "firebase/auth"; // Import đúng

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

// Mock Firebase signInWithEmailAndPassword
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

describe("SignInScreen", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders correctly", () => {
    const { getByText } = render(<SignInScreen navigation={mockNavigation} />);
    expect(getByText("Let’s you in")).toBeTruthy();
  });

  it("displays error when email or password is empty", async () => {
    const { getByText } = render(<SignInScreen navigation={mockNavigation} />);
    const loginButton = getByText("Login");

    await act(async () => {
      fireEvent.press(loginButton);
    });

    await waitFor(() => {
      expect(getByText("Please enter both email and password.")).toBeTruthy();
    });
  });

  it("handles successful sign in", async () => {
    const { getByText, getByLabelText } = render(<SignInScreen navigation={mockNavigation} />);
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");
    const loginButton = getByText("Login");

    fireEvent.changeText(emailInput, "hungnguyen2003k@gmail.com");
    fireEvent.changeText(passwordInput, "123123");

    // Mock signInWithEmailAndPassword to return a user
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: {
        emailVerified: true,
      },
    });

    await act(async () => {
      fireEvent.press(loginButton);
    });

    await waitFor(() => {
      // Kiểm tra điều hướng tới màn hình Home
      expect(mockNavigate).toHaveBeenCalledWith("Home"); // Đảm bảo rằng bạn thay "Home" bằng tên màn hình đúng
    });
  });

  it("handles error on sign in", async () => {
    const { getByText, getByLabelText } = render(<SignInScreen navigation={mockNavigation} />);
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");
    const loginButton = getByText("Login");

    fireEvent.changeText(emailInput, "wrong@example.com");
    fireEvent.changeText(passwordInput, "wrongpassword");

    // Mock signInWithEmailAndPassword to throw an error
    signInWithEmailAndPassword.mockRejectedValueOnce({
      code: "auth/user-not-found",
    });

    await act(async () => {
      fireEvent.press(loginButton);
    });

    await waitFor(() => {
      expect(getByText("No account found with this email.")).toBeTruthy();
    });
  });
});
