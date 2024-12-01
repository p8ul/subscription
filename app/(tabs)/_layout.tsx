import "@/global.css";
import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import CartIconWithBadge from "@/components/Header/CartIconWithBadge";

// Create a client

export default function RootLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "product":
              iconName = focused ? "add-circle" : "add-circle-outline";
              break;
            case "settings":
              iconName = focused ? "settings-sharp" : "settings-outline";
              break;
            case "users":
              iconName = focused ? "person" : "person-outline";
              break;
            // return <CartIconWithBadge color={color} />;
            case "orders":
              iconName = focused ? "list" : "list-outline";
              break;
            case "profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          // Return the icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="users" options={{ title: "Users" }} />
      <Tabs.Screen name="product" options={{ title: "Product" }} />

      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
