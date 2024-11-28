import { useSQLiteContext } from "expo-sqlite";
import moment from "moment";
import useSettingsQueries from "../settings/useSettingsQueries";

const useOrderQueries = () => {
  const db = useSQLiteContext();
  const { getTimezoneOffset } = useSettingsQueries();

  // Add a new order
  const addOrder = async (
    products: string, // JSON string of products
    total: number,
    paymentType: string,
    tax: number = 0,
    shippingCost: number = 0
  ) => {
    try {
      await db.runAsync(
        `INSERT INTO Orders (products, total, paymentType, tax, shippingCost, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [products, total, paymentType, tax, shippingCost]
      );
      console.log("Order added successfully.");
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  // Get a paginated list of orders
  const getOrders = async (limit: number = 10, offset: number = 0) => {
    try {
      const orders = await db.getAllAsync(
        `SELECT * FROM Orders WHERE isDeleted = 0 ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };

  const fetchSalesByPaymentType = async () => {
    const query = `
    SELECT paymentType, SUM(total) as totalSales
    FROM Orders
    WHERE isDeleted = 0
    GROUP BY paymentType;
  `;

    try {
      return await db.getAllAsync(query);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const fetchMonthlySales = async () => {
    try {
      // Get the current year dynamically
      const currentYear = new Date().getFullYear();
  
      const query = `
        SELECT strftime('%Y-%m', createdAt) as month, SUM(total) as totalSales
        FROM Orders
        WHERE isDeleted = 0 AND strftime('%Y', createdAt) = ?
        GROUP BY strftime('%Y-%m', createdAt)
        ORDER BY month ASC;
      `;
      
      // Use the current year as a parameter
      return await db.getAllAsync(query, [currentYear.toString()]);
    } catch (error) {
      console.error("Error fetching monthly sales:", error);
      throw error;
    }
  };
  // Get an order by ID
  const getOrderById = async (id: number) => {
    try {
      const order = await db.getAllAsync(
        `SELECT * FROM Orders WHERE id = ? AND isDeleted = 0`,
        [id]
      );
      return order[0];
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      return null;
    }
  };

  // Soft delete an order
  const deleteOrder = async (id: number) => {
    try {
      // Step 1: Retrieve the order's products
      const order = await db.getAllAsync(
        `SELECT products FROM Orders WHERE id = ?`,
        [id]
      );
      const productsJSON = order?.[0]?.products;

      if (!productsJSON) {
        throw new Error("No products found for the specified order.");
      }

      // Step 2: Parse the products JSON
      const products = JSON.parse(productsJSON);

      // Step 3: Increment the quantities for each product
      for (const product of products) {
        await db.runAsync(
          `UPDATE Product SET quantity = quantity + ? WHERE id = ?`,
          [product.quantity, product.id]
        );
      }

      // Step 4: Soft delete the order
      await db.runAsync(
        `UPDATE Orders SET isDeleted = 1, updatedAt = datetime('now') WHERE id = ?`,
        [id]
      );

      console.log(
        "Order deleted successfully, and product quantities restored."
      );
    } catch (error) {
      console.error(
        "Error deleting order and restoring product quantities:",
        error
      );
    }
  };

  // Get orders by a specific date or between dates
  const getOrdersByDate = async (
    startDate: string,
    endDate: string | null = null
  ) => {
    try {
      const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
      const formattedEndDate = endDate
        ? moment(endDate).format("YYYY-MM-DD")
        : null;
      let query = `SELECT * FROM Orders WHERE isDeleted = 0 AND date(createdAt) >= date(?)`;
      const params: (string | number)[] = [formattedStartDate];

      if (formattedEndDate) {
        query += ` AND date(createdAt) <= date(?)`;
        params.push(formattedEndDate);
      }

      query += ` ORDER BY createdAt DESC`;

      const orders = await db.getAllAsync(query, params);
      return orders;
    } catch (error) {
      console.error("Error fetching orders by date:", error);
      return [];
    }
  };

  // Update an existing order
  const updateOrder = async (
    id: number,
    products: string,
    total: number,
    paymentType: string,
    tax: number,
    shippingCost: number
  ) => {
    try {
      await db.runAsync(
        `UPDATE Orders SET products = ?, total = ?, paymentType = ?, tax = ?, shippingCost = ?, updatedAt = datetime('now')
         WHERE id = ? AND isDeleted = 0`,
        [products, total, paymentType, tax, shippingCost, id]
      );
      console.log("Order updated successfully.");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return {
    addOrder,
    getOrders,
    getOrderById,
    deleteOrder,
    getOrdersByDate,
    updateOrder,
    fetchSalesByPaymentType,
    fetchMonthlySales
  };
};

export default useOrderQueries;
