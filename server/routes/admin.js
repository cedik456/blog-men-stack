const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

const adminLayout = "../views/layouts/admin";

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin Login",
      description: "A simple Blog using NodeJs, Express and MongoDb",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/admin/signup", async (req, res) => {
  try {
    const locals = {
      title: "Admin Signup",
      description: "A simple Blog using NodeJs, Express and MongoDb",
    };

    res.render("admin/signup", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// POST (FORMS)

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (req.body.username === "admin" && req.body.password === "123456") {
      res.send("You are logged in");
    } else {
      res.send("Your password is incorrect");
    }

    res.redirect("/admin");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
