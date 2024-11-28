import { updateModals, useAppContext } from "@/context/AppContext";
import React, { Component, useState } from "react";
import {
    Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const { height } = Dimensions.get('window');
const OrderModal = () => {
  const { cart, dispatch, modals } = useAppContext();
  const [selectedPayment, setSelectedPayment] = useState("Credit Card");

  return (
    <View style={{ marginTop: 22, height: "70%" }}>
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={modals.confirmOrder}
        onRequestClose={() => {
          dispatch(updateModals({ ...modals, confirmOrder: false }));
        }}
        style={{ height: "70%" }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.header}>Checkout</Text>

            {/* Payment Section */}
            <Text style={styles.sectionTitle}>Payment</Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => setSelectedPayment("Credit Card")}
              >
                <Ionicons name="card" size={24} color="#FF5F00" />
                <Text style={styles.paymentText}>Credit Card</Text>
                {selectedPayment === "Credit Card" && (
                  <Ionicons name="radio-button-on" size={20} color="#000" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => setSelectedPayment("PayPal")}
              >
                <Ionicons name="logo-paypal" size={24} color="#003087" />
                <Text style={styles.paymentText}>PayPal</Text>
                {selectedPayment === "PayPal" && (
                  <Ionicons name="radio-button-on" size={20} color="#000" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => setSelectedPayment("Apple Pay")}
              >
                <Ionicons name="logo-apple" size={24} color="#000" />
                <Text style={styles.paymentText}>Apple Pay</Text>
                {selectedPayment === "Apple Pay" && (
                  <Ionicons name="radio-button-on" size={20} color="#000" />
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.paymentOption}>
                <Ionicons
                  name="ellipsis-horizontal-circle"
                  size={24}
                  color="#000"
                />
                <Text style={styles.paymentText}>All 15 methods</Text>
                <Ionicons name="chevron-forward" size={20} color="#000" />
              </TouchableOpacity>
            </View>

           

            {/* Total and Pay Button */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalAmount}>$730.00</Text>
            </View>
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //     flex: 1,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //   },
  openButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
  },
  openButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.1)", // semi-transparent background
  },
  modalContainer: {
    height: height * 0.5, // Half of the screen height
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    // paddingHorizontal: 16,
    // paddingBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    // marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  paymentOptions: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
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
  cardInfo: {
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    alignItems: "center",
  },
  cardLabel: {
    color: "#A5A5A5",
    fontSize: 12,
    marginBottom: 5,
  },
  cardName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardNumber: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 5,
  },
  shippingInfo: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 8,
  },
  shippingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  shippingTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  editText: {
    fontSize: 14,
    color: "#FF5F00",
  },
  shippingName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  shippingAddress: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  shippingPhone: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  payButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderModal;
