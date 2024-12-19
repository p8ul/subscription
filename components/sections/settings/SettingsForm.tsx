import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Switch,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

const SettingsForm = ({
  initialValues,
  onSubmit,
}: {
  initialValues: {
    storeName: string;
    currency: string;
    timezone: string;
    paybillNumber?: string;
    accountNumber?: string;
    tillNumber?: string;
    phoneNumber?: string;
    autoGenerateNextMonth: number;
  };
  onSubmit: (values: any) => void;
}) => {
  // Validation Schema
  const validationSchema = Yup.object({
    storeName: Yup.string().required("Store Name is required"),
    currency: Yup.string().required("Currency is required"),
    timezone: Yup.string().required("Timezone is required"),
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit({ ...values })}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>
            {/* Store Name */}
            <Text style={styles.label}>Store Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter store name"
              placeholderTextColor="#aaa"
              onChangeText={handleChange("storeName")}
              onBlur={handleBlur("storeName")}
              value={values.storeName}
            />
            {touched.storeName && errors.storeName && (
              <Text style={styles.errorText}>{errors.storeName}</Text>
            )}

            {/* Phone Name */}
            <Text style={styles.label}>Phone Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#aaa"
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              value={values.phoneNumber}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}

            {/* Currency */}
            <Text style={styles.label}>Currency</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter currency"
              placeholderTextColor="#aaa"
              onChangeText={handleChange("currency")}
              onBlur={handleBlur("currency")}
              value={values.currency}
            />
            {touched.currency && errors.currency && (
              <Text style={styles.errorText}>{errors.currency}</Text>
            )}

            {/* Timezone */}
            <Text style={styles.label}>Timezone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter timezone"
              placeholderTextColor="#aaa"
              onChangeText={handleChange("timezone")}
              onBlur={handleBlur("timezone")}
              value={values.timezone}
              editable={false}
            />
            {touched.timezone && errors.timezone && (
              <Text style={styles.errorText}>{errors.timezone}</Text>
            )}

            {/* Auto-generate Next Month */}
            <View style={styles.toggleContainer}>
              <Text style={styles.label}>Auto-generate Next Month</Text>
              <Switch
                value={values.autoGenerateNextMonth}
                onValueChange={(value) =>
                  setFieldValue("autoGenerateNextMonth", value)
                }
                thumbColor={values.autoGenerateNextMonth ? "#0f0" : "#888"}
                trackColor={{ false: "#444", true: "#555" }}
              />
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={handleSubmit as any} />
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#000", // Dark background
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff", // White text
  },
  input: {
    borderWidth: 1,
    borderColor: "#444", // Darker border
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#fff", // White text input
    backgroundColor: "#222", // Darker input background
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default SettingsForm;
