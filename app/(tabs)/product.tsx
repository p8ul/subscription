import MainHeader from "@/components/Header/MainHeader";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TrendingSection from "@/components/sections/Product/TrendingSection";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useState } from "react";
import ProductGraphScreen from "@/components/sections/Product/GraphScreen";
import ProductStockSection from "@/components/sections/Product/ProductStockSection";

const AddProduct = () => {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <>
      <MainHeader
        title="Products"
        rightComponent={
          <View>
            <TouchableOpacity
              onPress={() => {
                router.push(`/product/${0}`);
              }}
              style={styles.checkoutButton}
            >
              <Ionicons name="add-circle-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        }
      />
      <SegmentedControl
        values={["All",'Threshold', "Reports"]}
        style={{ marginBottom: 15 }}
        selectedIndex={currentTab}
        onChange={(event) => {
          setCurrentTab(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      {currentTab == 0 ? <ProductStockSection /> : null}
      {currentTab == 2 ? <ProductGraphScreen /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  checkoutButton: {},
});
export default AddProduct;
