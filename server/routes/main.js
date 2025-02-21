const express = require("express");
const router = express.Router();

const Post = require("../models/Post");

// Home
router.get("/", async (req, res) => {
  //   res.send("Hello from the client");
  try {
    const locals = {
      title: "NodeJs Blog",
      description:
        "A simple tutorial that tackles NodeJs, ExpressJs, and MongoDB",
    };

    let perPage = 6;
    let page = parseInt(req.query.page) || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments(); // count the posts
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

// Individual Posts

router.get("/post/:id", async (req, res) => {
  try {
    const slug = req.params.id;
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description:
        "A simple tutorial that tackles NodeJs, ExpressJs, and MongoDB",
    };

    res.render("post", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

// POST SEARCH

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "This is a simple Blog using nodejs",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    });

    res.render("search", { data, locals });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

function insertPostData() {
  Post.insertMany([
    {
      title: "The Rise of AI in Hiring",
      body: "How artificial intelligence is changing the recruitment process.",
    },
    {
      title: "Building a Personal Brand Online",
      body: "Why having a strong LinkedIn profile and online presence matters.",
    },
    {
      title: "The Gig Economy Boom",
      body: "How freelancing and contract work are shaping the future of jobs.",
    },
    {
      title: "Interview Questions You Should Prepare For",
      body: "Common interview questions and how to answer them effectively.",
    },
    {
      title: "How to Negotiate Your Salary",
      body: "Tips for getting the compensation you deserve.",
    },
    {
      title: "Portfolio vs Resume",
      body: "Which one matters more for different industries?",
    },
    {
      title: "The Power of Networking",
      body: "How connections can land you better job opportunities.",
    },
    {
      title: "Side Hustles for Tech Professionals",
      body: "Ways to earn extra income with your coding skills.",
    },
    {
      title: "Best Time to Apply for Jobs",
      body: "When companies hire the most and how to take advantage of it.",
    },
    {
      title: "How to Stand Out in a Crowded Job Market",
      body: "Tips for making your application shine among hundreds of others.",
    },
  ]);
}

insertPostData();

module.exports = router;
