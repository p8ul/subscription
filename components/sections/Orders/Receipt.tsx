import MainHeader from "@/components/Header/MainHeader";
import { useAppContext } from "@/context/AppContext";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { get } from "lodash";
import React, { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Dimensions } from "react-native";
const { height: deviceHeight, width: deviceWidth } = Dimensions.get("window");
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { formatNumberWithCommas } from "@/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import useOrderQueries from "@/database/hooks/orders/useOrderQueries";
import { router } from "expo-router";

const Receipt: React.FC<{ id: String; order: Order; products: Product[] }> = ({
  id,
  order,
  products,
}) => {
  const calculateTotal = () => {
    return products
      .reduce((sum, item) => sum + item.quantity * item.price, 0)
      .toFixed(2);
  };
  const [modalVisible, setModalVisible] = useState(false);

  const { settings } = useAppContext();
  const tax = 0; // Assuming a tax rate of 6.6%
  const grandTotal = (parseFloat(calculateTotal()) + parseFloat(tax)).toFixed(
    2
  );

  const { deleteOrder } = useOrderQueries();

  const handleDeleteOrder = async () => {
    await deleteOrder(Number(id));
    router.push("/orders");
  };

  const generateAndSharePDF = async () => {
    try {
      const productRows = products
        .map(
          (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.quantity}</td>
            <td>${item.name}</td>
            <td>${formatNumberWithCommas(item.price.toFixed(2))}</td>
          </tr>`
        )
        .join("");

      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
                color: #333;
              }
              .header {
                text-align: center;
                padding: 20px;
                background-color: #4CAF50;
                color: white;
                margin-bottom: 20px;
              }
              h2, h4 {
                margin: 0;
                padding: 5px 0;
              }
              .summary-table, .product-table {
                width: 90%;
                margin: 20px auto;
                border-collapse: collapse;
                background-color: #fff;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                border-radius: 5px;
              }
              .summary-table th, .summary-table td, .product-table th, .product-table td {
                padding: 12px;
                text-align: left;
                border: 1px solid #ddd;
              }
              .summary-table th {
                background-color: #007BFF;
                color: white;
              }
              .product-table th {
                background-color: #6C757D;
                color: white;
              }
              .summary-total {
                font-weight: bold;
              }
              .product-table tr:nth-child(even) {
                background-color: #f2f2f2;
              }
              .summary-total td {
                font-size: 16px;
                font-weight: bold;
                color: #4CAF50;
              }
              footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${get(settings, "storeName")}</h2>
              <h4>Order #${id} Receipt</h4>
              <p>${get(order, "createdAt")}</p>
            </div>
            <table class="summary-table">
              <tr>
                <th>Category</th>
                <th>Amount (${get(settings, "currency")})</th>
              </tr>
              <tr>
                <td>Total</td>
                <td>${formatNumberWithCommas(calculateTotal())}</td>
              </tr>
              <tr>
                <td>Tax</td>
                <td>${tax}</td>
              </tr>
              <tr class="summary-total">
                <td>Grand Total</td>
                <td>${grandTotal}</td>
              </tr>
            </table>
            <table class="product-table">
              <tr>
                <th>#</th>
                <th>Qty</th>
                <th>Item</th>
                <th>Price</th>
              </tr>
              ${productRows}
            </table>
            <footer>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </footer>
          </body>
        </html>`;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      await shareAsync(uri);
      Alert.alert("PDF Generated", "The PDF has been successfully shared!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader
        title={`Order #${id}`}
        rightComponent={
          <View>
            <TouchableOpacity
              onPress={generateAndSharePDF}
              style={{
                backgroundColor: "#333",
              }}
            >
              <MaterialCommunityIcons
                name="file-pdf-box"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        }
      />
      <View style={styles.receiptContainer}>
        <FlatList
          data={products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Text style={styles.itemName}>
                {item.name} ({item.volume || ""}
                {item.measurementUnit || ""} )
              </Text>
              <Text style={styles.price}>
                {formatNumberWithCommas(item.price.toFixed(2))}
              </Text>
            </View>
          )}
          ListHeaderComponent={
            <>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  borderBottomColor: "#EFEFEF",
                  borderBottomWidth: 0.5,
                  padding: 5,
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Text
                  style={{ color: "#333", fontSize: 18, fontWeight: "500" }}
                >
                  {settings.storeName}
                </Text>
                <View>
                  <Text>{get(order, "createdAt")}</Text>
                </View>
                <View style={{ position: "absolute", right: 10 }}>
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <MaterialIcons
                      name="delete-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <ConfirmModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={() => handleDeleteOrder()}
                title="Create Order"
                subTitle={`Are you sure want to delete this order #${formatNumberWithCommas(id)}?`}
              />
              <View style={styles.headerRow}>
                <Text style={styles.headerText}>Qty.</Text>
                <Text style={styles.headerText}>Item(s)</Text>
                <Text style={styles.headerText}>
                  Price ({get(settings, "currency")})
                </Text>
              </View>
            </>
          }
          ListFooterComponent={
            <>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                  position: "relative",
                  height: 50,
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#EFEFEF",
                    borderRadius: 50,
                    position: "absolute",
                    left: -25,
                  }}
                ></View>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    position: "relative",
                  }}
                >
                  <View
                    style={{
                      borderColor: "#EFEFEF",
                      borderWidth: 5,
                      width: deviceWidth - 70,
                      borderStyle: "dotted",
                    }}
                  />
                </View>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#EFEFEF",
                    borderRadius: 50,
                    position: "absolute",
                    right: -25,
                  }}
                ></View>
              </View>
              <View style={styles.footer}>
                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Total</Text>
                  <Text style={styles.footerText}>
                    {formatNumberWithCommas(calculateTotal())}
                  </Text>
                </View>
                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Tax</Text>
                  <Text style={styles.footerText}>{tax}</Text>
                </View>
                <View style={[styles.footerRow, styles.grandTotalRow]}>
                  <Text style={styles.grandTotalText}>Total</Text>
                  <Text style={styles.grandTotalText}>
                    {get(settings, "currency")}
                    {formatNumberWithCommas(grandTotal)}
                  </Text>
                </View>
              </View>
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  downloadText: {
    color: "white",
    marginLeft: 5,
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    height: deviceHeight,
  },
  receiptContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    elevation: 3,
    shadowRadius: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    alignContent: "center",
    height: deviceHeight - 300,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 10,
  },
  headerText: {
    fontWeight: "bold",
    color: "#333",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    padding: 10,
  },
  qty: {
    width: "10%",
    textAlign: "left",
    color: "#333",
  },
  itemName: {
    width: "70%",
    color: "#333",
  },
  price: {
    width: "20%",
    textAlign: "right",
    color: "#333",
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 10,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  footerText: {
    fontWeight: "bold",
    color: "#333",
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    marginTop: 5,
    paddingTop: 5,
  },
  grandTotalText: {
    fontWeight: "bold",
    color: "#4CAF50",
    fontSize: 16,
  },
});

export default Receipt;
