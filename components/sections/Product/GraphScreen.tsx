import useOrderQueries from "@/database/hooks/orders/useOrderQueries";
import useProductQueries from "@/database/hooks/products/useProductQueries";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const ProductGraphScreen = () => {
  const [salesByPaymentType, setSalesByPaymentType] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const { fetchMonthlySales, fetchSalesByPaymentType } = useOrderQueries();
  const { fetchProductStockData } = useProductQueries();

  useEffect(() => {
    // Fetch data for the graphs
    const fetchData = async () => {
      const salesData = await fetchSalesByPaymentType();
      const stockData = await fetchProductStockData({limit: 5});
      const monthlySalesData = await fetchMonthlySales();

      setSalesByPaymentType(salesData);
      setLowStockProducts(stockData);
      setMonthlySales(monthlySalesData);
      console.log("monthlySalesData :>> ", stockData);
    };

    fetchData();
  }, []);

  // Prepare data for the payment type bar chart
  const paymentTypeBarData = {
    labels: salesByPaymentType.map((item) => item.paymentType),
    datasets: [
      {
        data: salesByPaymentType.map((item) => item.totalSales),
      },
    ],
  };

  // Prepare data for the low stock pie chart
  const lowStockPieData = lowStockProducts.map((item) => ({
    name: item.name,
    population: item.quantity,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    legendFontColor: "#333",
    legendFontSize: 14,
  }));

  // Prepare data for the monthly sales line chart
  const monthlySalesLineData = {
    labels: monthlySales.map((item) => item.month),
    datasets: [
      {
        data: monthlySales.map((item) => item.totalSales),
      },
    ],
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Sales by Payment Type</Text>
        <BarChart
          data={paymentTypeBarData}
          width={screenWidth - 32}
          height={220}
          yAxisLabel="Ksh "
          chartConfig={chartConfig}
          style={styles.chart}
        />

        <Text style={styles.title}>Low Stock Products</Text>
        <PieChart
          data={lowStockPieData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />

        <Text style={styles.title}>Monthly Sales</Text>
        <LineChart
          data={monthlySalesLineData}
          width={screenWidth - 32}
          height={220}
          yAxisLabel="Ksh "
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

// Chart configuration
const chartConfig = {
  backgroundColor: "#1E2923",
  backgroundGradientFrom: "#3F51B5",
  backgroundGradientTo: "#5C6BC0",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4F4F4",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default ProductGraphScreen;
