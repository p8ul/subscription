export const productQueries = {
  createTable: `CREATE TABLE IF NOT EXISTS Product (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category INTEGER NOT NULL, 
    description TEXT,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    buyingPrice REAL,
    volume REAL, 
    alcoholPercentage REAL,
    measurementUnit TEXT CHECK (measurementUnit IN ('ml', 'liter')),
    rating INTEGER DEFAULT 0,
    image TEXT,
    Meta TEXT, -- JSON data as a TEXT field
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    origin TEXT,
    threshold INTEGER DEFAULT 1,
    FOREIGN KEY (category) REFERENCES Category(id) ON DELETE SET NULL,
    UNIQUE (name, measurementUnit, volume) -- Adding the unique constraint here
  );
  `,
  updateUnique: `ALTER TABLE Product
ADD CONSTRAINT unique_name_measurementUnit UNIQUE (name, measurementUnit, volume);`,
  updateTriggers: `CREATE TRIGGER IF NOT EXISTS update_timestamp
  AFTER UPDATE ON Product
  FOR EACH ROW
  BEGIN
    UPDATE Product SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
  END;`,
  addThreshold: `ALTER TABLE Product ADD COLUMN threshold INTEGER DEFAULT 1;`,
  createProducts: `
 -- Example SQL Inserts for Product Table with Multiple Volumes
 INSERT OR IGNORE INTO Product 
(name, category, description, quantity, price, volume, measurementUnit, rating, Meta, origin) 
VALUES
-- 'A' Category Products
('All Seasons', (SELECT id FROM Category WHERE name = 'Whisky'), 'Popular whisky', 0, 1400, 750, 'ml', 5, '{"type":"Whisky"}', 'Kenya'),
('All Seasons', (SELECT id FROM Category WHERE name = 'Whisky'), 'Popular whisky', 0, 790, 375, 'ml', 5, '{"type":"Whisky"}', 'Kenya'),
('All Seasons', (SELECT id FROM Category WHERE name = 'Whisky'), 'Popular whisky', 0, 490, 250, 'ml', 5, '{"type":"Whisky"}', 'Kenya'),
('Atlas', (SELECT id FROM Category WHERE name = 'Whisky'), 'Affordable whisky', 0, 350, 500, 'ml', 5, '{"type":"Whisky"}', 'Kenya'),
('Avalon', (SELECT id FROM Category WHERE name = 'Vodka'), 'Smooth vodka', 0, 240, 250, 'ml', 4, '{"type":"Vodka"}', 'Kenya'),
('Ace', (SELECT id FROM Category WHERE name = 'Gin'), 'Classic gin', 0, 750, 750, 'ml', 4, '{"type":"Gin"}', 'Kenya'),

-- 'B' Category Products
('Balozi', (SELECT id FROM Category WHERE name = 'Beer'), 'Local beer', 0, 250, 500, 'ml', 3, '{"type":"Beer"}', 'Kenya'),
('Best Gin', (SELECT id FROM Category WHERE name = 'Gin'), 'High-quality gin', 0, 950, 750, 'ml', 4, '{"type":"Gin"}', 'Kenya'),
('Best Gin', (SELECT id FROM Category WHERE name = 'Gin'), 'High-quality gin', 0, 330, 250, 'ml', 4, '{"type":"Gin"}', 'Kenya'),
('Best Vodka', (SELECT id FROM Category WHERE name = 'Vodka'), 'Premium vodka', 0, 930, 750, 'ml', 4, '{"type":"Vodka"}', 'Kenya'),
('Best Vodka', (SELECT id FROM Category WHERE name = 'Vodka'), 'Premium vodka', 0, 330, 250, 'ml', 4, '{"type":"Vodka"}', 'Kenya'),
('Best Whisky', (SELECT id FROM Category WHERE name = 'Whisky'), 'Premium whisky', 0, 1400, 750, 'ml', 4, '{"type":"Whisky"}', 'Kenya'),
('Blue Ice', (SELECT id FROM Category WHERE name = 'Vodka'), 'Affordable vodka', 0, 250, 250, 'ml', 3, '{"type":"Vodka"}', 'Kenya'),

-- 'C' Category Products
('County', (SELECT id FROM Category WHERE name = 'Gin'), 'Quality gin', 0, 850, 750, 'ml', 3, '{"type":"Gin"}', 'Kenya'),
('County', (SELECT id FROM Category WHERE name = 'Gin'), 'Quality gin', 0, 430, 350, 'ml', 3, '{"type":"Gin"}', 'Kenya'),
('Captain Morgan', (SELECT id FROM Category WHERE name = 'Rum'), 'Classic rum', 0, 1150, 750, 'ml', 5, '{"type":"Rum"}', 'Jamaica'),

-- 'G' Category Products
('Guinness', (SELECT id FROM Category WHERE name = 'Beer'), 'Irish stout beer', 0, 250, 500, 'ml', 4, '{"type":"Beer"}', 'Ireland'),
('Gordons', (SELECT id FROM Category WHERE name = 'Gin'), 'Premium gin', 0, 1500, 750, 'ml', 4, '{"type":"Gin"}', 'UK'),
('Gordons', (SELECT id FROM Category WHERE name = 'Gin'), 'Premium gin', 0, 250, 250, 'ml', 4, '{"type":"Gin"}', 'UK'),

-- 'H' Category Products
('Hunters', (SELECT id FROM Category WHERE name = 'Cider'), 'South African cider', 0, 650, 750, 'ml', 4, '{"type":"Cider"}', 'South Africa'),
('Hunters', (SELECT id FROM Category WHERE name = 'Cider'), 'South African cider', 0, 570, 500, 'ml', 4, '{"type":"Cider"}', 'South Africa'),
('Hunters', (SELECT id FROM Category WHERE name = 'Cider'), 'South African cider', 0, 410, 250, 'ml', 4, '{"type":"Cider"}', 'South Africa'),

-- 'J' Category Products
('Jack Daniels', (SELECT id FROM Category WHERE name = 'Whisky'), 'Classic Tennessee Whisky', 0, 4500, 1000, 'ml', 5, '{"type":"Whisky"}', 'USA'),
('Jack Daniels', (SELECT id FROM Category WHERE name = 'Whisky'), 'Classic Tennessee Whisky', 0, 3500, 750, 'ml', 5, '{"type":"Whisky"}', 'USA'),

-- 'K' Category Products
('Kenya Cane - Pineapple', (SELECT id FROM Category WHERE name = 'Vodka'), 'Flavored vodka - pineapple', 0, 750, 750, 'ml', 4, '{"type":"Vodka"}', 'Kenya'),
('Kenya Cane - Pineapple', (SELECT id FROM Category WHERE name = 'Vodka'), 'Flavored vodka - pineapple', 0, 330, 250, 'ml', 4, '{"type":"Vodka"}', 'Kenya'),
('Kenya Cane - Coconut', (SELECT id FROM Category WHERE name = 'Vodka'), 'Flavored vodka - coconut', 0, 750, 750, 'ml', 4, '{"type":"Vodka"}', 'Kenya'),
('Kenya Cane - Coconut', (SELECT id FROM Category WHERE name = 'Vodka'), 'Flavored vodka - coconut', 0, 330, 250, 'ml', 4, '{"type":"Vodka"}', 'Kenya'),

-- 'S' Category Products
('Smirnoff Vodka', (SELECT id FROM Category WHERE name = 'Vodka'), 'Popular vodka', 0, 850, 750, 'ml', 4, '{"type":"Vodka"}', 'UK'),
('Smirnoff Vodka', (SELECT id FROM Category WHERE name = 'Vodka'), 'Popular vodka', 0, 550, 350, 'ml', 4, '{"type":"Vodka"}', 'UK'),
('Snap', (SELECT id FROM Category WHERE name = 'Beer'), 'Refreshing beer', 0, 220, 500, 'ml', 3, '{"type":"Beer"}', 'Kenya');`,
  createProducts2: `INSERT OR IGNORE INTO Product (name, category, description, quantity, price, volume, alcoholPercentage, measurementUnit, rating, image, Meta, origin)
VALUES
  ('Johnnie Walker Black Label', 
   (SELECT id FROM Category WHERE name = 'Blended Whisky'), 
   'Aged 12 years, smooth and complex', 
   50, 45.99, 750, 40, 'ml', 5, 
   'https://example.com/johnniewalker.jpg', 
   '{"country":"Scotland", "blend":"Black Label"}', 
   'Scotland'),

  ('Jack Daniel''s Tennessee Whiskey', 
   (SELECT id FROM Category WHERE name = 'Bourbon'), 
   'Smooth Tennessee whiskey', 
   40, 39.99, 750, 40, 'ml', 4, 
   'https://example.com/jackdaniels.jpg', 
   '{"distillery":"Lynchburg"}', 
   'USA'),

  ('Absolut Vodka', 
   (SELECT id FROM Category WHERE name = 'Vodka'), 
   'Premium vodka made from winter wheat', 
   60, 29.99, 750, 40, 'ml', 4, 
   'https://example.com/absolut.jpg', 
   '{"country":"Sweden"}', 
   'Sweden'),

  ('Captain Morgan Original Spiced Rum', 
   (SELECT id FROM Category WHERE name = 'Rum'), 
   'Smooth and spiced Caribbean rum', 
   30, 25.00, 750, 35, 'ml', 4, 
   'https://example.com/captainmorgan.jpg', 
   '{"spice":"original"}', 
   'Jamaica'),

  ('Baileys Irish Cream', 
   (SELECT id FROM Category WHERE name = 'Liqueur'), 
   'Creamy liqueur with Irish whiskey', 
   20, 19.99, 750, 17, 'ml', 5, 
   'https://example.com/baileys.jpg', 
   '{"flavor":"Irish cream"}', 
   'Ireland'),

  ('Corona Extra', 
   (SELECT id FROM Category WHERE name = 'Beer'), 
   'Crisp and refreshing pale lager', 
   100, 2.50, 355, 4.5, 'ml', 4, 
   'https://example.com/corona.jpg', 
   '{"type":"pale lager"}', 
   'Mexico'),

  ('Martini Rosso', 
   (SELECT id FROM Category WHERE name = 'Vermouth'), 
   'Sweet Italian vermouth with herbal flavor', 
   25, 10.99, 750, 15, 'ml', 4, 
   'https://example.com/martinirosso.jpg', 
   '{"flavor":"herbal"}', 
   'Italy'),

  ('Heineken', 
   (SELECT id FROM Category WHERE name = 'Beer'), 
   'Premium Dutch pale lager', 
   80, 2.99, 500, 5, 'ml', 4, 
   'https://example.com/heineken.jpg', 
   '{"origin":"Netherlands"}', 
   'Netherlands'),

  ('Smirnoff Ice', 
   (SELECT id FROM Category WHERE name = 'Cooler'), 
   'Refreshing vodka cooler with lemon flavor', 
   50, 3.50, 300, 4.5, 'ml', 3, 
   'https://example.com/smirnoffice.jpg', 
   '{"flavor":"lemon"}', 
   'UK'),

  ('The Glenlivet', 
   (SELECT id FROM Category WHERE name = 'Blended Whisky'), 
   'Aged 12 years', 
   50, 199.99, 750, 40, 'ml', 5, 
   'https://example.com/glenlivet.jpg', 
   '{"country":"Scotland"}', 
   'Scotland'),

  ('Tanqueray', 
   (SELECT id FROM Category WHERE name = 'Gin'), 
   'London Dry Gin', 
   30, 25.99, 700, 47.3, 'ml', 4, 
   'https://example.com/tanqueray.jpg', 
   '{"flavor":"juniper"}', 
   'United Kingdom'),

  ('Hennessy VS', 
   (SELECT id FROM Category WHERE name = 'Cognac'), 
   'Very Special Cognac', 
   20, 49.99, 750, 40, 'ml', 5, 
   'https://example.com/hennessy.jpg', 
   '{"age":"VS"}', 
   'France'),

  ('Patron Silver', 
   (SELECT id FROM Category WHERE name = 'Tequila'), 
   'Smooth Silver Tequila', 
   40, 45.00, 750, 40, 'ml', 4, 
   'https://example.com/patron.jpg', 
   '{"agave":"blue"}', 
   'Mexico'),

  ('Moet & Chandon', 
   (SELECT id FROM Category WHERE name = 'White Wine'), 
   'Premium French Champagne', 
   15, 59.99, 750, 12, 'ml', 5, 
   'https://example.com/moet.jpg', 
   '{"region":"Champagne"}', 
   'France'),

  ('Marlboro Menthol', 
   (SELECT id FROM Category WHERE name = 'Vapes'), 
   'Menthol Flavor', 
   100, 9.99, NULL, NULL, NULL, 3, 
   'https://example.com/marlboro.jpg', 
   '{"type":"menthol"}', 
   'USA');`,
  updateTable: `CREATE TABLE IF NOT EXISTS Product_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category INTEGER NOT NULL, 
    description TEXT,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    buyingPrice REAL,
    volume REAL, 
    alcoholPercentage REAL,
    measurementUnit TEXT CHECK (measurementUnit IN ('ml', 'liter')),
    rating INTEGER DEFAULT 0,
    image TEXT,
    Meta TEXT, -- JSON data as a TEXT field
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    origin TEXT,
    FOREIGN KEY (category) REFERENCES Category(id) ON DELETE SET NULL,
    UNIQUE (name, measurementUnit) -- Adding the unique constraint here
);`,
  copyData: `INSERT INTO Product_new (id, name, category, description, quantity, price, buyingPrice, volume, alcoholPercentage, measurementUnit, rating, image, Meta, createdAt, updatedAt, origin)
SELECT id, name, category, description, quantity, price, buyingPrice, volume, alcoholPercentage, measurementUnit, rating, image, Meta, createdAt, updatedAt, origin
FROM Product;`,
  deleteTable: `DROP TABLE Product;`,
  renameTable: `ALTER TABLE Product_new RENAME TO Product;`,
};
