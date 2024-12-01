import useSubscriptionQueries from "@/database/hooks/subscription/useSubscriptionQueries";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  SectionList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { get } from "lodash";
import { getFullMonthName } from "@/utils";

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
  const { getAllSubscriptions } = useSubscriptionQueries();

  const [total, setTotal] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [totals, setTotals] = useState({ pending: 0, paid: 0 });
  const isFocused = useIsFocused();
  const loadSubscriptions = async () => {
    const data = await getAllSubscriptions(); // Replace with your SQLite query
    setSubscriptions(get(data, "subscriptions", []));
    setTotal(get(data, "totalAmount", 0));
    console.log('data[ :>> ', get(data, "subscriptions[0]", []));

    // Calculate totals
    const totalPending = data
      .filter((sub) => sub.status === "pending")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalPaid = data
      .filter((sub) => sub.status === "paid")
      .reduce((acc, curr) => acc + curr.amount, 0);
console.log('totalPaid, totalPending :>> ', totalPaid, totalPending);
    setTotals({ pending: totalPending, paid: totalPaid });
  };

  const sectionData = [
    {
      title: "Upcoming Payments",
      data: subscriptions.filter((sub) => sub.status === "pending"),
    },
    {
      title: "Subscriptions (Paid)",
      data: subscriptions.filter((sub) => sub.status === "paid"),
    },
  ];
  useEffect(() => {
    loadSubscriptions();
  }, [isFocused]);
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.expenses}>{total}/-</Text>
        <Text style={styles.subtext}>Expenses in {getFullMonthName()}</Text>
        {/* <Text style={styles.subText}>
          Pending: ${totals.pending.toFixed(2)} | Paid: $
          {totals.paid.toFixed(2)}
        </Text> */}
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

      {/* Subscriptions */}
      <View style={styles.section}>
        {/* SectionList */}
        <SectionList
          sections={sectionData}
          keyExtractor={(item) => item.id.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.subscriptionItem}>
              <View style={styles.listItem} key={item.id}>
                <Image
                  source={require("../../../assets/icons/64x64/4.png")}
                  style={styles.icon}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDate}>{get(item, 'user.name')} | {item.dueDate}</Text>
                </View>
                <Text style={styles.itemAmount}>
                  {item.amount.toFixed(2)}/-
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    height: 1000,
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

export default HomeSection;
