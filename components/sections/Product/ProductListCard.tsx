import { router } from "expo-router";
import { View } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ProductListCard = ({
  item,
  handleIncrement,
  setError,
  setMessage,
  setVisible,
}) => {
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productItem}>
        <Image
          source={require("../../../assets/icons/64x64/4.png")}
          style={styles.productImage}
        />

        <View style={styles.productDetails}>
          {/* <Link href={`/product/${item.id}`} asChild> */}
          <Text style={styles.productName}>{item.name}</Text>
          {/* </Link> */}

          <Text style={styles.productAbv}>
            {item.alcoholPercentage}% ABV - {item.volume}
            {item.measurementUnit}
          </Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (item.quantity > 0) {
              handleIncrement(item);
            } else {
              setError(true);
              setMessage("Out of stock!");
              setVisible(true);
            }
          }}
          style={styles.cartButton}
        >
          <MaterialCommunityIcons name="cart-outline" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fdf5f5",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
    width: 100
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#777",
    marginVertical: 4,
    textAlign: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 4,
  },
  cartButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#333",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionContainer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    marginHorizontal: 1,
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  listContainer: {
    paddingBottom: 20,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EEFF",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  productAbv: {
    fontSize: 12,
    color: "#777",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D32F2F",
    marginTop: 2,
  },
  addButton: {
    backgroundColor: "#FFD54F",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ProductListCard;
