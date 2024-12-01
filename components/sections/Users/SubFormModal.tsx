import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";


// Validation Schema
const SubscriptionSchema = Yup.object({
  name: Yup.string().required("Subscription name is required"),
  amount: Yup.number().required("Amount is required"),
  dueDate: Yup.date().required("Due date is required"),

});

const SubFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Cancel "X" Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.modalTitle}>
              {initialValues?.id ? "Edit" : "Add"} Subscription
            </Text>

            <Formik
              initialValues={initialValues}
              validationSchema={SubscriptionSchema}
              onSubmit={(values) => {
                onSubmit(values);
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
                  {/* Subscription Name */}
                  <Text style={styles.label}>Subscription Name</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}

                  {/* Amount */}
                  <Text style={styles.label}>Amount</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("amount")}
                    onBlur={handleBlur("amount")}
                    value={values.amount?.toString()}
                    keyboardType="numeric"
                  />
                  {touched.amount && errors.amount && (
                    <Text style={styles.errorText}>{errors.amount}</Text>
                  )}

                  {/* Due Date */}
                  <Text style={styles.label}>Due Date</Text>
                  <TouchableOpacity
                    style={styles.datePicker}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text>{values.dueDate || "Select Due Date"}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={
                        values.dueDate ? new Date(values.dueDate) : new Date()
                      }
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setFieldValue(
                            "dueDate",
                            selectedDate.toISOString().split("T")[0]
                          );
                        }
                      }}
                    />
                  )}
                  {touched.dueDate && errors.dueDate && (
                    <Text style={styles.errorText}>{errors.dueDate}</Text>
                  )}

                  {/* Meta Fields */}
                  <Text style={styles.label}>Meta Fields</Text>
                  <FieldArray
                    name="meta"
                    render={(arrayHelpers) => (
                      <View>
                        {values?.meta?.map((item, index) => (
                          <View key={index} style={styles.metaItem}>
                            <TextInput
                              style={[styles.input, styles.metaInput]}
                              placeholder="Field Name"
                              onChangeText={handleChange(`meta[${index}].name`)}
                              onBlur={handleBlur(`meta[${index}].name`)}
                              value={item.name}
                            />
                            <TextInput
                              style={[styles.input, styles.metaInput]}
                              placeholder="Field Value"
                              onChangeText={handleChange(
                                `meta[${index}].value`
                              )}
                              onBlur={handleBlur(`meta[${index}].value`)}
                              value={item.value}
                            />
                            <TouchableOpacity
                              onPress={() => arrayHelpers.remove(index)}
                              style={styles.deleteButton}
                            >
                              <Text style={styles.deleteButtonText}>X</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                        <Button
                          title="Add Meta Field"
                          onPress={() =>
                            arrayHelpers.push({ name: "", value: "" })
                          }
                        />
                      </View>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    title="Save"
                    onPress={() => {
                      console.log('errors :>> ', errors);
                      handleSubmit(values);
                    }}
                  />
                  <Button title="Cancel" color="red" onPress={onClose} />
                </View>
              )}
            </Formik>
          </ScrollView>
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
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  label: {
    fontSize: 14,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePicker: {
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
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  metaInput: {
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SubFormModal;
