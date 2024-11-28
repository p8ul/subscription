import useProductQueries from "@/database/hooks/products/useProductQueries";
import { Product } from "@/models/Product";
import { router, useLocalSearchParams } from "expo-router";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import StockHistory from "@/components/sections/Stock/StockHistory";
import MainHeader from "@/components/Header/MainHeader";
import { Button } from "@/components/ui/button";
import ProductFormModal from "@/components/sections/Product/ProductFormModal";
import useCategoryQueries from "@/database/hooks/category/useCategoryQueries";
import EmptyProduct from "@/components/sections/Product/EmptyProduct";

export const screenOptions = {
  headerShown: false,
};

const ProductDetailScreen = () => {
  const [product, setProduct] = useState<Product>({} as Product);
  const [categories, setCategories] = useState([]);
  const { id: urlId } = useLocalSearchParams();
  const id = Number(urlId) ? Number(urlId) : null;

  const { getProduct, addOrUpdateProduct } = useProductQueries();
  const { getCategories } = useCategoryQueries();
  const [modalVisible, setModalVisible] = useState(false);

  const [currentTab, setCurrentTab] = useState(0);

  const handleGetProduct = async () => {
    const productData = await getProduct(id as string);
    setProduct(get(productData, "[0]", {}) as Product);
  };

  const handleSaveProduct = async (values) => {
    const productId = await addOrUpdateProduct({ ...values, id });
    handleGetProduct();
    if (!id) {
      router.push("product/" + productId);
    }
  };

  const handleGetCategories = async () => {
    const items = await getCategories();
    setCategories(items);
  };

  useEffect(() => {
    handleGetProduct();
    handleGetCategories();
  }, [id, currentTab]);


  return (
    <View style={styles.container}>
      {/* Header Section */}
      <MainHeader title={get(product, "name", "Add Product")} />
      <SegmentedControl
        values={id ? ["Product", "Stock"] : ["Product"]}
        style={{ marginBottom: 15 }}
        selectedIndex={currentTab}
        onChange={(event) => {
          setCurrentTab(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      {currentTab == 0 ? (
        <>
          {/* Content Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>&nbsp;</Text>
            <ProductFormModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onSubmit={handleSaveProduct}
              initialValues={product}
              categories={categories}
              id={id}
            />
            {id ? (
              <Button
                title="Edit Product"
                onPress={() => setModalVisible(true)}
              >
                <Text style={{ color: "white" }}> {id ? "Edit" : "Add"}</Text>
              </Button>
            ) : null}
          </View>
          {id ? (
            <>
              <View style={styles.content}>
                {/* Image Section */}
                <View style={{ flex: 1, backgroundColor: "#F0EEFF", justifyContent: 'center' }}>
                  <Image
                    source={require("../../assets/icons/124x124/1.png")} // Replace with actual image URL
                    style={styles.image}
                  />
                </View>

                {/* Product Details Section */}
                <View style={styles.details}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>
                    {get(product, "categoryName")}
                  </Text>

                  <Text style={styles.detailLabel}>Quantity</Text>
                  <Text style={styles.detailValue}>
                    {get(product, "quantity")}
                  </Text>

                  <Text style={styles.detailLabel}>Alcohol</Text>
                  <Text style={styles.detailValue}>
                    {get(product, "alcoholPercentage")}%
                  </Text>

                  <Text style={styles.detailLabel}>Volume</Text>
                  <Text style={styles.detailValue}>
                    {get(product, "volume")}
                    {get(product, "measurementUnit")}
                  </Text>

                  <Text style={styles.detailLabel}>Country</Text>
                  <Text style={styles.detailValue}>
                    {get(product, "origin")}
                  </Text>
                </View>
              </View>

              {/* Description Section */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.productName}>{get(product, "name")}</Text>
                <Text style={styles.productPrice}>
                  kes {get(product, "price")}
                </Text>
              </View>
              <Text style={styles.productDescription}>
                {get(product, "description")}
              </Text>
            </>
          ) : (
            <EmptyProduct addProduct={() => setModalVisible(true)} />
          )}
        </>
      ) : null}
      {currentTab == 1 ? (
        <StockHistory
          productId={id as number}
          productName={get(product, "name")}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    fontSize: 16,
    color: "#333",
  },
  content: {
    flexDirection: "row",
    marginBottom: 24,
    justifyContent: "space-between",
  },
  image: {
    width: 120,
    height: 300,
    resizeMode: "contain",
    borderRadius: 8,
    marginLeft: 10
  },
  details: {
    flex: 1,
    marginLeft: 26,
    justifyContent: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#999",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  descriptionContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#777",
    lineHeight: 20,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  quantityButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  quantity: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  addToBagButton: {
    backgroundColor: "#ff9933",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  addToBagButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductDetailScreen;
