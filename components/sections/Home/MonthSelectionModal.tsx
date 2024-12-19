import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const MonthSelectionModal = ({ visible, onClose, onGenerate }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [status, setStatus] = useState("");

  const handleGenerate = () => {
    if (startDate > endDate) {
      alert("End date cannot be earlier than start date.");
      return;
    }
    onGenerate({ startDate, endDate, status });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Filter Subscriptions</Text>

          {/* Start Date Picker */}
          <Text style={styles.label}>Select Start Date</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.dateText}>{startDate.toDateString()}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}

          {/* End Date Picker */}
          <Text style={styles.label}>Select End Date</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.dateText}>{endDate.toDateString()}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}

          {/* Subscription Status Picker */}
          <Text style={styles.label}>Select Subscription Status</Text>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item
              label="Select Status"
              value=""
              color={Platform.OS === "ios" ? "white" : undefined}
            />
            <Picker.Item
              label="All"
              value="all"
              color={Platform.OS === "ios" ? "white" : undefined}
            />
            <Picker.Item
              label="Pending"
              value="pending"
              color={Platform.OS === "ios" ? "white" : undefined}
            />
            <Picker.Item
              label="Paid"
              value="paid"
              color={Platform.OS === "ios" ? "white" : undefined}
            />
          </Picker>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerate}
            >
              <Text style={styles.buttonText}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MonthSelectionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  label: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  datePickerButton: {
    width: "100%",
    backgroundColor: "#2e2e2e",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
  },
  picker: {
    width: "100%",
    backgroundColor: "#2e2e2e",
    color: "#fff",
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  generateButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
