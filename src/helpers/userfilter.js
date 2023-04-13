const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/api/v1/users", async (req, res) => {
  try {
    // Parse query parameters
    const filter = { currentCompany: req.query.company || "vivasoft" };
    const sort = req.query.sort || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const fields = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "name currentCompany";

    // Build query object
    const query = User.find(filter)
      .select(fields)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    // Execute query
    const users = await query.exec();

    // Get total count for pagination
    const count = await User.countDocuments(filter);

    // Return response
    res.json({
      status: "success",
      data: users,
      total: count,
      page: page,
      limit: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

module.exports = router;
