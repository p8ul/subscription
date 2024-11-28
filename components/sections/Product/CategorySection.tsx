import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import useCategoryQueries from "@/database/hooks/category/useCategoryQueries";
import { useAppContext } from "@/context/AppContext";

const CategorySection = () => {
  const { getCategories } = useCategoryQueries();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const {fetchProducts } = useAppContext()

  const handleFetchCategories = async () => {
    const cat = await getCategories(1000, 0);
    if (cat) {
      setCategories([{ name: "All", id: "" }, ...cat]);
    }
  };

  const handleSelectCategory = async (id: number) => {
      fetchProducts(1000, 0, id)
      setSelectedCategory(id);
   }

  useEffect(() => {
    handleFetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectCategory(item.id)}
            style={styles.categoryItem}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item.id && styles.selectedCategoryText,
              ]}
            >
              {item.name}
            </Text>
            {selectedCategory === item.id && (
              <View style={styles.dotIndicator} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginBottom: 7
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  categoryText: {
    fontSize: 14,
    color: "#666", // Default text color
  },
  selectedCategoryText: {
    color: "#333", // Highlight color for the selected category
    fontWeight: "bold",
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#333", // Dot color
    marginTop: 4,
  },
});

export default CategorySection;