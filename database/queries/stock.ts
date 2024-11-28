export const stockQueries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS Stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL, -- References the Product table
    quantity INTEGER NOT NULL, -- Quantity added or removed
    note TEXT, -- Description or additional notes about the stock change
    supplier TEXT, -- Optional: supplier or source of the stock
    isDeleted INTEGER DEFAULT 0, -- 0 means not deleted, 1 means deleted
    batchNumber TEXT, -- Optional: batch number for traceability
    expiryDate TIMESTAMP, -- Optional: expiry date if applicable
    dateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date the stock was added
    FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
);
    `,
};
