import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const ProductGraphScreen = () => {
  const screenWidth = Dimensions.get("window").width;

  // Sample data
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [50, 100, 150, 200, 250, 300], // Example revenue
      },
    ],
  };

  const barChartData = {
    labels: ["Cash", "Card", "Mobile"],
    datasets: [
      {
        data: [40, 30, 50], // Example payment method usage
      },
    ],
  };

  const pieChartData = [
    {
      name: "Completed",
      population: 80,
      color: "#4CAF50",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Pending",
      population: 15,
      color: "#FFC107",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Cancelled",
      population: 5,
      color: "#F44336",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
  ];

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Sales Trend (Line Chart)</Text>
        <LineChart
          data={lineChartData}
          width={screenWidth - 32} // Width of the chart
          height={220}
          yAxisLabel="Ksh "
          chartConfig={{
            backgroundColor: "#1E2923",
            backgroundGradientFrom: "#4CAF50",
            backgroundGradientTo: "#81C784",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={styles.chart}
        />

        <Text style={styles.title}>Payment Methods (Bar Chart)</Text>
        <BarChart
          data={barChartData}
          width={screenWidth - 32}
          height={220}
          yAxisLabel="Ksh "
          chartConfig={{
            backgroundColor: "#1E2923",
            backgroundGradientFrom: "#3F51B5",
            backgroundGradientTo: "#5C6BC0",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          style={styles.chart}
        />

        <Text style={styles.title}>Order Status (Pie Chart)</Text>
        <PieChart
          data={pieChartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: "#1E2923",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute // Shows percentages as absolute numbers
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1E1E1E",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
});

export default ProductGraphScreen;
