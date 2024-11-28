import React, { useEffect, useState } from "react";
import moment from "moment";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import _, { find, forIn } from "lodash";
import { useAppContext } from "@/context/AppContext";
import { Product } from "@/models/Product";
import useProductQueries from "@/database/hooks/products/useProductQueries";
import GenerateOrderPdf from "./GenerateOrderPdf";
import { formatNumberWithCommas } from "@/utils";

interface ProductSalesSummaryTableProps {
  orders: any[];
  startDate: string;
  endDate: string;
  cashTotal: string;
  cashlessTotal: string;
  totalSales: string;
}

const ProductSalesSummaryTable: React.FC<ProductSalesSummaryTableProps> = ({
  orders: _orders,
  startDate,
  endDate,
  cashTotal,
  cashlessTotal,
  totalSales,
}) => {
  const [orders, setOrders] = useState(_orders);
  const [products, setProducts] = useState([] as Product[]);
  const [ids, setIds] = useState([] as string | number[]);
  const [tableData, setTableData] = useState<string[][]>([]);
  const { getProductsByID } = useAppContext();
  const { getProducts } = useProductQueries();

  // Helper function to validate date format
  const validateDate = (date: string) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return formattedDate === "Invalid date" ? "--" : formattedDate;
  };

  // Define table headers and column widths
  const tableHead: string[] = ["Product", "Current Stock", "Sold QTY", "Price"];

  const widthArr = [140, 100, 100, 100];

  const updateCurrentQuantity = async (ids: number[]) => {
    const products = await getProductsByID(ids); // Fetch products by their IDs
    let currentOrders = [...orders]; // Clone orders to avoid mutating state directly
    forIn(products, (product: Product) => {
      const order = find(currentOrders, { id: product.id });
      if (order) {
        order.quantity = product.quantity; // Update order quantity with product quantity
      }
    });

    setOrders(currentOrders); // Set updated orders in state
  };

  useEffect(() => {
    updateOtherQuantities();
  }, []);

  const updateOtherQuantities = async () => {
    const products = await getProducts();
    setProducts(products as Product[]);
  };

  // Map orders data to table format with validation and fallback values
  useEffect(() => {
    let data =
      orders?.map((item) => {
        return [
          `${_.get(item, "name", "Unknown")} ${_.get(item, "volume") ? `(${_.get(item, "volume")} ${_.get(item, "measurementUnit", "")})` : ""}`,
          item.quantity || "--",
          formatNumberWithCommas(Number(_.get(item, "totalQuantity", 0))),
          formatNumberWithCommas(Number(_.get(item, "price", 0)).toFixed(2)),
          formatNumberWithCommas(
            Number(_.get(item, "totalSales", 0)).toFixed(2)
          ),
          item.id,
        ];
      }) || [];
    products?.map((item) => {
      if (!ids.includes(item?.id)) {
        data.push([
          `${_.get(item, "name", "Unknown")} ${_.get(item, "volume") ? `(${_.get(item, "volume")} ${_.get(item, "measurementUnit", "")})` : ""}`,
          formatNumberWithCommas(_.get(item, "quantity")),
          "--",
          formatNumberWithCommas(_.get(item, "price")),
          item.id,
        ]);
      }
    });

    setTableData(data);
  }, [orders, products]);

  useEffect(() => {
    const ids: number[] = [];

    _orders?.map((item) => {
      ids.push(item.id);
    });

    setOrders(_orders);

    setIds(ids);

    setTimeout(() => {
      updateCurrentQuantity(ids);
    }, 2000);
  }, [_orders]);

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        
        <View>
        <Text style={styles.title}>Product Sales Summary</Text>
          <Text style={styles.subtitle}>
            <Text style={{ fontWeight: "600" }}>{validateDate(startDate)}</Text>
            &nbsp; to &nbsp;
            <Text style={{ fontWeight: "600" }}>{validateDate(endDate)}</Text>
          </Text>
        </View>
        <GenerateOrderPdf
          data={tableData}
          subtitle={`From ${validateDate(startDate)} to ${validateDate(endDate)}`}
          cashTotal={cashTotal.toLocaleString()}
          cashlessTotal={cashlessTotal.toLocaleString()}
          totalSales={totalSales.toLocaleString()}
        />
      </View>

      <ScrollView horizontal={true}>
        <Table borderStyle={styles.tableBorder}>
          <Row
            data={tableHead}
            widthArr={widthArr}
            style={styles.head}
            textStyle={styles.headText}
          />
          <Rows
            widthArr={widthArr}
            data={tableData}
            style={styles.row}
            textStyle={styles.text}
          />
        </Table>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: "#333",
  },
  head: {
    height: 50,
    backgroundColor: "#f1f1f1",
  },
  headText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    height: 50,
    backgroundColor: "#ffffff",
  },
  text: {
    margin: 6,
    fontSize: 14,
    textAlign: "center",
  },
});

export default ProductSalesSummaryTable;
