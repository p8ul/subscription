import React, { useEffect, useState } from "react";
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
import useStockQueries from "@/database/hooks/products/useStoreQueries";
import { getNextMonthEndDate } from "@/utils";
import { Button } from "@/components/ui/button";
import AddStockFormModal from "./AddStockFormModal";
import AntDesign from "@expo/vector-icons/AntDesign";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import { useAppContext } from "@/context/AppContext";

export default function StockHistory({ productId, productName }) {
  const { deleteStock, addStock, getStocksByDate } = useStockQueries();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(getNextMonthEndDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState<"start" | "end">("start");
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedStockId, setSelectedStock] = useState<number | null>(null);
  const { settings } = useAppContext();

  const timezone = settings?.timezone || "Africa/Nairobi"; // Default to EAT

  const openDeleteModal = (stockId: number) => {
    setSelectedStock(stockId);
    setDeleteModalVisible(true);
  };

  const handleDeleteStock = async () => {
    if (selectedStockId !== null) {
      await deleteStock(selectedStockId);
      await loadStocks();
    }
  };

  const handleAddStock = (values) => {
    addStock(
      productId,
      values.quantity,
      values.note,
      values.supplier,
      values.batchNumber,
      values.expiryDate
    );
    setModalVisible(false);
    loadStocks();
  };

  useEffect(() => {
    loadStocks();
  }, [startDate, endDate]);

  const loadStocks = async () => {
    setLoading(true);
    try {
      const filteredStocks = await getStocksByDate(
        productId,
        startDate,
        endDate
      );
      const formattedSections = segmentStocksByDate(filteredStocks);
      setSections(formattedSections);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  const segmentStocksByDate = (stocks) => {
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

    stocks?.forEach((stock) => {
      const stockDate = moment(stock.dateAdded)
        .tz(timezone)
        .format("YYYY-MM-DD");
      if (stockDate === today) {
        sections[0].data.push(stock);
      } else if (stockDate === yesterday) {
        sections[1].data.push(stock);
      } else {
        if (!others[stockDate]) others[stockDate] = [];
        others[stockDate].push(stock);
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

  const renderHeader = () => (
    <>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text style={styles.productHeader}>Stock History</Text>
        <Button title="Add Stock" onPress={() => setModalVisible(true)}>
          <Text style={{ color: "white" }}>Add</Text>
        </Button>
      </View>
      <AddStockFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddStock}
        productId={productId}
      />

      <ConfirmModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={() => handleDeleteStock()}
      />

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
    </>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ position: "absolute", right: 10, padding: 5 }}>
        <TouchableOpacity onPress={() => openDeleteModal(item.id)}>
          <AntDesign name="delete" size={14} color="black" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <Text style={styles.quantity}>
          {moment.utc(item.dateAdded).tz(timezone).format("dddd, D MMM YYYY")}
        </Text>
        <Text style={styles.quantity}>Qty: {item.quantity}</Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {item.batchNumber && (
          <Text style={styles.date}>Batch: {item.batchNumber}</Text>
        )}
        {item.note && <Text style={styles.date}>{item.note}</Text>}
        {item.expiryDate && (
          <Text style={styles.expiryDate}>
            Expiry Date:{" "}
            {moment(item.expiryDate).tz(timezone).format("YYYY-MM-DD")}
          </Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  productHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: 15,
  },
  card: {
    backgroundColor: "#F0EEFF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "500",
  },
  price: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  supplier: {
    fontSize: 14,
    color: "#666",
  },
  batchNumber: {
    fontSize: 14,
    color: "#666",
  },
  expiryDate: {
    fontSize: 14,
    color: "#666",
  },
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
});
