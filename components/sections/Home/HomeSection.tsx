import useSubscriptionQueries from "@/database/hooks/subscription/useSubscriptionQueries";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { get } from "lodash";
import { getFullMonthName } from "@/utils";
import { router } from "expo-router";
import SubIcon from "@/components/icons/SubIcon";

const HomeSection = () => {
  const { getAllSubscriptions } = useSubscriptionQueries();

  const [total, setTotal] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [totals, setTotals] = useState({ pending: 0, paid: 0 });
  const isFocused = useIsFocused();

  const loadSubscriptions = async () => {
    const result = await getAllSubscriptions();
    const data = get(result, "subscriptions", []);
    setSubscriptions(data);
    setTotal(get(result, "totalAmount", 0));

    // Calculate totals
    const totalPending = data
      ?.filter((sub) => sub.status === "pending")
      ?.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPaid = data
      ?.filter((sub) => sub.status === "paid")
      ?.reduce((acc, curr) => acc + curr.amount, 0);

    setTotals({ pending: totalPending, paid: totalPaid });
  };

  const sections = [
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.expenses}>{total}/-</Text>
        <Text style={styles.subtext}>
          Subscriptions in {getFullMonthName()}
        </Text>
        <Text style={styles.subtext}>
          Pending: {totals.pending.toFixed(2)} | Paid: {totals.paid.toFixed(2)}
        </Text>
        {/* Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/users")}
          >
            <Text style={styles.buttonText}>Manage subs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/users")}
          >
            <Text style={styles.buttonText}>Add new sub</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subscriptions Section */}
      <View style={styles.section}>
        {sections.map((section) => (
          <View key={section.title}>
            {/* Section Title */}
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {/* Section Items */}
            {section.data.length > 0 ? (
              section.data.map((item, index) => (
                <TouchableOpacity
                  key={`${get(item, "userId")}-${index}`}
                  onPress={() => {
                    router.push({
                      pathname: `users/${get(item, "userId")}`,
                      params: { tab: 1 },
                    });
                  }}
                >
                  <View style={styles.subscriptionItem} key={item.id}>
                    <View style={styles.listItem}>
                      <SubIcon width={50} height={50} color="white" />

                      <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDate}>
                          {get(item, "user.name")}
                        </Text>
                        <Text style={styles.itemDate}>{item.dueDate}</Text>
                      </View>
                      <Text style={styles.itemAmount}>
                        {item.amount.toFixed(2)}/-
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noData}>No data available</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#121212",
    padding: 20,
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
  noData: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
});

export default HomeSection;
