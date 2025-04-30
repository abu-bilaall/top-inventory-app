const asyncHandler = require("express-async-handler");

// validation and sanitization
const { body, validationResult } = require("express-validator");

const db = require("../models/queries");

const validateCategoryFormEntry = [
  body("categoryName")
    .trim()
    .notEmpty()
    .withMessage("Category Name cannot be empty"),
  body("categoryDescription")
    .trim()
    .notEmpty()
    .withMessage("Category Description cannot be empty."),
];

// list all categories
const getCategories = asyncHandler(async (req, res) => {
  const categoriesList = await db.getCategories();
  res.render("categories", { categoriesList });
});

// list all motorcycles from a category
const getCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const motorcyclesInCategory = await db.getMotorcyclesFromCategory(categoryId);
  const category = await db.getCategory(categoryId);
  const categoryName = category[0].name;
  res.render("motorcyclesInCategory", { motorcyclesInCategory, categoryName });
});

// update a category
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;
  await db.updateCategory(categoryId, name, description);
  res.redirect(`/categories/${categoryId}`);
});

const editCategory = asyncHandler(async (req, res) => {
  const category = db.getCategory(req.params.categoryId);
  res.render("editCategory", { category });
});

// delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await db.getCategory(categoryId);
  const deletedCategory = category[0].name;
  await db.deleteCategory(categoryId);
  res.redirect("/categories", { deletedCategory });
});

// new category form
const getNewCategoryForm = asyncHandler(async (req, res) => {
  res.render("newCategoryForm");
});

// add new category
const addNewCategory = [
  validateCategoryFormEntry,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("newCategoryForm", {
        errors: errors.array(),
        oldInput: req.body,
      });
    }

    const { categoryName, categoryDescription } = req.body;
    const categoryId = await db.addNewCategory(
      categoryName,
      categoryDescription,
    );
    res.redirect(`/categories/${categoryId.category_id}`);
    return "success";
  }),
];

module.exports = {
  getCategories,
  getCategory,
  getNewCategoryForm,
  updateCategory,
  editCategory,
  deleteCategory,
  addNewCategory,
};