import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
            backgroundColor: "#121212",
            borderTopColor: "#7B61FF",
          },
          tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "ellipse-outline"; 

          if (route.name === "home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "search") iconName = focused ? "search" : "search-outline";
          else if (route.name === "profile") iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName} size={26} color={focused ? "#7B61FF" : "#999"} />;
        },
      })}
    />
  );
}
