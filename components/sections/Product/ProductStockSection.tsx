import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import SearchInput from "../../ui/input/SearchInput";
import CategorySection from "./CategorySection";
import {
  addToCart,
  setCartQuantity,
  setSearchValue,
  useAppContext,
} from "@/context/AppContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import DefaultSnackBar from "../../Modals/DefaultSnackBar";
import useProductQueries from "@/database/hooks/products/useProductQueries";
import { Product } from "@/models/Product";
import { get } from "lodash";
import { useIsFocused } from "@react-navigation/native";
import EmptySearchProduct from "./EmptySearchProduct";
import ProductCard from "./ProductCard";
import ProductStockCard from "./ProductStockCard";

const ProductStockSection = () => {
  const { searchValue, products, dispatch, cart, fetchProducts } =
    useAppContext();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Product added to cart.");
  const [error, setError] = useState(false);
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  const { getProduct } = useProductQueries();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log("Screen is focused");
      fetchProducts(10000, 0);
    } else {
      console.log("Screen is unfocused");
    }
  }, [isFocused]);

  const handleIncrement = async (cartItem: Product) => {
    const id = cartItem.id;
    const item = cart.find((item) => item.id === id);
    const quantity = item?.quantity;
    const productData = await getProduct(id);
    const product: Product = get(productData, "[0]", {}) as Product;
    if (Number(product.quantity) <= Number(quantity)) {
      dispatch(setCartQuantity({ id, quantity: product.quantity }));
      return alert(`Available quantity is ${product.quantity}`);
    }
    dispatch(addToCart(product as Product));
    setMessage("Added to cart");
    setError(false);
    setVisible(true);
  };
  const [isGridView, setIsGridView] = useState(false);
  const numColumns = 1; //isGridView ? 2 : 2;
  return (
    <View style={styles.sectionContainer}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        numColumns={numColumns}
        ListEmptyComponent={<EmptySearchProduct />}
        ListHeaderComponent={
          <>
            <View style={{ flex: 1, marginTop: 10, marginBottom: 10 }}>
              <SearchInput
                placeholder="Search here"
                value={searchValue}
                onSearch={(text) => dispatch(setSearchValue(text))}
              />
            </View>
            {!searchValue ? (
              <View>
                <CategorySection />
              </View>
            ) : null}

            <DefaultSnackBar
              visible={visible}
              onDismiss={() => setVisible(false)}
              title={message}
              error={error}
            />
          </>
        }
        renderItem={({ item }) => (
          <>
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
                  <MaterialCommunityIcons
                    name="cart-outline"
                    size={16}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </>
        )}
      />
    </View>
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

export default ProductStockSection;
