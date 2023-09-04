const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

// GET - /api/subjects/:id - Get subject
router.get("/:id", async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id);
        res.json(subject);
    } catch (err) { next(err) }
});


// PUT - /api/subjects/:id - Update subject
router.put("/:id", async (req, res, next) => {
    try {
        const updSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updSubject);
    } catch(err) { next(err) }
});

// DELETE - /api/subjects/:id - Delete subject
router.delete("/:id", async (req, res, next) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
    } catch(err) { next(err) }
});

// GET - /api/subjects - Get subjects
router.get("/", async (req, res, next) => {
    try {
        const subjects = await Subject.find({});
        res.json(subjects);
    } catch (err) { next(err) }
});

// POST - /api/subjects - Add subject
router.post("/", async (req, res, next) => {
    try {
        const subject = await Subject.create(req.body);
        res.json(subject);
    } catch(err) { next(err) }
});

module.exports = router;