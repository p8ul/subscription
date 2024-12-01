export const userQueries = {
  createTable: `CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  phone TEXT UNIQUE,
  meta JSON, -- Custom fields
  isDeleted INTEGER DEFAULT 0, -- 0 means not deleted, 1 means deleted
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);`,
  insertDummy: ` INSERT OR IGNORE INTO User (name, email, phone, meta) 
      VALUES 
        ('Zuleikha Chu (A2-F5)', 'john.doe@example.com', '254711609803', '[{ "name": "house", "value": "A2" },{ "name": "floor", "value": "5" },{ "name": "port", "value": "2-2" },{ "name": "ipAddress", "value": "192.168.1.76" },{ "name": "mac", "value": "B8:3A:08" }]'),
        ('Carol (A1-f2)', 'jane.smith@example.com', '254715381838', '[{ "name": "house", "value": "A1" },{ "name": "floor", "value": "2" },{ "name": "port", "value": "1-" },{ "name": "ipAddress", "value": "192.168.1.187" },{ "name": "mac", "value": "B8:3A:08" }]'),
        ('Allan (A1-F3)', 'alice.johnson@example.com', '254715732243', '[{ "name": "house", "value": "A1" },{ "name": "floor", "value": "3" },{ "name": "port", "value": "2-2" },{ "name": "ipAddress", "value": "192.168.1.250" },{ "name": "mac", "value": "B8:3A:08" }]'),
        ('GACHOKA (A3-F5)', 'bob.brown@example.com', '254745250130', '[{ "name": "house", "value": "A3" },{ "name": "floor", "value": "5" },{ "name": "port", "value": "2-3" },{ "name": "ipAddress", "value": "192.168.1.165" },{ "name": "mac", "value": "B8:3A:08" }]'),
        ('Wycliffe (A6 - F3)', 'charlie.davis@example.com', '254723974140', '[{ "name": "house", "value": "A6" },{ "name": "floor", "value": "3" },{ "name": "port", "value": "2-4" },{ "name": "ipAddress", "value": "192.168.1.36" },{ "name": "mac", "value": "D8:32:14" }]'),
        ('Nduati (A2 - F4)', 'emily.white@example.com', '254721585209', '[{ "name": "house", "value": "A2" },{ "name": "floor", "value": "5" },{ "name": "port", "value": "2-2" },{ "name": "ipAddress", "value": "192.168.1.210" },{ "name": "mac", "value": "3C:84:6A" }]');
        ('Esther (A4 F4)', 'emily.white@example.com', '254758828319', '[{ "name": "house", "value": "A4" },{ "name": "floor", "value": "4" },{ "name": "port", "value": "2-2" },{ "name": "ipAddress", "value": "192.168.1.76" },{ "name": "mac", "value": "B8:3A:08" }]');
    `,
};
