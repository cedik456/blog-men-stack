const express = require("express");
const router = express.Router();

// Home
router.get("/", (req, res) => {
  res.send("Hello from the client");
});

module.exports = router;
