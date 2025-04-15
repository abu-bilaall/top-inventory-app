const pool = require("./pool");

// CREATE queries
async function addNewCategory(name, description) {
  if (!name || !description) {
    throw new Error("Missing required fields");
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING category_id;
      `,
      [name, description],
    );
    return rows[0]; // Return the new ID
  } catch (error) {
    // Catch UNIQUE constraint violation (error code 23505)
    if (error.code === "23505") {
      throw new Error("Category name must be unique");
    }
    throw error; // Re-throw other errors
  }
}

async function addNewBrand(name, countryOfOrigin) {
  if (!name || !countryOfOrigin) {
    throw new Error("Missing required fields");
  }

  await pool.query(
    "INSERT INTO brands (name, country_of_origin) VALUES ($1, $2);",
    [name, countryOfOrigin],
  );
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
  const requiredFields = {
    modelName,
    brandId,
    categoryId,
    year,
    engineCC,
    price,
    stockQuantity,
  };
  if (
    Object.values(requiredFields).some(
      (field) => field === undefined || field === null,
    )
  ) {
    throw new Error("Missing required fields");
  }

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
  try {
    const { rows } = await pool.query(
      `INSERT INTO motorcycles 
        (model_name, brand_id, 
       category_id, year, engine_cc, 
       price, stock_quantity, 
       description, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
      values,
    );

    return rows[0];
  } catch (err) {
    if (err.code === "23505") {
      throw new Error("Model name, brand, or year is not unique");
    }

    throw err;
  }
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
    "SELECT * FROM motorcycles WHERE motorcycles.brand_id = ($1);",
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

// UPDATE queries
async function updateCategory(categoryId, name, description) {
  if (!categoryId || !name || !description) {
    throw new Error("Missing required fields");
  }

  const query = `
      UPDATE categories 
      SET name = $1, description = $2 
      WHERE category_id = $3
      RETURNING *;`;

  const values = [name, description, categoryId];

  const { rows } = await pool.query(query, values);

  if (rows.length === 0) {
    throw new Error("Category not found or no changes made");
  }

  return rows[0];
}

async function updateBrand(brandId, brandName, countryOfOrigin) {
  if (!brandId || !brandName || !countryOfOrigin) {
    throw new Error("Missing required fields");
  }

  const query = `
    UPDATE brands
    SET name = $1, country_of_origin = $2
    WHERE brand_id = $3
    RETURNING *;`;

  const values = [brandName, countryOfOrigin, brandId];

  const { rows } = await pool.query(query, values);
  if (rows.length === 0) {
    throw new Error("Brand not found or no changes made");
  }

  return rows[0];
}

async function updateMotorcycle(
  motorcycleId,
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
  const requiredFields = {
    motorcycleId,
    modelName,
    brandId,
    categoryId,
    year,
    engineCC,
    price,
    stockQuantity,
  };

  if (
    Object.values(requiredFields).some(
      (field) => field === undefined || field === null,
    )
  ) {
    throw new Error("Missing required fields");
  }

  const query = `
    UPDATE motorcycles
    SET 
        model_name = $1,
        brand_id = $2,
        category_id = $3,
        year = $4,
        engine_cc = $5,
        price = $6,
        stock_quantity = COALESCE($7, stock_quantity),
        description = COALESCE($8, description),
        image_url = COALESCE($9, image_url)
      WHERE motorcycle_id = $10
      RETURNING *;`;

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
    motorcycleId,
  ];

  const { rows } = await pool.query(query, values);
  if (rows.length === 0) {
    throw new Error("Motorcycle not found or no changes made");
  }

  return rows[0];
}

// DELETE queries
async function deleteCategory(categoryId) {
  await pool.query(
    "DELETE FROM categories WHERE categories.category_id = ($1);",
    [categoryId],
  );
}

async function deleteBrand(brandId) {
  await pool.query("DELETE FROM brands WHERE brands.brand_id = ($1);", [
    brandId,
  ]);
}

async function deletemotorcycle(motorcycleId) {
  await pool.query(
    "DELETE FROM motorcycles WHERE motorcycles.motorcycle_id = ($1);",
    [motorcycleId],
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
  deletemotorcycle,
};
