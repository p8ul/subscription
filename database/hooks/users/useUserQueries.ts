import { userQueries } from "@/database/queries/user";
import { useSQLiteContext } from "expo-sqlite";

const useUserQueries = () => {
  const db = useSQLiteContext();

  // Initialize the User table
  const initializeUserTable = async () => {
    try {
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS User (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          email TEXT,
          phone TEXT UNIQUE,
          meta JSON,
          isDeleted INTEGER DEFAULT 0, -- 0 means not deleted, 1 means deleted
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("User table initialized successfully.");
    } catch (error) {
      console.error("Error initializing User table:", error);
    }
  };

  const dummyUsers = async () => {
    await db.runAsync(userQueries.insertDummy);
  };

  // Create a new user
  const createUser = async ({ name, email, phone, meta }) => {
    try {
      const user = await db.runAsync(
        `INSERT INTO User (name, email, phone, meta) VALUES (?, ?, ?, ?)`,
        [name, email, phone, JSON.stringify(meta)]
      );
      console.log("User created successfully.");
      return user.lastInsertRowId;
    } catch (error) {
      if (error.message.includes("UNIQUE constraint failed")) {
        console.error("Error: Phone number already exists.");
      } else {
        console.error("Error creating user:", error);
      }
    }
  };

  const getUser = async (id: number) => {
    const results = await db.getAllAsync(`SELECT * FROM User where id = ? `, [
      id,
    ]);
    return results.map((user) => ({ ...user, meta: JSON.parse(user.meta) }));
  };

  // Fetch all active users (excluding soft-deleted ones)
  const getUsers = async () => {
    try {
      const results = await db.getAllAsync(
        `SELECT * FROM User WHERE isDeleted = 0 order by createdAt desc`
      );
      return results.map((user) => ({ ...user, meta: JSON.parse(user.meta) }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  // Update user details
  const updateUser = async ({ id, name, email, phone, meta }) => {
    try {
      const user = await db.runAsync(
        `UPDATE User SET name = ?, email = ?, phone = ?, meta = ?, createdAt = DATETIME('now')   WHERE id = ?`,
        [name, email, phone, JSON.stringify(meta), id]
      );
      console.log(`User with ID ${id} updated successfully.`);
      return user.lastInsertRowId;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Soft delete a user
  const softDeleteUser = async (id) => {
    try {
      await db.runAsync(`UPDATE User SET isDeleted = 1 WHERE id = ?`, [id]);
      console.log(`User with ID ${id} soft-deleted successfully.`);
    } catch (error) {
      console.error("Error soft deleting user:", error);
    }
  };

  // Restore a soft-deleted user
  const restoreUser = async (id) => {
    try {
      await db.runAsync(`UPDATE User SET isDeleted = 0 WHERE id = ?`, [id]);
      console.log(`User with ID ${id} restored successfully.`);
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  };

  // Permanently delete a user (optional)
  const permanentlyDeleteUser = async (id) => {
    try {
      await db.runAsync(`DELETE FROM User WHERE id = ?`, [id]);
      console.log(`User with ID ${id} permanently deleted.`);
    } catch (error) {
      console.error("Error permanently deleting user:", error);
    }
  };

  return {
    initializeUserTable,
    createUser,
    getUsers,
    updateUser,
    softDeleteUser,
    restoreUser,
    permanentlyDeleteUser,
    dummyUsers,
    getUser,
  };
};

export default useUserQueries;
