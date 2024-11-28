import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Dimensions } from "react-native";
import { router } from "expo-router";

const { height: deviceHeight } = Dimensions.get("window");

const EmptyShoppingList = () => {
  return (
    <View style={styles.container}>
      {/* Placeholder for the illustration */}
      <View style={styles.illustration}>
        <MaterialIcons name="remove-shopping-cart" size={44} color="black" />
      </View>

      <Text style={styles.title}>Your cart is Empty</Text>
      <Text style={styles.subtitle}>
        Search for items to start adding them to your list
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => {
        router.push('home')
      }}>
        <Text style={styles.buttonText}>Search Store</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    height: deviceHeight / 2 + 200,
  },
  illustration: {
    marginBottom: 30,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EmptyShoppingList;
