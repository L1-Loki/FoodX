// ThemeContext.js
import React, { createContext, useContext, useState } from "react";
import { DefaultTheme, DarkTheme } from "react-native-paper"; // Đảm bảo bạn đã nhập đúng

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? DarkTheme : DefaultTheme; // Cung cấp theme

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
