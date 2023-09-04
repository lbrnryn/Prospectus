const mongoose = require("mongoose");

const subject = new mongoose.Schema({
    course: [{ type: String, enum: ["act", "bscs", "bsit", "bsis"] }],
    year: { type: String, enum: ["1st", "2nd", "3rd", "4th", "5th"] },
    trimester: { type: String, enum: ["1st", "2nd", "3rd"] },
    title: { type: String, lowercase: true },
    code: { type: String, uppercase: true },
    prerequisite: { type: String, uppercase: true, default: '-' },
    units: Number,
}, { timestamps: true });

module.exports = mongoose.model("Subject", subject);