const express = require("express");
const router = express.Router();
const User = require("../models/User");

// /api/users/add
router.post("/add", async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch(err) { next(err) }
});

// /api/users/:id
router.get("/:id", async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch(err) { next(err) }
});

// /api/users/:id
router.put("/:id", async (req, res, next) => {
    try {
        const updUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updUser);
    } catch(err) { next(err) }
});

// /api/users/:id
router.delete("/:id", async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
    } catch(err) { next(err) }
});

module.exports = router;