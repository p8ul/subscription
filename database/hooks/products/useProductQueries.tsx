import { useSQLiteContext } from "expo-sqlite";
import RNHTMLtoPDF from "react-native-html-to-pdf";

const useProductQueries = () => {
  const db = useSQLiteContext();

  const getProducts = async (limit = 1000) => {
    try {
      const products = await db.getAllAsync(
        `SELECT Product.*, Category.name AS categoryName, Category.id AS categoryId
FROM Product
JOIN Category ON Product.category = Category.id
ORDER BY Product.name ASC;
             `
      );
      return products;
    } catch (error) {
      console.error("Error fetching product:", error);
      return [];
    }
  };

  const getProduct = async (id: string) => {
    try {
      const product = await db.getAllAsync(
        `SELECT Product.*, Category.name AS categoryName, Category.id AS categoryId
             FROM Product
             JOIN Category ON Product.category = Category.id
             WHERE Product.id = ?;`,
        [id]
      );
      return product;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  const getProductsByID = async (ids: number[]) => {
    const placeholders = ids?.map((id) => id).join(",");
    const products = await db.getAllAsync(
      `SELECT * FROM Product WHERE id IN (${placeholders})`
    );
    return products;
  };

  const addOrUpdateProduct = async (product) => {
    const {
      id,
      name,
      category,
      description,
      price,
      buyingPrice,
      volume,
      alcoholPercentage,
      measurementUnit,
      rating,
      image,
      Meta,
      origin,
      quantity,
    } = product;

    try {
      let _id = id;
      if (id) {
        // Update existing product without updating quantity
        await db.runAsync(
          `UPDATE Product SET
            name = ?, category = ?, description = ?, price = ?, buyingPrice = ?,
            volume = ?, alcoholPercentage = ?, measurementUnit = ?, rating = ?, image = ?, Meta = ?, origin = ?, quantity = ?
            WHERE id = ?;`,
          [
            name,
            category,
            description,
            price,
            buyingPrice,
            volume,
            alcoholPercentage,
            measurementUnit,
            rating,
            image,
            Meta,
            origin,
            quantity,
            id,
          ]
        );
      } else {
        // Add new product with quantity set to 0
        const product = await db.runAsync(
          `INSERT INTO Product (name, category, description, quantity, price, buyingPrice, volume, alcoholPercentage,
            measurementUnit, rating, image, Meta, origin) VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            name,
            category,
            description,
            price,
            buyingPrice,
            volume,
            alcoholPercentage,
            measurementUnit,
            rating,
            image,
            Meta,
            origin,
          ]
        );
        _id = product.lastInsertRowId;
      }
      console.log("Product saved successfully");
      return _id;
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const fetchProductStockData = async ({ limit=10 }) => {
    const query = `
      SELECT name, quantity, threshold
      FROM Product
      WHERE quantity <= threshold order by rating DESC limit ?;
    `;
    try {
      const orders = await db.getAllAsync(query, [limit]);
      return orders;
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return {
    getProductsByID,
    getProduct,
    addOrUpdateProduct,
    getProducts,
    fetchProductStockData,
  };
};

export default useProductQueries;
