// themes.js
import { DefaultTheme, DarkTheme } from "react-native-paper";

export const themes = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#6200ee", // Màu chủ đề sáng
      background: "#ffffff", // Nền sáng
      surface: "#ffffff",
      text: "#000000",
      // Thêm các màu khác nếu cần
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: "#bb86fc", // Màu chủ đề tối
      background: "#181a20", // Màu nền tối mới
      surface: "#282c35", // Màu surface cho tối
      text: "#ffffff",
      // Thêm các màu khác nếu cần
    },
  },
};
