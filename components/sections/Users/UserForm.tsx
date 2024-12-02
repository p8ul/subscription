import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import MainHeader from "@/components/Header/MainHeader";
import { get } from "lodash";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import UserSubscription from "./UserSubscription";
import { useLocalSearchParams } from "expo-router";

// Validation Schema
const UserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email"),
  phone: Yup.string().required("Phone is required"),
});

// Form Component
const UserForm = ({ initialValues, onSubmit }) => {
  const params = useLocalSearchParams();
  const { tab } = params;
  const [currentTab, setCurrentTab] = useState(Number(tab) || 0);

  return (
    <Formik
      initialValues={{ ...initialValues, meta: initialValues.meta || [] }}
      validationSchema={UserSchema}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => (
        <View style={styles.container}>
          <MainHeader
            title={get(initialValues, "name", "Add User")}
            rightComponent={
              <TouchableOpacity
                onPress={() => {
                  console.log("Errors:", errors);
                  handleSubmit();
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Save</Text>
              </TouchableOpacity>
            }
          />
          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            <SegmentedControl
              values={["Details", "Subscriptions"]}
              style={{ marginBottom: 15 }}
              selectedIndex={currentTab}
              appearance="dark"
              onChange={(event) => {
                setCurrentTab(event.nativeEvent.selectedSegmentIndex);
              }}
            />
          </View>

          {currentTab === 1 ? (
            <UserSubscription userId={get(initialValues, "id")} />
          ) : (
            <ScrollView>
              <View style={styles.formContainer}>
                {/* Name Field */}
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  placeholder="Enter name"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
                {errors.name && touched.name && (
                  <Text style={styles.error}>{errors.name}</Text>
                )}

                {/* Email Field */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                  placeholder="Enter email"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
                {errors.email && touched.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}

                {/* Phone Field */}
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  keyboardType="phone-pad"
                  placeholder="Enter phone"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                />
                {errors.phone && touched.phone && (
                  <Text style={styles.error}>{errors.phone}</Text>
                )}

                {/* Meta Fields */}
                <Text style={styles.label}>Meta Fields</Text>
                <FieldArray
                  name="meta"
                  render={(arrayHelpers) => (
                    <View>
                      {values.meta.map((item, index) => (
                        <View key={index} style={styles.metaItem}>
                          {/* Meta Name */}
                          <TextInput
                            style={[styles.input, styles.metaInput]}
                            placeholder="Field Name"
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            onChangeText={(text) =>
                              setFieldValue(`meta[${index}].name`, text)
                            }
                            onBlur={handleBlur(`meta[${index}].name`)}
                            value={item?.name}
                          />
                          {errors.meta?.[index]?.name &&
                            touched.meta?.[index]?.name && (
                              <Text style={styles.error}>
                                {errors.meta[index].name}
                              </Text>
                            )}

                          {/* Meta Value */}
                          <TextInput
                            style={[styles.input, styles.metaInput]}
                            placeholder="Field Value"
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            onChangeText={(text) =>
                              setFieldValue(`meta[${index}].value`, text)
                            }
                            onBlur={handleBlur(`meta[${index}].value`)}
                            value={item?.value}
                          />
                          {errors.meta?.[index]?.value &&
                            touched.meta?.[index]?.value && (
                              <Text style={styles.error}>
                                {errors.meta[index].value}
                              </Text>
                            )}

                          {/* Remove Field Button */}
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => arrayHelpers.remove(index)}
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
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </Formik>
  );
};

export default UserForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  formContainer: {
    padding: 20,
  },
  label: {
    color: "white",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "white",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
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
    color: "white",
    fontWeight: "bold",
  },
});
