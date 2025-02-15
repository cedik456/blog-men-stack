const express = require("express");
const router = express.Router();

// Home
router.get("/", (req, res) => {
  //   res.send("Hello from the client");
  const locals = {
    title: "NodeJs Blog",
    description:
      "A simple tutorial that tackles NodeJs, ExpressJs, and MongoDB",
  };
  res.render("index", locals);
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

module.exports = router;
