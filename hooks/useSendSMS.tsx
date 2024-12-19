import React from "react";
import { Alert, Linking, TextInput, Button, StyleSheet, View, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

const useSendSMS = () => {
  const sendMessage = (phoneNumber: string, message: string) => {
    const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            "Error",
            "Your device does not support sending messages."
          );
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("Error opening messaging app:", err));
  };

  const SMSForm = () => {
    const initialValues = {
      phoneNumber: "",
      message: "",
    };

    const validationSchema = Yup.object({
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Phone number must be numeric")
        .required("Phone number is required"),
      message: Yup.string().required("Message is required"),
    });

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          sendMessage(values.phoneNumber, values.message);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#aaa"
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              value={values.phoneNumber}
              keyboardType="phone-pad"
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <Text style={styles.error}>{errors.phoneNumber}</Text>
            )}

            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your message"
              placeholderTextColor="#aaa"
              onChangeText={handleChange("message")}
              onBlur={handleBlur("message")}
              value={values.message}
              multiline
              numberOfLines={4}
            />
            {touched.message && errors.message && (
              <Text style={styles.error}>{errors.message}</Text>
            )}

            <Button title="Send Message" onPress={handleSubmit} />
          </View>
        )}
      </Formik>
    );
  };

  return { sendMessage, SMSForm };
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#121212",
    flex: 1,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "#fff",
    backgroundColor: "#1e1e1e",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default useSendSMS;