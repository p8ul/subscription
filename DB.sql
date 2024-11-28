CREATE TABLE IF NOT EXISTS Product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category INTEGER NOT NULL, 
  description TEXT,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  buyingPrice REAL NOT NULL,
  volume REAL, 
  alcoholPercentage REAL,
  measurementUnit TEXT CHECK (measurementUnit IN ('ml', 'liter')),
  rating INTEGER DEFAULT 0,
  image TEXT,
  Meta TEXT, -- JSON data as a TEXT field
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  origin TEXT,
  FOREIGN KEY (category) REFERENCES Category(id) ON DELETE SET NULL
);

--
CREATE TRIGGER IF NOT EXISTS update_timestamp
AFTER UPDATE ON Product
FOR EACH ROW
BEGIN
  UPDATE Product SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;



--
CREATE TABLE IF NOT EXISTS Category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  rating INTEGER
);

--
INSERT INTO Category (name) VALUES 
  ('Blended Whisky'),
  ('Gin'),
  ('Cognac'),
  ('Vapes'),
  ('White Wine'),
  ('Liqueur'),
  ('Red Wine'),
  ('Tequila'),
  ('Red Sweet Wine'),
  ('Rosé Wine'),
  ('Beer'),
  ('Vodka'),
  ('Rum');


  ---
  INSERT INTO Product (name, category, description, quantity, price, volume, alcoholPercentage, measurementUnit, rating, image, Meta, origin) 
VALUES 
  ('The Glenlivet', (SELECT id FROM Category WHERE name = 'Blended Whisky'), 'Aged 12 years', 50, 199.99, 750, 40, 'ml', 5, 'https://example.com/glenlivet.jpg', '{"country":"Scotland"}', 'Scotland'),
  ('Tanqueray', (SELECT id FROM Category WHERE name = 'Gin'), 'London Dry Gin', 30, 25.99, 700, 47.3, 'ml', 4, 'https://example.com/tanqueray.jpg', '{"flavor":"juniper"}', 'United Kingdom'),
  ('Hennessy VS', (SELECT id FROM Category WHERE name = 'Cognac'), 'Very Special Cognac', 20, 49.99, 750, 40, 'ml', 5, 'https://example.com/hennessy.jpg', '{"age":"VS"}', 'France'),
  ('Patron Silver', (SELECT id FROM Category WHERE name = 'Tequila'), 'Smooth Silver Tequila', 40, 45.00, 750, 40, 'ml', 4, 'https://example.com/patron.jpg', '{"agave":"blue"}', 'Mexico'),
  ('Moet & Chandon', (SELECT id FROM Category WHERE name = 'White Wine'), 'Premium French Champagne', 15, 59.99, 750, 12, 'ml', 5, 'https://example.com/moet.jpg', '{"region":"Champagne"}', 'France'),
  ('Marlboro Menthol', (SELECT id FROM Category WHERE name = 'Vapes'), 'Menthol Flavor', 100, 9.99, NULL, NULL, NULL, 3, 'https://example.com/marlboro.jpg', '{"type":"menthol"}', 'USA');