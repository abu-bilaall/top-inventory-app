const pool = require("./pool");

// CREATE queries
async function addNewCategory(name, description) {
  const values = [name, description];
  await pool.query("INSERT INTO categories VALUES ($1, $2);", values);
}

async function addNewBrand(name, countryOfOrigin) {
  const values = [name, countryOfOrigin];
  await pool.query("INSERT INTO brands VALUES ($1, $2);", values);
}

async function addNewMotorcycle(
  modelName,
  brandId,
  categoryId,
  year,
  engineCC,
  price,
  stockQuantity,
  description,
  imageUrl,
) {
  const values = [
    modelName,
    brandId,
    categoryId,
    year,
    engineCC,
    price,
    stockQuantity,
    description,
    imageUrl,
  ];
  await pool.query(
    "INSERT INTO motorcycles VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);",
    values,
  );
}

// READ queries
async function getCategories() {
  const { rows } = await pool.query("SELECT * FROM categories;");
  return rows;
}

async function getMotorcyclesFromCategory(categoryId) {
  const { rows } = await pool.query(
    "SELECT * FROM motorcycles WHERE motorcycles.category_id = ($1);",
    [categoryId],
  );
  return rows;
}

async function getBrands() {
  const { rows } = await pool.query("SELECT * FROM brands;");
  return rows;
}

async function getMotorcyclesFromBrand(brandId) {
  const { rows } = await pool.query(
    "SELECT * FROM motorcycles WHERE motorcycles.category_id = ($1);",
    [brandId],
  );
  return rows;
}

async function getMotorcycles() {
  const { rows } = await pool.query("SELECT * FROM motorcycles;");
  return rows;
}

async function getMotorcycle(motorcycleId) {
  const { rows } = await pool.query(
    "SELECT * FROM motorcycles WHERE motorcycles.motorcycle_id = ($1);",
    [motorcycleId],
  );
  return rows;
}

// UPDATE queries - to do
async function updateCategory() {
  return 0;
}

async function updateBrand() {
  return 0;
}

async function updateMotorcycle(...details) {
  const queryParams = [
    details.forEach(() => `$${details.length - (details.length - 1)}`),
  ];
  const values = [...details];
  await pool.query(`UPDATE (${queryParams.join(", ")});`, values);
}

// DELETE queries
async function deleteCategory(categoryId) {
  await pool.query(
    "DELETE FROM categories WHERE categories.category_id = ($1);",
    categoryId,
  );
}

async function deleteBrand(brandId) {
  await pool.query("DELETE FROM brands WHERE brands.brand_id = ($1);", brandId);
}

async function deleteMotorcyle(motorcycleId) {
  await pool.query(
    "DELETE FROM motorcyles WHERE motorcyles.motorcyle_id = ($1);",
    motorcycleId,
  );
}

module.exports = {
  addNewCategory,
  addNewBrand,
  addNewMotorcycle,
  getCategories,
  getMotorcyclesFromCategory,
  getBrands,
  getMotorcyclesFromBrand,
  getMotorcycles,
  getMotorcycle,
  updateCategory,
  updateBrand,
  updateMotorcycle,
  deleteCategory,
  deleteBrand,
  deleteMotorcyle,
};
