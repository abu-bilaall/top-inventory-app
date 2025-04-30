const asyncHandler = require("express-async-handler");
const db = require("../models/queries");

const getHomePage = asyncHandler(async (req, res) => {
  const [categoriesList, brandsList, motorcyclesList] = await Promise.all([
    db.getCategories(),
    db.getBrands(),
    db.getMotorcycles(),
  ]);

  res.render("index", {
    categoriesList,
    brandsList,
    motorcyclesList,
  });
});

module.exports = getHomePage;