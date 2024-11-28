import { useSQLiteContext } from "expo-sqlite";
import { get } from "lodash";
import moment from "moment";
const useStockQueries = () => {
  const db = useSQLiteContext();

  // Add new stock and update product quantity
  const addStock = async (
    productId: number,
    quantity: number,
    note: string = "",
    supplier: string = "",
    batchNumber: string = "",
    expiryDate: string | null = null
  ) => {
    try {
      await db.runAsync(
        `INSERT INTO Stock (productId, quantity, note, supplier, batchNumber, expiryDate, dateAdded)
           VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
        [productId, quantity, note, supplier, batchNumber, expiryDate]
      );

      // Update product quantity
      await db.runAsync(
        `UPDATE Product SET quantity = quantity + ? WHERE id = ?`,
        [quantity, productId]
      );

      console.log("Stock added successfully.");
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  // Get paginated stocks for a particular product
  const getStocksByProduct = async (
    productId: number,
    limit: number = 10,
    offset: number = 0
  ) => {
    try {
      const stocks = await db.getAllAsync(
        `SELECT Stock.*, Product.name AS productName 
         FROM Stock 
         JOIN Product ON Stock.productId = Product.id 
         WHERE Stock.productId = ? 
         ORDER BY dateAdded DESC 
         LIMIT ? OFFSET ?`,
        [productId, limit, offset]
      );
      return stocks;
    } catch (error) {
      console.error("Error fetching stocks:", error);
      return [];
    }
  };

  // Get a single stock entry by ID
  const getStockById = async (id: number) => {
    try {
      const stock = await db.getAllAsync(
        `SELECT Stock.*, Product.name AS productName 
         FROM Stock 
         JOIN Product ON Stock.productId = Product.id 
         WHERE Stock.id = ?`,
        [id]
      );
      return stock[0];
    } catch (error) {
      console.error("Error fetching stock by ID:", error);
      return null;
    }
  };

  // Delete a stock entry and adjust product quantity
  const deleteStock = async (id: number) => {
    try {
      const existingStock = await db.getAllAsync(
        `SELECT quantity, productId FROM Stock WHERE id = ?`,
        [id]
      );
      console.log('existingStock :>> ', existingStock);
      const stockQuantity = get(existingStock, "[0].quantity", 0);
      const productId = get(existingStock, "[0].productId", 0);

      // Delete the Stock entry
      await db.runAsync(`DELETE FROM Stock WHERE id = ?`, [id]);

      // Adjust product quantity
      await db.runAsync(
        `UPDATE Product SET quantity = quantity - ? WHERE id = ?`,
        [stockQuantity, productId]
      );

      console.log("Stock deleted successfully.");
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  // Get stocks by date or between dates
  const getStocksByDate = async (
    productId: number,
    startDate: string,
    endDate: string | null = null
  ) => {
    try {
      const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
      const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
      let query = `SELECT Stock.*, Product.name AS productName 
                   FROM Stock 
                   JOIN Product ON Stock.productId = Product.id 
                   WHERE Stock.productId = ? AND date(Stock.dateAdded) >= date(?) ORDER BY Stock.dateAdded DESC;`;
      const params: (number | string)[] = [productId, formattedStartDate];

      if (endDate) {
        query += ` AND date(Stock.dateAdded) <= date(?)`;
        params.push(formattedEndDate);
      }

      const stocks = await db.getAllAsync(query, params);
      return stocks;
    } catch (error) {
      console.error("Error fetching stocks by date:", error);
      return [];
    }
  };

  return {
    addStock,
    getStocksByProduct,
    getStockById,
    deleteStock,
    getStocksByDate,
  };
};

export default useStockQueries;
