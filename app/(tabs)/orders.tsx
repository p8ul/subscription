import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import moment from "moment-timezone";

import DateTimePicker from "@react-native-community/datetimepicker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDateTime, getNextMonthEndDate, getTimeByZone } from "@/utils";
import ProductSalesSummaryTable from "@/components/sections/Orders/ProductSalesSummaryTable";
import CurrentValueCard from "@/components/sections/CurrentValueCard";
import useOrderQueries from "@/database/hooks/orders/useOrderQueries";
import { router, useFocusEffect } from "expo-router";
import { useAppContext } from "@/context/AppContext";

export default function TransactionHistory() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(getNextMonthEndDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<"start" | "end">("start");
  const { getOrdersByDate } = useOrderQueries();
  const { settings } = useAppContext();

  const timezone = settings?.timezone; //

  const [totalStatistics, setTotalStatistics] = useState({
    overallTotal: 0,
    cashTotal: 0,
    cashlessTotal: 0,
  });

  const [productAggregates, setProductAggregates] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  useEffect(() => {
    loadOrders();
  }, [startDate, endDate]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const orders = await getOrdersByDate(startDate, endDate);
      const filteredOrders = filterOrdersByDateRange(orders);
      const formattedSections = segmentOrdersByDate(filteredOrders);
      setSections(formattedSections);
      calculateTotals(filteredOrders);
      aggregateProducts(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const aggregateProducts = (orders) => {
    const productMap = {};

    orders.forEach((order) => {
      const products = JSON.parse(order.products);
      products.forEach((product) => {
        const key = product.id; // Unique key by name and volume
        if (!productMap[key]) {
          productMap[key] = {
            id: product.id,
            name: product.name,
            volume: product.volume || null,
            price: product.price,
            measurementUnit: product.measurementUnit,
            createdAt: moment.utc(order.createdAt).tz(timezone),
            totalQuantity: 0,
            totalSales: 0,
          };
        }
        productMap[key].id = product.id;
        productMap[key].totalQuantity += product.quantity;
        productMap[key].totalSales += product.quantity * product.price; // Assuming `price` is per unit
      });
    });

    // Convert productMap to array for easy rendering
    setProductAggregates(Object.values(productMap));
  };

  // Filter orders based on date range
  const filterOrdersByDateRange = (orders) => {
    return orders?.filter((order) => {
      const orderDate = moment.utc(order.createdAt).tz(timezone);
      const isAfterStartDate = startDate
        ? orderDate.isSameOrAfter(moment(startDate), "day")
        : true;
      const isBeforeEndDate = endDate
        ? orderDate.isSameOrBefore(moment(endDate), "day")
        : true;
      return isAfterStartDate && isBeforeEndDate;
    });
  };

  const calculateTotals = (orders) => {
    let overallTotal = 0;
    let cashTotal = 0;
    let cashlessTotal = 0;

    orders.forEach((order) => {
      overallTotal += order.total;
      if (order.paymentType.toLowerCase() === "cash") {
        cashTotal += order.total;
      } else if (order.paymentType.toLowerCase() === "cashless") {
        cashlessTotal += order.total;
      }
    });

    setTotalStatistics({ overallTotal, cashTotal, cashlessTotal });
  };

  // Function to segment orders by date
  const segmentOrdersByDate = (orders) => {
    const today = moment().tz(timezone).format("YYYY-MM-DD");
    const yesterday = moment()
      .subtract(1, "day")
      .tz(timezone)
      .format("YYYY-MM-DD");
    const sections = [
      { title: "Today", data: [] },
      { title: "Yesterday", data: [] },
    ];

    const others = {};

    orders?.forEach((order) => {
      const orderDate = moment
        .utc(order.createdAt)
        .tz(timezone)
        .format("YYYY-MM-DD");
      if (orderDate === today) {
        sections[0].data.push(order);
      } else if (orderDate === yesterday) {
        sections[1].data.push(order);
      } else {
        if (!others[orderDate]) others[orderDate] = [];
        others[orderDate].push(order);
      }
    });

    Object.keys(others).forEach((date) => {
      sections.push({
        title: moment(date).tz(timezone).format("dddd, D MMM YYYY"),
        data: others[date],
      });
    });

    return sections;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (currentPicker === "start") {
      setStartDate(selectedDate || startDate);
    } else {
      setEndDate(selectedDate || endDate);
    }
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.dateFilterContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setCurrentPicker("start");
              setShowDatePicker(true);
            }}
          >
            <Text style={styles.dateText}>
              Start Date:{" "}
              {startDate
                ? moment(startDate).tz(timezone).format("YYYY-MM-DD")
                : "Select"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setCurrentPicker("end");
              setShowDatePicker(true);
            }}
          >
            <Text style={styles.dateText}>
              End Date:{" "}
              {endDate
                ? moment(endDate).tz(timezone).format("YYYY-MM-DD")
                : "Select"}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        {currentTab === 1 ? (
          <View style={styles.aggregationContainer}>
            <CurrentValueCard
              cashTotal={totalStatistics.cashTotal.toLocaleString()}
              cashlessTotal={totalStatistics.cashlessTotal.toLocaleString()}
              totalSales={totalStatistics.overallTotal.toLocaleString()}
            />
            <View style={{ marginBottom: 10 }} />
            <ProductSalesSummaryTable
              orders={productAggregates}
              startDate={moment(startDate).format("YYYY-MM-DD")}
              endDate={moment(endDate).format("YYYY-MM-DD")}
              cashTotal={totalStatistics.cashTotal.toLocaleString()}
              cashlessTotal={totalStatistics.cashlessTotal.toLocaleString()}
              totalSales={totalStatistics.overallTotal.toLocaleString()}
            />
            <View style={{ marginBottom: 100 }} />
          </View>
        ) : null}
        {currentTab === 2 ? (
          <View style={styles.statisticsContainer}>&nbsp;</View>
        ) : null}
      </>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      <SegmentedControl
        values={["Sales", "Reports"]}
        style={{ marginBottom: 15 }}
        selectedIndex={currentTab}
        onChange={(event) => {
          setCurrentTab(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      <SectionList
        sections={sections}
        style={{ marginBottom: 15, height: "100%" }}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section }) => {
          if (currentTab !== 0) {
            return null;
          }
          return <Text style={styles.sectionTitle}>{section.title}</Text>;
        }}
        renderItem={({ item }) => {
          if (currentTab !== 0) {
            return null;
          }
          return (
            <TouchableOpacity onPress={() => router.push(`/orders/${item.id}`)}>
              <View style={styles.itemContainer}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#333",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {item.paymentType === "Cash" ? (
                        <FontAwesome5
                          name="money-bill-wave"
                          size={14}
                          color="white"
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="credit-card-outline"
                          size={14}
                          color="white"
                        />
                      )}
                    </View>

                    <View style={{ marginLeft: 10 }}>
                      <View>
                        <Text>
                          {parseProductsQuantity(
                            item.products
                          ).productNames?.slice(0, 40)}
                        </Text>
                        <View>
                          <Text style={styles.createdAt}>
                            {formatDateTime(
                              moment
                                .utc(item.createdAt)
                                .tz(timezone)
                                .format("YYYY-MM-DD HH:mm")
                            )}
                          </Text>
                          <Text>
                            Quantity:{" "}
                            {parseProductsQuantity(item.products).totalQuantity}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View>
                    <Text>
                      <Text style={styles.total}>
                        kes {item.total.toLocaleString()}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
}

function parseProductsQuantity(products) {
  try {
    const productArray = JSON.parse(products);

    // Calculate total quantity
    const totalQuantity = productArray.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    // Get product names as a comma-separated string
    const productNames = productArray
      .map(
        (product) =>
          product.name + "(" + product.volume ||
          "" + product.measurementUnit ||
          "" + ")"
      )
      .join(", ");

    return {
      productNames,
      totalQuantity,
    };
  } catch (e) {
    console.error("Error parsing products JSON:", e);
    return {
      productNames: "",
      totalQuantity: 0,
    };
  }
}

const styles = StyleSheet.create({
  productStats: {},
  aggregationContainer: {
    marginBottom: 100,
    flex: 1,
    height: "100%",
  },
  productItem: {},
  aggregationHeader: {},
  container: { padding: 20, marginBottom: 100 },
  header: { fontSize: 23, fontWeight: "bold", marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: 15,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  total: { fontSize: 16, fontWeight: "bold", color: "#000" },
  products: { fontSize: 14, color: "#666" },
  paymentType: { fontSize: 14, color: "#888" },
  createdAt: { fontSize: 12, color: "#aaa" },
  dateFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#333",
    marginHorizontal: 5,
  },
  dateText: {
    color: "#fff",
    fontSize: 12,
  },
  statisticsContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  statisticsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalSales: {
    fontSize: 16,
    fontWeight: "500",
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
});
