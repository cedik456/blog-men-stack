const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const adminLayout = "../views/layouts/admin";
const errorLayout = "../views/layouts/error";

// Check Login

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.render("admin/404", { layout: errorLayout });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};

// Admin Login

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

// POST (FORMS) Login

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// POST Signup

router.post("/admin/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.redirect("/admin/");
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// Admin Dashboard

router.get("/admin/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin Dashboard",
      description: "A simple blog using Node, Express, and MongoDB",
    };
    const data = await Post.find();

    res.render("admin/dashboard", {
      data,
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

// Add Post (GET)

router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin Dashboard",
      description: "A simple blog using Node, Express, and MongoDB",
    };

    const data = await Post.find().sort({ createdAt: -1 }).exec();

    res.render("admin/addPost", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

// Add Post (POST)

router.post("/add-post", async (req, res) => {
  try {
    const { title, body } = req.body;

    await Post.create({ title, body });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// Edit Post (GET)

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/editPost", { data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// Edit Post (PUT)

router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect(`/admin/dashboard`);
  } catch (error) {
    console.log(error);
  }
});

// Delete Post (DELETE)

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
