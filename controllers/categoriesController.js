const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../models/queries");

const validateCategoryFormEntry = [
  body("categoryName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Category Name cannot be empty"),
  body("categoryDescription")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Category Description cannot be empty."),
];

// list all categories
const getCategories = asyncHandler(async (req, res) => {
  const categoriesList = await db.getCategories();
  res.render("categories", { categoriesList });
});

// add a new category with sanitized and validated entries
const addNewCategory = [
  validateCategoryFormEntry,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { categoryName, categoryDescription } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).render("newCategoryForm", {
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    // todo: handle db error if entry is not unique (err code: 23505)
    const categoryId = await db.addNewCategory(
      categoryName,
      categoryDescription,
    );

    res.redirect(`/categories/${categoryId.category_id}`);
  }),
];

// list all motorcycles from a category
const getCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const motorcyclesInCategory = await db.getMotorcyclesFromCategory(categoryId);
  const category = await db.getCategory(categoryId);

  if (!category) {
    res.status(404).render("404");
  }

  const categoryName = category[0].name;
  res.render("motorcyclesInCategory", {
    motorcyclesInCategory,
    categoryName,
    categoryId,
  });
});

// update a category
const updateCategory = [
  validateCategoryFormEntry,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { categoryId } = req.params;

    if (!errors.isEmpty()) {
      // Fetch original category data
      const originalCategory = await db.getCategory(categoryId);

      // Merge with user input
      const mergedData = {
        ...originalCategory,
        ...req.body,
      };

      return res.render("editCategory", {
        category: mergedData, // Pass merged data
        errors: errors.array(),
      });
    }

    const { categoryName, categoryDescription } = req.body;
    await db.updateCategory(categoryId, categoryName, categoryDescription);
    res.redirect(`/categories/${categoryId}`);
  }),
];

// render update form
const editCategory = asyncHandler(async (req, res) => {
  const category = await db.getCategory(req.params.categoryId);

  if (!category) {
    res.status(404).render("404");
  }

  res.render("editCategory", { category });
});

// delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  await db.deleteCategory(categoryId);
  res.redirect("/categories");
});

// new category form
const getNewCategoryForm = asyncHandler(async (req, res) => {
  res.render("newCategoryForm");
});

module.exports = {
  getCategories,
  getCategory,
  getNewCategoryForm,
  updateCategory,
  editCategory,
  deleteCategory,
  addNewCategory,
};