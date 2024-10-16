import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import i18n from "../locales/18n"; // Đảm bảo đường dẫn đến tệp cấu hình i18n là chính xác
import { useTheme } from "../Theme/ThemeContext";

const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation(); // Hook for translation
  const [language, setLanguage] = useState("en"); // State for language

  const { theme, toggleTheme } = useTheme(); // Lấy themes và hàm toggleTheme từ context

  const handlePress = (setting) => {
    switch (setting.id) {
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

  const settingsData = [
    { id: "5", title: t("Favorites") },
    { id: "6", title: t("Logout") },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <FlatList
        data={settingsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              { backgroundColor: theme.itemBackground, ...theme.itemShadow },
            ]}
            onPress={() => handlePress(item)}
          >
            <Text style={[styles.itemText, { color: theme.textColor }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* <View style={styles.languageButtons}>
        <Text style={[styles.languageText, { color: theme.textColor }]}>
          {language === "en" ? "Language: English" : "Ngôn ngữ: Tiếng Việt"}
        </Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
  item: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "left",
  },
  languageButtons: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  languageText: {
    fontSize: 16,
    fontWeight: "400",
  },
});

export default SettingsScreen;
