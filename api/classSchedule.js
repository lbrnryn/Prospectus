const express = require('express');
const router = express.Router();
const ClassSchedule = require('../models/ClassSchedule.js');

// GET /api/classSchedules/:id
router.get('/:id', async (req, res, next) => {
    try {
        const classSchedule = await ClassSchedule.findById(req.params.id).populate('subject').populate('teacher');
        res.json(classSchedule);
    } catch(err) { next(err) }
});

// PUT /api/classSchedules/:id
router.put('/:id', async (req, res, next) => {
    try {
        const updClassSchedule = await ClassSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // res.json(updClassSchedule);
        const classSchedule = await ClassSchedule.findById(updClassSchedule._id).populate('subject').populate('teacher');
        res.json(classSchedule);
    } catch(err) { next(err) }
});

// DELETE /api/classSchedules/:id
router.delete('/:id', async (req, res, next) => {
    try {
        await ClassSchedule.findByIdAndDelete(req.params.id);
    } catch(err) { next(err) }
});

// // GET /api/classSchedules
// router.get('/', async (req, res, next) => {
//     try {
//         const classSchedules = await ClassSchedule.find(req.query).populate('teacher').populate('subject').lean();
//         res.json(classSchedules);
//     } catch(err) { next(err) }
// });
 
// POST - Add class schedule - /api/classSchedules
router.post('/', async (req, res, next) => {
    try {
        const newClassSchedule = await ClassSchedule.create(req.body);
        // res.json(newClassSchedule)
        const classSchedule = await ClassSchedule.findById(newClassSchedule._id).populate('subject').populate('teacher');
        res.json(classSchedule);
    } catch(err) { next(err) }
});

module.exports = router;