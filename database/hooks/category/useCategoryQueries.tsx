import { useSQLiteContext } from "expo-sqlite";

const useCategoryQueries = () => {
  const db = useSQLiteContext();

  // Add a new category
  const addCategory = async (name: string, rating: number = 0) => {
    try {
      await db.runAsync(
        `INSERT INTO Category (name, rating) VALUES (?, ?)`,
        [name, rating]
      );
      console.log("Category added successfully.");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Get all categories with pagination
  const getCategories = async (limit: number = 1000, offset: number = 0) => {
    try {
      const categories = await db.getAllAsync(
        `SELECT * FROM Category ORDER BY name ASC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  // Get a category by ID
  const getCategoryById = async (id: number) => {
    try {
      const category = await db.getAllAsync(
        `SELECT * FROM Category WHERE id = ?`,
        [id]
      );
      return category[0];
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      return null;
    }
  };

  // Update an existing category
  const updateCategory = async (id: number, name: string, rating: number) => {
    try {
      await db.runAsync(
        `UPDATE Category SET name = ?, rating = ? WHERE id = ?`,
        [name, rating, id]
      );
      console.log("Category updated successfully.");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Delete a category
  const deleteCategory = async (id: number) => {
    try {
      await db.runAsync(`DELETE FROM Category WHERE id = ?`, [id]);
      console.log("Category deleted successfully.");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Get categories with a specific rating or higher
  const getCategoriesByRating = async (minRating: number) => {
    try {
      const categories = await db.getAllAsync(
        `SELECT * FROM Category WHERE rating >= ? ORDER BY rating DESC`,
        [minRating]
      );
      return categories;
    } catch (error) {
      console.error("Error fetching categories by rating:", error);
      return [];
    }
  };

  return {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCategoriesByRating,
  };
};

export default useCategoryQueries;