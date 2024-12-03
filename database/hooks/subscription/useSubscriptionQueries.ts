import { subscriptionQueries } from "@/database/queries/subscription";
import { useSQLiteContext } from "expo-sqlite";

const useSubscriptionQueries = () => {
  const db = useSQLiteContext();

  // Create or initialize the Subscription table
  const initializeSubscriptionTable = async () => {
    try {
      await db.runAsync(subscriptionQueries.createTable);
      console.log("Subscription table initialized.");
    } catch (error) {
      console.error("Error initializing subscription table:", error);
    }
  };

  // Edit an existing subscription
  const editSubscription = async ({
    id,
    userId,
    name,
    amount,
    dueDate,
    meta,
  }) => {
    try {
      const result = await db.runAsync(
        `UPDATE Subscription 
       SET userId = ?, 
           name = ?, 
           amount = ?, 
           dueDate = ?, 
           meta = ? 
       WHERE id = ?`,
        [userId, name, amount, dueDate, JSON.stringify(meta), id]
      );
      console.log(`Subscription with ID ${id} updated successfully.`);
      return result.rowsAffected > 0; // Returns true if rows were updated
    } catch (error) {
      console.error("Error updating subscription:", error);
      return false;
    }
  };

  // Add a subscription
  const addSubscription = async ({ userId, amount, dueDate, meta, name }) => {
    try {
      await db.runAsync(
        `INSERT INTO Subscription (userId, name, amount, dueDate, meta) VALUES (?, ?, ?, ?, ?)`,
        [userId, name, amount, dueDate, JSON.stringify(meta)]
      );
      console.log("Subscription added successfully.");
    } catch (error) {
      console.error("Error adding subscription:", error);
    }
  };

  // Fetch all subscriptions

  const getAllSubscriptions = async (startDate = null, endDate = null, status = null) => {
    try {
      // Construct the SQL query dynamically based on provided filters
      let query = `
        SELECT 
          Subscription.id AS subscriptionId,
          Subscription.name AS subscriptionName,
          Subscription.userId,
          Subscription.amount,
          Subscription.dueDate,
          Subscription.status,
          Subscription.createdAt,
          Subscription.meta,
          User.name AS userName,
          User.email AS userEmail,
          User.phone AS userPhone,
          (SELECT SUM(amount) FROM Subscription WHERE isDeleted = 0) AS totalAmount
        FROM Subscription
        INNER JOIN User ON Subscription.userId = User.id
        WHERE Subscription.isDeleted = 0
      `;
  
      const params = [];
  
      // Add date filtering to the query if startDate or endDate is provided
      if (startDate && endDate) {
        query += ` AND Subscription.dueDate BETWEEN ? AND ?`;
        params.push(startDate, endDate);
      }
  
      // Add status filtering to the query if a status is provided
      if (status) {
        query += ` AND Subscription.status = ?`;
        params.push(status);
      }
  
      console.log("Executing SQL Query:", query, "With Params:", params);
  
      const result = await db.getAllAsync(query, params);
  
      // Map over the result to parse meta and structure the subscriptions
      const subscriptions = result.map((sub) => {
        let parsedMeta;
  
        try {
          parsedMeta = sub.meta ? JSON.parse(sub.meta) : {}; // Safely parse meta JSON
        } catch (error) {
          console.error("Error parsing meta JSON:", error, "Meta:", sub.meta);
          parsedMeta = {}; // Fallback to an empty object
        }
  
        return {
          id: sub.subscriptionId, // Use alias 'subscriptionId'
          name: sub.subscriptionName, // Use alias 'subscriptionName'
          userId: sub.userId,
          amount: sub.amount,
          dueDate: sub.dueDate,
          status: sub.status,
          createdAt: sub.createdAt,
          meta: parsedMeta, // Safely parsed meta
          user: {
            name: sub.userName,
            email: sub.userEmail,
            phone: sub.userPhone,
          },
        };
      });
  
      // Extract the total amount from the first row
      const totalAmount = result.length > 0 ? result[0].totalAmount : 0;
  
      return { subscriptions, totalAmount };
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      return { subscriptions: [], totalAmount: 0 };
    }
  };
  const getUserSubscriptions = async ({ userId }) => {
    try {
      const result = await db.getAllAsync(
        `SELECT 
          id, 
          name, 
          userId, 
          amount, 
          dueDate, 
          status, 
          createdAt, 
          meta,
          (SELECT SUM(amount) FROM Subscription WHERE userId = ? AND isDeleted = 0) AS totalAmount
         FROM Subscription 
         WHERE userId = ? AND isDeleted = 0`,
        [userId, userId]
      );

      const subscriptions = result.map((sub) => ({
        id: sub.id,
        name: sub.name,
        userId: sub.userId,
        amount: sub.amount,
        dueDate: sub.dueDate,
        status: sub.status,
        createdAt: sub.createdAt,
        meta: JSON.parse(sub.meta), // Parse meta JSON string back to an object
      }));

      // Extract the total amount from the first row (it's the same for all rows)
      const totalAmount = result.length > 0 ? result[0].totalAmount : 0;

      return { subscriptions, totalAmount };
    } catch (error) {
      console.error("Error fetching user subscriptions:", error);
      return { subscriptions: [], totalAmount: 0 };
    }
  };

  // Mark a subscription as paid
  const markSubscriptionAsPaid = async (id, paymentDate = new Date()) => {
    try {
      await db.runAsync(
        `UPDATE Subscription SET status = 'paid', paymentDate = ? WHERE id = ?`,
        [paymentDate.toISOString(), id]
      );
      console.log(`Subscription ${id} marked as paid.`);
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }
  };

  // Soft delete a subscription
  const softDeleteSubscription = async (id) => {
    try {
      await db.runAsync(`UPDATE Subscription SET isDeleted = 1 WHERE id = ?`, [
        id,
      ]);
      console.log(`Subscription with ID ${id} soft-deleted successfully.`);
    } catch (error) {
      console.error("Error soft deleting subscription:", error);
    }
  };

  // Check and update overdue subscriptions
  const updateOverdueSubscriptions = async () => {
    try {
      const overdueSubscriptions = await db.getAllAsync(
        `SELECT * FROM Subscription WHERE status = 'pending' AND dueDate < ?`,
        [new Date().toISOString()]
      );

      for (const subscription of overdueSubscriptions) {
        await db.runAsync(
          `UPDATE Subscription SET status = 'overdue' WHERE id = ?`,
          [subscription.id]
        );
      }
      console.log("Overdue subscriptions updated.");
    } catch (error) {
      console.error("Error updating overdue subscriptions:", error);
    }
  };

  const generateNextMonthSubscriptions = async () => {
    try {
      const activeSubscriptions = await db.getAllAsync(
        `SELECT * FROM Subscription WHERE status = 'paid'`
      );
      console.log("activeSubscriptions :>> ", activeSubscriptions);

      for (const sub of activeSubscriptions) {
        const nextDueDate = new Date(sub.dueDate);
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        // Check if a subscription for the same user and next month already exists
        const existingSubscription = await db.getAllAsync(
          `SELECT * FROM Subscription 
           WHERE userId = ? 
           AND name = ? 
           AND strftime('%Y-%m', dueDate) = ? 
           AND isDeleted = 0`,
          [
            sub.userId,
            sub.name,
            `${nextDueDate.getFullYear()}-${(nextDueDate.getMonth() + 1).toString().padStart(2, "0")}`,
          ]
        );

        if (existingSubscription.length === 0) {
          // Add the next month's subscription if it doesn't exist
          await addSubscription({
            userId: sub.userId,
            amount: sub.amount,
            dueDate: nextDueDate.toISOString(),
            meta: sub.meta,
            name: sub.name,
          });
          console.log(
            `Next month's subscription created for user ${sub.userId} with due date ${nextDueDate.toISOString()}`
          );
        } else {
          console.log(
            `Subscription for user ${sub.userId} with due date ${nextDueDate.toISOString()} already exists.`
          );
        }
      }

      console.log("Next month's subscriptions generation completed.");
    } catch (error) {
      console.error("Error generating next month's subscriptions:", error);
    }
  };
  // Restore a soft-deleted subscription
  const restoreSubscription = async (id) => {
    try {
      await db.runAsync(`UPDATE Subscription SET isDeleted = 0 WHERE id = ?`, [
        id,
      ]);
      console.log(`Subscription with ID ${id} restored successfully.`);
    } catch (error) {
      console.error("Error restoring subscription:", error);
    }
  };
  // Permanently delete a subscription (optional)
  const permanentlyDeleteSubscription = async (id) => {
    try {
      await db.runAsync(`DELETE FROM Subscription WHERE id = ?`, [id]);
      console.log(`Subscription with ID ${id} permanently deleted.`);
    } catch (error) {
      console.error("Error permanently deleting subscription:", error);
    }
  };

  return {
    initializeSubscriptionTable,
    addSubscription,
    getAllSubscriptions,
    markSubscriptionAsPaid,
    updateOverdueSubscriptions,
    generateNextMonthSubscriptions,
    restoreSubscription,
    softDeleteSubscription,
    permanentlyDeleteSubscription,
    getUserSubscriptions,
    editSubscription,
  };
};

export default useSubscriptionQueries;
