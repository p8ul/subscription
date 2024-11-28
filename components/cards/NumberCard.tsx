import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
const NumberCard: React.FC<{
  numberValue: string | number;
  title: String;
}> = ({ numberValue, title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.currentValueText}>{title}</Text>
      <Text style={styles.amountText}>{numberValue}</Text>
      <View style={styles.iconContainer}>
        <MaterialIcons name="trending-up" size={24} color="#333" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", // Similar to the orange-brown in the example
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  currentValueText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  amountText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  iconContainer: {
    position: "absolute",
    top: 50,
    right: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  leftButton: {
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  middleButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  rightButton: {
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default NumberCard;
