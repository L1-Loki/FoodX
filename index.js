import { AppRegistry, Platform } from "react-native";
import App from "./App"; // Đảm bảo rằng đường dẫn này đúng với file App của bạn
import { name as appName } from "./app.json"; // Đảm bảo file app.json tồn tại và có thuộc tính name

AppRegistry.registerComponent("X", () => App);

if (Platform.OS === "web") {
  const rootTag =
    document.getElementById("root") || document.getElementById("X");
  AppRegistry.runApplication("X", { rootTag });
}
