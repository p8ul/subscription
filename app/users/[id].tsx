import useProductQueries from "@/database/hooks/products/useProductQueries";
import { Product } from "@/models/Product";
import { router, useLocalSearchParams } from "expo-router";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

import { get } from "lodash";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import StockHistory from "@/components/sections/Stock/StockHistory";
import MainHeader from "@/components/Header/MainHeader";
import { Button } from "@/components/ui/button";
import ProductFormModal from "@/components/sections/Product/ProductFormModal";
import useCategoryQueries from "@/database/hooks/category/useCategoryQueries";
import EmptyProduct from "@/components/sections/Product/EmptyProduct";
import { User } from "@/context/AppContext";
import useUserQueries from "@/database/hooks/users/useUserQueries";
import UserForm from "@/components/sections/Users/UserForm";

export const screenOptions = {
  headerShown: false,
};

const ProductDetailScreen = () => {
  const [user, setUser] = useState<User>({} as User);

  const { id: urlId } = useLocalSearchParams();
  const id = Number(urlId) ? Number(urlId) : null;

  const { getUser, createUser, updateUser } = useUserQueries();

  const handleGetUser = async () => {
    const data = await getUser(id as number);
    console.log("data :>> ", data);
    setUser(get(data, "[0]", {}) as User);
  };

  useEffect(() => {
    console.log("user :>> ", user);
  }, [user]);

  const handleSaveUser = async (values) => {
    if (id) {
      const user = await updateUser(values);
    } else {
      const user = await createUser(values);
    }
    router.push(`/users`);
    handleGetUser();
  };

  useEffect(() => {
    handleGetUser();
  }, [id]);

  if (id && !user.id) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}

      <UserForm
        initialValues={user}
        onSubmit={(values) => {
          console.log("values :>--> ", values);
          handleSaveUser(values);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    fontSize: 16,
    color: "white",
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
    marginLeft: 10,
  },
  details: {
    flex: 1,
    marginLeft: 26,
    justifyContent: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#fff",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
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
    color: "#fff",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
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
