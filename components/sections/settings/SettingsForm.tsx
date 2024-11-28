import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
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
        }) => (
          <View>
            {/* Store Name */}
            <Text style={styles.label}>Store Name</Text>
            <TextInput
              style={styles.input}
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
              onChangeText={handleChange("timezone")}
              onBlur={handleBlur("timezone")}
              value={values.timezone}
              editable={false}
            />
            {touched.timezone && errors.timezone && (
              <Text style={styles.errorText}>{errors.timezone}</Text>
            )}

            {/* Till Number */}
            <Text style={styles.label}>Till Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange("tillNumber")}
              onBlur={handleBlur("tillNumber")}
              value={values.tillNumber}
              keyboardType="numeric"
            />
            {touched.tillNumber && errors.tillNumber && (
              <Text style={styles.errorText}>{errors.tillNumber}</Text>
            )}

            {/* Paybill Number */}
            <Text style={styles.label}>Paybill Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange("paybillNumber")}
              onBlur={handleBlur("paybillNumber")}
              value={values.paybillNumber}
              keyboardType="numeric"
            />
            {touched.paybillNumber && errors.paybillNumber && (
              <Text style={styles.errorText}>{errors.paybillNumber}</Text>
            )}

            {/* Account Number */}
            <Text style={styles.label}>Account Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange("accountNumber")}
              onBlur={handleBlur("accountNumber")}
              value={values.accountNumber}
              keyboardType="numeric"
            />
            {touched.accountNumber && errors.accountNumber && (
              <Text style={styles.errorText}>{errors.accountNumber}</Text>
            )}

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
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default SettingsForm;
