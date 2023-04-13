const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Event = require("../models/event");

router.get("/", async (req, res) => {
  try {
    // Define filter, sort, and limit variables
    const filter = {};
    const sort = {};
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Apply filter
    if (req.query.startDate) {
      filter.startDate = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      filter.endDate = { $lte: new Date(req.query.endDate) };
    }

    // Apply sort
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    // Apply field limiting
    let fields = {};
    if (req.query.fields) {
      const selectedFields = req.query.fields.split(",");
      selectedFields.forEach((field) => {
        fields[field] = 1;
      });
    }

    // Execute query
    const events = await Event.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(fields);

    // Return results
    res.status(200).json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
