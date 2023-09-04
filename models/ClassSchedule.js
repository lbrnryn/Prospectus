const mongoose = require('mongoose');

const classSchedule = new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    section: String,
    days: String,
    timeStart: String,
    timeEnd: String,
    room: String,
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    slot: Number,
    status: String
}, { timestamps: true });

module.exports = mongoose.model('ClassSchedule', classSchedule)