import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import translate from "google-translate-api";

const TranslateExample = () => {
  const [translatedText, setTranslatedText] = useState("");

  const handleTranslate = async () => {
    try {
      const res = await translate("Hello, world!", { to: "vi" });
      setTranslatedText(res.text); // Đặt văn bản đã dịch
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  return (
    <View>
      <Button title="Translate to Vietnamese" onPress={handleTranslate} />
      <Text>{translatedText}</Text>
    </View>
  );
};

export default TranslateExample;
