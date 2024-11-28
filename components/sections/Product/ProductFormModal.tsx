import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  Button,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { AntDesign } from "@expo/vector-icons";
import useProductQueries from "@/database/hooks/products/useProductQueries";
import { router } from "expo-router";

const ProductFormModal = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  categories,
  id,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
  categories: { id: number; name: string }[];
  id: number | null;
}) => {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [dangerEdit, setDangerEdit] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    category: Yup.number().required("Category is required"),
    description: Yup.string(),
    price: Yup.number().required("Price is required"),
  });

  const { getProducts } = useProductQueries();
  useEffect(() => {
    handleTotalItems();
  }, [id]);

  const toggleDangerEdit = () => {
    setDangerEdit(!dangerEdit);
    if (!dangerEdit) {
      Alert.alert(
        "Warning!",
        "Stock fields should only be edited in the Stock section. Proceed with caution."
      );
    }
  };

  const handleTotalItems = async () => {
    const products = await getProducts(1000);
    if (!id && products.length > 100) {
      Alert.alert(
        "Only 200 products allowed for the free version. Call 0718 062 033."
      );
      router.push("/");
    }
    
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Cancel "X" Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.modalTitle}>{id ? "Edit" : "Add"} Product</Text>

            {/* Danger Edit Toggle */}
            <View style={styles.dangerEditContainer}>
              <Text style={styles.dangerEditLabel}>Danger Edit Mode</Text>
              <Switch value={dangerEdit} onValueChange={toggleDangerEdit} />
            </View>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
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
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}

                  {/* Category Dropdown */}
                  <Text style={styles.label}>Category</Text>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setCategoryModalVisible(true)}
                  >
                    <Text>
                      {categories.find((cat) => cat.id === values.category)
                        ?.name || "Select a Category"}
                    </Text>
                  </TouchableOpacity>
                  {touched.category && errors.category && (
                    <Text style={styles.errorText}>{errors.category}</Text>
                  )}

                  {/* Category Modal */}
                  <Modal
                    visible={categoryModalVisible}
                    transparent={true}
                    animationType="fade"
                  >
                    <View style={styles.modalOverlay}>
                      <View style={styles.categoryModalContent}>
                        <ScrollView>
                          {categories.map((cat) => (
                            <TouchableOpacity
                              key={cat.id}
                              onPress={() => {
                                setFieldValue("category", cat.id);
                                setCategoryModalVisible(false);
                              }}
                              style={styles.categoryItem}
                            >
                              <Text>{cat.name}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                        <Button
                          title="Close"
                          onPress={() => setCategoryModalVisible(false)}
                        />
                      </View>
                    </View>
                  </Modal>

                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, { height: 80 }]}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    value={values.description}
                    multiline
                  />

                  <Text style={styles.label}>Price</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("price")}
                    onBlur={handleBlur("price")}
                    value={values.price?.toString()}
                    keyboardType="numeric"
                  />
                  {touched.price && errors.price && (
                    <Text style={styles.errorText}>{errors.price}</Text>
                  )}

                  {!dangerEdit && (
                    <Text style={{ color: "red", fontSize: 12 }}>
                      Quantity can only be edited in danger mode.
                    </Text>
                  )}

                  <Text style={styles.label}>Quantity</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("quantity")}
                    onBlur={handleBlur("quantity")}
                    value={values.quantity?.toString()}
                    keyboardType="numeric"
                    editable={dangerEdit}
                  />
                  {touched.quantity && errors.quantity && (
                    <Text style={styles.errorText}>{errors.quantity}</Text>
                  )}

                  <Text style={styles.label}>Volume (amount in ML/L)</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("volume")}
                    onBlur={handleBlur("volume")}
                    value={values.volume?.toString()}
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>Measurement Unit</Text>
                  <View style={styles.switchContainer}>
                    <Text style={{ margin: 10 }}>Ml</Text>
                    <Switch
                      value={values.measurementUnit === "liter"}
                      onValueChange={(newValue) =>
                        setFieldValue(
                          "measurementUnit",
                          newValue ? "liter" : "ml"
                        )
                      }
                    />
                    <Text style={{ margin: 10 }}>Liter</Text>
                  </View>
                  {touched.measurementUnit && errors.measurementUnit && (
                    <Text style={styles.errorText}>
                      {errors.measurementUnit}
                    </Text>
                  )}

                  <Text style={styles.label}>Alcohol Percentage (%)</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("alcoholPercentage")}
                    onBlur={handleBlur("alcoholPercentage")}
                    value={values.alcoholPercentage?.toString()}
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>Origin</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("origin")}
                    onBlur={handleBlur("origin")}
                    value={values.origin}
                  />

                  <Button title="Save" onPress={() => handleSubmit()} />
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  dangerEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    backgroundColor: "#FFEEEE",
  },
  dangerEditLabel: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
  categoryModalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    maxHeight: "50%",
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default ProductFormModal;
