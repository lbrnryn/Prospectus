const express = require("express");
const router = express.Router();
const User = require("../models/User");
const EnrolledSubject = require("../models/EnrolledSubject");
const Subject = require("../models/Subject");

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
        const enrolledSubjects = await EnrolledSubject.find({ student: updUser._id }).populate('student').populate('classSchedules').lean();
        const subjects = await Subject.find({ course: updUser.course }).lean();
        const teachers = await User.find({ role: 'teacher' }).lean();
        if (updUser.role === 'student') {

            const modifiedEnrolledSubjects = enrolledSubjects.map(enrolledSubject => {    
                const modifiedClassSchedules = enrolledSubject.classSchedules.map(classSchedule => {
                    const matchedSubject = subjects.find(subject => subject._id.toString() === classSchedule.subject.toString());
                    const matchedTeacher = teachers.find(teacher => teacher._id.toString() === classSchedule.teacher.toString());
                    return { ...classSchedule, subject: matchedSubject, teacher: matchedTeacher };
                });
    
                return { ...enrolledSubject, classSchedules: modifiedClassSchedules };
            });

            res.json({ student: updUser, modifiedEnrolledSubjects });
        } else {
            res.json(updUser);
        }
    } catch(err) { next(err) }
});

// /api/users/:id
router.delete("/:id", async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
    } catch(err) { next(err) }
});

module.exports = router;