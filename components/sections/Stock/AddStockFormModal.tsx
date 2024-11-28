import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

const AddStockFormModal = ({
  visible,
  onClose,
  onSubmit,
  productId,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  productId: number;
}) => {
  const [expiryDatePickerVisible, setExpiryDatePickerVisible] = useState(false);

  const initialValues = {
    quantity: "",
    note: "",
    supplier: "",
    batchNumber: "",
    expiryDate: null,
  };

  const validationSchema = Yup.object({
    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Quantity must be at least 1"),
    note: Yup.string(),
    supplier: Yup.string(),
    batchNumber: Yup.string(),
    expiryDate: Yup.date().nullable(),
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Stock</Text>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onSubmit({ ...values, productId });
              onClose();
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <View>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={handleChange("quantity")}
                  onBlur={handleBlur("quantity")}
                  value={values.quantity}
                />
                {touched.quantity && errors.quantity && (
                  <Text style={styles.errorText}>{errors.quantity}</Text>
                )}

                <Text style={styles.label}>Note</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("note")}
                  onBlur={handleBlur("note")}
                  value={values.note}
                />

                <Text style={styles.label}>Supplier</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("supplier")}
                  onBlur={handleBlur("supplier")}
                  value={values.supplier}
                />

                <Text style={styles.label}>Batch Number</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("batchNumber")}
                  onBlur={handleBlur("batchNumber")}
                  value={values.batchNumber}
                />

                <Text style={styles.label}>Expiry Date</Text>
                <TouchableOpacity
                  onPress={() => setExpiryDatePickerVisible(true)}
                  style={styles.dateButton}
                >
                  <Text style={styles.dateText}>
                    {values.expiryDate
                      ? moment(values.expiryDate).format("YYYY-MM-DD")
                      : "Select Expiry Date"}
                  </Text>
                </TouchableOpacity>

                {expiryDatePickerVisible && (
                  <DateTimePicker
                    value={values.expiryDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setExpiryDatePickerVisible(false);
                      setFieldValue("expiryDate", selectedDate || null);
                    }}
                  />
                )}

                <View style={styles.buttonContainer}>
                  <Button title="Add Stock" onPress={() => handleSubmit()} />
                  <Button title="Cancel" color="red" onPress={onClose} />
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    color: "#555",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AddStockFormModal;
