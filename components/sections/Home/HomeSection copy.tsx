import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";

const { width } = Dimensions.get("window");

const upcomingPayments = [
  {
    id: "1",
    name: "Netflix",
    date: "Tomorrow",
    amount: "$11.50",
    icon: require("../../../assets/icons/64x64/4.png"), // Add your Netflix logo here
  },
  {
    id: "2",
    name: "Apple One",
    date: "Nov 24, 2023",
    amount: "$14.90",
    icon: require("../../../assets/icons/64x64/4.png"), // Add your Apple logo here
  },
];

const subscriptions = [
  {
    id: "3",
    name: "Disney+",
    date: "Nov 24, 2023",
    amount: "$6.90",
    category: "Entertainment",
    icon: require("../../../assets/icons/64x64/4.png"), // Add your Disney+ logo here
  },
  {
    id: "4",
    name: "Apple One",
    date: "Nov 29, 2023",
    amount: "$14.90",
    category: "Music",
    icon: require("../../../assets/icons/64x64/4.png"), // Add your Apple logo here
  },
  {
    id: "5",
    name: "Netflix",
    date: "Tomorrow",
    amount: "$11.50",
    category: "TV",
    icon: require("../../../assets/icons/64x64/4.png"), // Add your Netflix logo here
  },
];

  const HomeSection = () => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.expenses}>$146</Text>
        <Text style={styles.subtext}>Expenses in November</Text>

        {/* Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Manage subs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add new sub</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Payments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming payments</Text>
        {upcomingPayments.map((item) => (
          <View style={styles.listItem} key={item.id}>
            <Image  source={require("../../../assets/icons/64x64/4.png")} style={styles.icon} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            <Text style={styles.itemAmount}>{item.amount}</Text>
          </View>
        ))}
      </View>

      {/* Subscriptions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscriptions (12)</Text>
        <FlatList
          data={subscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Image source={item.icon} style={styles.icon} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDate}>{item.date}</Text>
              </View>
              <Text style={styles.itemAmount}>{item.amount}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    height: 1000
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  expenses: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  subtext: {
    color: "#aaa",
    fontSize: 16,
  },
  headerButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
    fontWeight: "bold",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  itemDate: {
    color: "#aaa",
    fontSize: 14,
  },
  itemAmount: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HomeSection