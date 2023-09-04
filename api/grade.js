const express = require("express");
const router = express.Router();
const Grade = require("../models/Grade");
const User = require("../models/User");
const Subject = require("../models/Subject");
const formidable = require('formidable');
const xlsx = require('xlsx');

// Update subject grade - PUT /api/grades/:id
router.put("/:id", async (req, res, next) => {
    try {
        const updGrade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updGrade);
    } catch (err) { next(err) }
});

// Add subject grade - POST /api/grades
router.post("/", async (req, res, next) => {
    try {
        const newGrade = await Grade.create(req.body);
        res.json(newGrade);
    } catch(err) { next(err) }
});

// Upload subject grade from excel file - POST /api/grades/upload
router.post('/upload', (req, res, next) => {
    try {
        const form = formidable({});

        form.parse(req, async (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }
            // res.json({ fields, files });
            // console.log(files.file.filepath);
            // console.log(files)
            const filePath = files.file.filepath;
            const workbook = xlsx.readFile(filePath);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            // console.log(jsonData)
            const resultData = await Promise.all(jsonData.map(async (data) => {
                const subject = await Subject.findOne({ code: data.subjectCode });
                const student = await User.findOne({ studentID: data.studentID });

                return { subject: subject._id.toString(), student: student._id.toString(), grade: data.grade };
            }));
            // console.log(resultData)
            const newGrades = await Grade.insertMany(resultData);
            // console.log(newGrades);
            res.json('test')
        });
    } catch (err) { next(err) }
});

module.exports = router;