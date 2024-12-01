import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const { height: deviceHeight } = Dimensions.get("window");

const EmptySubscription = ({ addProduct }) => {
  return (
    <View style={styles.container}>
      {/* Placeholder for the illustration */}
      <View style={styles.illustration}>
        <Ionicons name="storefront-outline" size={34} color="white" />
      </View>

      <Text style={styles.title}>Add New</Text>
      <Text style={styles.subtitle}>
        Click the button below to add a new subscription 
      </Text>

      <TouchableOpacity style={styles.button} onPress={addProduct}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#403c3c",
    padding: 20,
    height: deviceHeight / 4,
    borderRadius: 10
  },
  illustration: {
    marginBottom: 30,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
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

export default EmptySubscription;
