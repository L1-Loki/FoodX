import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Appearance,
} from "react-native";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import i18n from "../locales/18n"; // Đảm bảo đường dẫn đến tệp cấu hình i18n là chính xác

const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation(); // Hook for translation
  const colorScheme = Appearance.getColorScheme(); // Get system theme
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const [language, setLanguage] = useState("en"); // State for language

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === "dark");
    });
    return () => listener.remove();
  }, []);

  const handlePress = (setting) => {
    switch (setting.id) {
      case "1":
        setIsDarkMode((prev) => !prev);
        break;
      case "2":
        const newLang = language === "en" ? "vi" : "en";
        switchLanguage(newLang);
        setLanguage(newLang);
        break;
      case "5":
        navigation.navigate("FavoritesScreen");
        break;
      case "6":
        signOut(auth).then(() => {
          navigation.navigate("SignIn");
        });
        break;
      default:
        break;
    }
  };

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang); // Thay đổi ngôn ngữ
  };

  // Cập nhật tiêu đề cho mục DarkMode/LightMode dựa trên trạng thái
  const settingsData = [
    { id: "1", title: isDarkMode ? t("DarkMode") : t("LightMode") },
    { id: "2", title: t("Language") }, // Tiêu đề cho mục Ngôn ngữ
    { id: "5", title: t("Favorites") },
    { id: "6", title: t("Logout") },
  ];

  return (
    <View
      style={[
        styles.screen,
        isDarkMode ? styles.darkScreen : styles.lightScreen,
      ]}
    >
      <FlatList
        data={settingsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              isDarkMode ? styles.darkItem : styles.lightItem,
            ]}
            onPress={() => handlePress(item)}
          >
            <Text
              style={[
                styles.itemText,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.languageButtons}>
        <Text style={isDarkMode ? styles.darkText : styles.lightText}>
          {language === "en"
            ? "Current Language: English"
            : "Ngôn ngữ hiện tại: Tiếng Việt"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  lightScreen: {
    backgroundColor: "#f5f5f5",
  },
  darkScreen: {
    backgroundColor: "#181a20",
  },
  item: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  lightItem: {
    backgroundColor: "#ffffff",
    elevation: 2,
  },
  darkItem: {
    backgroundColor: "#282c35",
    elevation: 4, // Tăng độ nổi cho item tối
  },
  itemText: {
    fontSize: 18,
    fontWeight: "600", // Làm nổi bật chữ
  },
  lightText: {
    color: "#000",
  },
  darkText: {
    color: "#f0f0f0", // Màu chữ sáng cho giao diện tối
  },
  languageButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default SettingsScreen;
