import { AppRegistry, Platform } from "react-native";
import App from "./App"; 
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App); // Sử dụng appName từ app.json

if (Platform.OS === "web") {
  const rootTag =
    document.getElementById("root") || document.getElementById(appName); // Sử dụng appName
  AppRegistry.runApplication(appName, { rootTag });
}
