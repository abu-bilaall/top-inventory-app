const asyncHandler = require("express-async-handler");

const getHomePage = asyncHandler(async (req, res) => {
  res.render("index");
});

module.exports = getHomePage;