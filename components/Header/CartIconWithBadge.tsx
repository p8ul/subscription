import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppContext } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";

const CartIconWithBadge = ({ color = 'black' }: {color?: string}) => {
    const {cart } = useAppContext();
  return (
    <View style={styles.iconContainer}>
     <Ionicons name="cart-outline" size={26} color={color} />
      {cart?.length > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{cart.length}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default CartIconWithBadge;
