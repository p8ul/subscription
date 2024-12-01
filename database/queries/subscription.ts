export const subscriptionQueries = {
    createTable: `CREATE TABLE IF NOT EXISTS Subscription (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  userId INTEGER,
  amount REAL,
  dueDate DATETIME,
  status TEXT DEFAULT 'pending', -- pending, paid
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  meta JSON, -- Custom fields
  isDeleted INTEGER DEFAULT 0, -- 0 means not deleted, 1 means deleted
  FOREIGN KEY (userId) REFERENCES User (id)
);`
} 