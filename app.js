require("dotenv").config(); // to use the .env files (node modules, etc.)

const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");

const PORT = process.env.PORT || 4000;

app.use(express.static("public"));

// Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));

// Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
