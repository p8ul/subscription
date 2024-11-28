import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
const CurrentValueCard: React.FC<{
  totalSales: string;
  cashTotal: string;
  cashlessTotal: string;
}> = ({ totalSales, cashlessTotal, cashTotal }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.currentValueText}>Total Sales</Text>
      <Text style={styles.amountText}>{totalSales}</Text>
      <View style={styles.iconContainer}>
        <MaterialIcons name="trending-up" size={24} color="#333" />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.leftButton]}>
          <FontAwesome5 name="money-bill-wave" size={16} color="white" />
          <Text style={styles.buttonText}>{cashTotal}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.middleButton}>
          <FontAwesome5 name="sync" size={16} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.rightButton]}>
          <MaterialCommunityIcons
            name="credit-card-outline"
            size={16}
            color="white"
          />
          <Text style={styles.buttonText}>{cashlessTotal}</Text>
        </TouchableOpacity>
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

export default CurrentValueCard;
