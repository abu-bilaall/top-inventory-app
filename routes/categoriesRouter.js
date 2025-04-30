const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");

const categoriesRouter = Router();

categoriesRouter
  .route("/")
  .get(categoriesController.getCategories)
  .post(categoriesController.addNewCategory);

categoriesRouter.get("/new", categoriesController.getNewCategoryForm);

categoriesRouter.get("/:categoryId/edit", categoriesController.editCategory);

categoriesRouter
  .route("/:categoryId")
  .get(categoriesController.getCategory)
  .patch(categoriesController.updateCategory)
  .delete(categoriesController.deleteCategory);

module.exports = categoriesRouter;