// theme.js
const lightTheme = {
  background: "#f5f5f5",
  itemBackground: "#ffffff",
  textColor: "#000",
  itemShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
};

const darkTheme = {
  background: "#181a20",
  itemBackground: "#282c35",
  textColor: "#f0f0f0",
  itemShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
};

// Xuất đối tượng theme mặc định
const theme = {
  lightTheme,
  darkTheme,
};

export default theme;
