import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import MainHeader from "@/components/Header/MainHeader";
import { get } from "lodash";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import EmptySubscription from "./EmptySubscription";
import UserSubscription from "./UserSubscription";
import SubFormModal from "./SubFormModal";

// Validation Schema
const UserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email"),
  phone: Yup.string().required("Phone is required"),
});

// Form Component
const UserForm = ({ initialValues, onSubmit }) => {
  const [currentTab, setCurrentTab] = useState(0);
 
  return (
    <Formik
      initialValues={{ ...initialValues, meta: initialValues.meta || {} }}
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
        <View>
          <MainHeader
            title={get(initialValues, "name", "Add User")}
            rightComponent={
              <TouchableOpacity
                onPress={() => {
                  console.log("errors :>> ", errors);
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
              //   tintColor÷="#333"
              appearance="dark"
              onChange={(event) => {
                setCurrentTab(event.nativeEvent.selectedSegmentIndex);
              }}
            />
          </View>
          
          {currentTab === 1 ? (<UserSubscription userId={get(initialValues, 'id')} />): null}
          {currentTab === 0 ? (
            <View style={styles.formContainer}>
              {/* Name Field */}
              <Text style={{ color: "white" }}>Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
              />
              {errors.name && touched.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}

              {/* Email Field */}
              <Text style={{ color: "white" }}>Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
              />
              {errors.email && touched.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              {/* Phone Field */}
              <Text style={{ color: "white" }}>Phone</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                value={values.phone}
                keyboardType="phone-pad"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
              />
              {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

              {/* Meta Fields */}
              <Text style={{ color: "white" }}>Meta Fields</Text>
              <FieldArray
                name="meta"
                render={(arrayHelpers) => (
                  <View>
                    <FlatList
                      data={values.meta}
                      keyExtractor={(item, index) => `${item?.name}-${index}`}
                      renderItem={({ item, index }) => (
                        <View style={styles.metaItem}>
                          {/* Meta Name */}
                          <TextInput
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            placeholder="Field Name"
                            style={[styles.input, styles.metaInput]}
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
                            placeholder="Field Value"
                            placeholderTextColor="rgba(255, 255, 255, 0.6)"
                            style={[styles.input, styles.metaInput]}
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
                      )}
                    />

                    {/* Add New Meta Field */}
                    <Button
                      title="Add Meta Field"
                      onPress={() => arrayHelpers.push({ name: "", value: "" })}
                    />
                  </View>
                )}
              />
            </View>
          ) : null}
        </View>
      )}
    </Formik>
  );
};

export default UserForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#121212", // Dark background
  },
  formContainer: {
    marginTop: 20,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white", // White text for dark mode
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc", // Border remains light for contrast
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    color: "white", // Text color is white
  },
  inputPlaceholder: {
    color: "rgba(255, 255, 255, 0.6)", // Lighter white for placeholder
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white", // White labels for dark mode
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
    color: "#fff",
    fontWeight: "bold",
  },
});
