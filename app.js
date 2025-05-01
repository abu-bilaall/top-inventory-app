const express = require("express");
const path = require("node:path");
const methodOverride = require("method-override");

// importing routers
const indexRouter = require("./routes/indexRouter");
const categoriesRouter = require("./routes/categoriesRouter");
const brandsRouter = require("./routes/brandsRouter");
const motorcyclesRouter = require("./routes/motorcyclesRouter");

// initializing app
const app = express();

// handling incoming form data
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// setting up views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// mounting routers
app.use("/", indexRouter);
app.use("/categories", categoriesRouter);
app.use("/brands", brandsRouter);
app.use("/motorcycles", motorcyclesRouter);

// error middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  let statusCode = err.statusCode || 500;
  if (err.code === 23505) statusCode = 409;

  // 404
  if (err.statusCode === 404) {
    const errMessage = err.message;
    return res.status(404).render("404", { errMessage });
  }

  // generic errors
  return res.status(statusCode).render("error", {
    statusCode,
    message:
      statusCode === 409 ? "Entry must be unique" : "Something went wrong",
  });
});

// server listening..
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`);
});
