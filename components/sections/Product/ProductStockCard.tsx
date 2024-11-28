import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useAppContext } from "@/context/AppContext";
import { get } from "lodash";
import { formatNumberWithCommas } from "@/utils";

const {width} = Dimensions.get('screen')

const ProductStockCard = ({
  name,
  description,
  price,
  quantity,
  image,
  onAddToCart,
  alcoholPercentage,
  volume,
  measurementUnit,
  showQty,
}) => {
  const { settings } = useAppContext();
  return (
    <View style={styles.card}>
      <View style={{flexDirection: 'row'}}>
        <View>
          <Text style={{ color: "#333", fontSize: 28 }}>{quantity}</Text>
        </View>

        <View style={styles.productDetails}>
          <Text style={styles.productName}>{name}</Text>
          <Text style={styles.productDescription}>
            {alcoholPercentage ? `${alcoholPercentage}% ABV -` : ""}{" "}
            {volume ? `${volume}` : ""}
            {measurementUnit}
          </Text>
          <Text style={styles.productPrice}>
            <Text style={{ fontSize: 9 }}>{get(settings, "currency")}</Text>
            {formatNumberWithCommas(price.toFixed(2))}
          </Text>
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={onAddToCart}>
          <MaterialCommunityIcons name="plus" size={18} color="white" />
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#F0EEFF",
    borderRadius: 12,
    padding: 10,
    margin: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
    width: width / 1 -25,
  },
  productImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
  productDetails: {
    paddingHorizontal: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: "#000",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
  cartButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#333",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  rating: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#FFF",
    marginLeft: 4,
  },
});

export default ProductStockCard;
