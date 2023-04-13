const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Blog = require("../models/blog");

router.get("/", async (req, res) => {
  try {
    // Parse query parameters for filtering, sorting, pagination, and field limiting
    const { filter, sort, page, limit, fields } = req.query;

    // Parse filter parameter into a MongoDB query object
    const query = filter ? JSON.parse(filter) : {};

    // Parse sort parameter into a MongoDB sort object
    const sortObj = sort ? JSON.parse(sort) : { createdAt: -1 };

    // Parse page and limit parameters into numbers
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;

    // Parse fields parameter into a MongoDB projection object
    const projection = fields ? JSON.parse(fields) : {};

    // Query for blogs with filtering, sorting, pagination, and field limiting
    const blogs = await Blog.find(query)
      .sort(sortObj)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .select(projection);

    // Count total number of blogs
    const totalBlogs = await Blog.countDocuments(query);

    // Return blogs and pagination metadata as JSON response
    res.json({
      success: true,
      count: blogs.length,
      total: totalBlogs,
      page: parsedPage,
      limit: parsedLimit,
      data: blogs,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
