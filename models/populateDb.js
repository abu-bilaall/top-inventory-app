const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS categories(
    category_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS brands(
    brand_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    country_of_origin TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS motorcycles(
    motorcyle_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    model_name TEXT NOT NULL,
    brand_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    engine_cc INTEGER NOT NULL CHECK (engine_cc > 0),
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    image_url TEXT,
    CONSTRAINT fk_brand_id --foreign key
        FOREIGN KEY(brand_id)
        REFERENCES brands(brand_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category_id --foreign key
        FOREIGN KEY(category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_motorcycle_entry
        UNIQUE(model_name, brand_id, year)
);

INSERT INTO categories (name, description) 
VALUES ('Standard Bikes', 'They are street motorcycles that conform to a stereotypical image of a motorcycle, with an exposed engine and fuel tank above it.'),
('Cruiser', 'They are styled after American motorcycles from the 1930s to the early 1960s, such as those made by Harley-Davidson, Indian, and Excelsior-Henderson.');

INSERT INTO brands (name, country_of_origin) 
VALUES ('Harley-Davidson', 'USA'),
('Kawasaki', 'Japan');

INSERT INTO motorcycles (
    model_name, 
    brand_id, 
    category_id, 
    year, 
    engine_cc, 
    price, 
    stock_quantity, 
    description, 
    image_url
) VALUES 
    ('Sportster S', 1, 2, 2023, 1250, 15999.99, 5, 'Modern cruiser with Revolution Max engine', 'https://example.com/harley-sportster.jpg'),
    ('Ninja 650', 2, 1, 2023, 649, 7999.99, 10, 'Agile standard bike with parallel-twin engine', 'https://example.com/ninja-650.jpg');
`;

async function seedDb() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  try {
    console.log("seeding...");
    await client.connect();
    await client.query(SQL);
    console.log("seeded!");
  } catch (err) {
    console.log(err);
  } finally {
    await client.end();
  }
}

seedDb();
