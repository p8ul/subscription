import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import _, { get } from "lodash";
import { Box } from "../../ui/box";
import {
  decrementCartItem,
  incrementCartItem,
  removeFromCart,
  setCartQuantity,
  updateModals,
  updateOrder,
  useAppContext,
} from "@/context/AppContext";
import { router } from "expo-router";
import ConfirmModal from "../../Modals/ConfirmModal";
import MainHeader from "../../Header/MainHeader";
import useProductQueries from "@/database/hooks/products/useProductQueries";
import EmptyShoppingList from "./EmptyShoppingList";
import { formatNumberWithCommas } from "@/utils";
import MPesaQRCode from "./MPesaQRCode";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any; // Use a URL or local asset here
}

const CartScreen = () => {
  const { cart, dispatch, modals, order, addOrder, settings } = useAppContext();
  const selectedPayment = _.get(order, "paymentType", "");
  const [modalVisible, setModalVisible] = useState(false);
  const { getProduct } = useProductQueries();

  const setSelectedPayment = (value: string) => {
    dispatch(
      updateOrder({
        ...order,
        paymentType: value,
      })
    );
  };

  const paymentOptions = [
    {
      id: "Cash",
      label: "Cash",
      description: "Pay with cash at delivery",
      icon: <FontAwesome5 name="money-bill-wave" size={20} color="#4CAF50" />,
    },
    {
      id: "Cashless",
      label: "Cashless",
      description: "Use card or mobile payment",
      icon: (
        <MaterialCommunityIcons
          name="credit-card-outline"
          size={24}
          color="#3F51B5"
        />
      ),
    },
  ];

  const handleIncrement = async (id: string, quantity: number) => {
    const productData = await getProduct(id);
    const product: Product = get(productData, "[0]", {}) as Product;
    if (Number(product.quantity) <= Number(quantity)) {
      dispatch(setCartQuantity({ id, quantity: product.quantity }));
      return alert(`Available quantity is ${product.quantity}`);
    }
    dispatch(incrementCartItem(id));
  };

  const calculateSubtotal = () => {
    return _.reduce(
      cart,
      (sum, product) =>
        sum +
        Number(_.get(product, "price", 0)) *
          Number(_.get(product, "quantity", 0)),
      0
    );
  };

  const handleAddOrder = async () => {
    dispatch(updateModals({ ...modals, confirmOrder: true }));
    const orderId = await addOrder({
      ...order,
      products: cart,
      total: totalAmount,
    });
    router.push(`/orders/${orderId}`);
  };

  const tax = 0;
  const deliveryCharge = 0;
  const subtotal = calculateSubtotal();
  const totalAmount = subtotal + tax + deliveryCharge;

  return (
    <Box style={{ marginBottom: 10 }}>
      <MainHeader title="My Cart" rightComponent={<View></View>} />
      <ConfirmModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => handleAddOrder()}
        title="Create Order"
        subTitle={`Are you sure you have been paid ${formatNumberWithCommas(totalAmount)} ${settings.currency}?. Click yes to create a new order.`}
      />
      <FlatList
        data={cart}
        keyExtractor={(item) => String(_.get(item, "id", ""))}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<EmptyShoppingList />}
        ListFooterComponent={
          cart.length !== 0 ? (
            <>
              <View style={styles.containerx}>
                {paymentOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => setSelectedPayment(option.id)}
                    activeOpacity={0.8}
                    style={[
                      styles.optionCard,
                      selectedPayment === option.id && styles.selectedOption,
                    ]}
                  >
                    <View
                      style={{
                        display: "flex",
                        // flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          padding: 5,
                          marginRight: 4,
                        }}
                      >
                        {option.icon}
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.optionLabel}>
                          {String(_.get(option, "label", ""))}
                        </Text>
                        <Text style={styles.optionDescription}>
                          {String(_.get(option, "description", ""))}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              {selectedPayment === get(paymentOptions, "[1].id") ? (
                <MPesaQRCode
                  amount={Number(totalAmount)}
                  accountNumber={get(settings, "accountNumber")}
                  businessNumber={get(settings, "businessNumber")}
                />
              ) : null}

              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryText}>Subtotal</Text>
                  <Text style={styles.summaryAmount}>
                    KSH {subtotal.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryText}>Tax</Text>
                  <Text style={styles.summaryAmount}>KSH {tax.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryText}>Delivery charge</Text>
                  <Text style={styles.summaryAmount}>
                    KSH {deliveryCharge.toFixed(2)}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.totalAmountRow]}>
                  <Text style={styles.totalText}>Total amount</Text>
                  <Text style={styles.totalAmount}>
                    KSH {totalAmount.toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                  }}
                  style={styles.checkoutButton}
                >
                  <Text style={styles.checkoutButtonText}>Create an order</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: 100 }} />
            </>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image
              source={require("../../../assets/icons/64x64/4.png")}
              style={styles.productImage}
            />
            <View style={styles.detailsContainer}>
              <Text style={styles.productName}>
                {String(_.get(item, "name", "Unknown"))}
              </Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(removeFromCart(_.get(item, "id", "")))
                  }
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>
                  {String(_.get(item, "quantity", 0))}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    handleIncrement(
                      _.get(item, "id", ""),
                      _.get(item, "quantity", "")
                    );
                  }}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.productPrice}>
                KSH{" "}
                {(
                  Number(_.get(item, "price", 0)) *
                  Number(_.get(item, "quantity", 0))
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  containerx: {
    marginTop: 10,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    borderColor: "black",
    backgroundColor: "#E8EAF6",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  optionDescription: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    // padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  paymentText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  paymentOptions: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
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
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingBottom: 20,
    marginVertical: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  summaryText: {
    fontSize: 16,
    color: "#555",
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  totalAmountRow: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  checkoutButton: {
    backgroundColor: "#333",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default CartScreen;
