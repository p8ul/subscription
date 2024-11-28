import React from "react";
import {
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as _ from "lodash";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const GenerateOrderPdf = ({
  data,
  subtitle,
  cashTotal,
  cashlessTotal,
  totalSales,
}) => {
  const generateAndSharePDF = async () => {
    try {
      const productRows = data
        .map(
          (product, index) => `
          <tr>
           <td>${index + 1}</td>
            <td>${_.get(product, "[0]")}</td>
            <td>${_.get(product, "[1]")}</td>
            <td>${_.get(product, "[2]")}</td>
            <td>${_.get(product, "[3]")}</td>
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
                background-color: #333;
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
              <h2>Product Sales Summary</h2>
              <h4>${subtitle}</h4>
            </div>
            <table class="summary-table">
              <tr>
                <th>Category</th>
                <th>Amount (KSH)</th>
              </tr>
              <tr>
                <td>Cash</td>
                <td>${cashTotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Cashless</td>
                <td>${cashlessTotal.toLocaleString()}</td>
              </tr>
              <tr class="summary-total">
                <td>Total</td>
                <td>${totalSales.toLocaleString()}</td>
              </tr>
            </table>
            <table class="product-table">
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Current Stock</th>
                <th>Sold Quantity</th>
                <th>Price</th>
              </tr>
              ${productRows}
            </table>
            <footer>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </footer>
          </body>
        </html>`;

      // Generate PDF with expo-print
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Define a meaningful filename
      const filename = `${subtitle?.replace("From ", "")?.replaceAll(" ", "_")}_Product_Sales_Summary_${new Date().toISOString()}.pdf`;
      const newUri = `${FileSystem.documentDirectory}${filename}`;

      // Move the file to the new path
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      // Share the renamed PDF file
      await shareAsync(newUri);
      Alert.alert(
        "PDF Generated",
        `The PDF has been generated as "${filename}" and shared.`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={generateAndSharePDF} style={styles.button}>
        <MaterialCommunityIcons
          name="file-pdf-box"
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 16,
  },
});

export default GenerateOrderPdf;