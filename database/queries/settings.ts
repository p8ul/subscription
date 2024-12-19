export const settingsQueries = {
  createTable: `CREATE TABLE IF NOT EXISTS Settingss (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    storeName TEXT NOT NULL UNIQUE,    -- Name of the store, default is 'My Store'
    currency TEXT DEFAULT 'KSH',          -- Currency, default is 'KSH'
    timezone TEXT DEFAULT 'Africa/Nairobi',     -- Offset in hours from UTC, default to EAT (UTC+3)
    paybillNumber TEXT,
    accountNumber TEXT,
    tillNumber TEXT,
    phoneNumber TEXT,
    autoGenerateNextMonth  INTEGER DEFAULT 1,
    meta TEXT -- JSON data as a TEXT field
);`,
  populateItems: `INSERT OR IGNORE INTO Settingss (storeName, currency, timezone) 
VALUES ('Subscription', 'KSH', 'Africa/Nairobi');`,
};
