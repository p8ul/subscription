export const orderQueries = {
  createTable: `CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    products TEXT NOT NULL, -- JSON string of products
    total REAL NOT NULL,
    paymentType TEXT NOT NULL,
    isDeleted INTEGER DEFAULT 0, -- 0 means not deleted, 1 means deleted
    tax REAL DEFAULT 0.0,        -- Total tax applied to the order
    shippingCost REAL DEFAULT 0.0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);`,
  createOrder: `INSERT INTO Orders (products, total, paymentType, createdAt, updatedAt)
VALUES (?, ?, ?, datetime('now'), datetime('now'));`,
findAll: `
  SELECT * FROM Orders WHERE isDeleted = 0;
`,
  findAlls: `SELECT * FROM Orders WHERE isDeleted = 0
ORDER BY createdAt DESC
LIMIT ? OFFSET ?;`,
  findByDate: `SELECT * FROM Orders
WHERE DATE(createdAt) = DATE(?) AND isDeleted = 0;`,
  findBetweenDates: `SELECT * FROM Orders
WHERE DATE(createdAt) BETWEEN DATE(?) AND DATE(?) AND isDeleted = 0;`,
  update: `UPDATE Orders
SET products = ?, total = ?, paymentType = ?, updatedAt = datetime('now')
WHERE id = ? AND isDeleted = 0;`,
  delete: `DELETE FROM Orders
WHERE id = ?;`,
  softDelete: `UPDATE Orders
SET isDeleted = 1
WHERE id = ?;`,
  get: `SELECT * FROM Orders
WHERE id = ?;`,
};
