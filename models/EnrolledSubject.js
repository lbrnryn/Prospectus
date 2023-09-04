const mongoose = require('mongoose');

const enrolledSubject = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
    classSchedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClassSchedule' }]
}, { timestamps: true });

module.exports = mongoose.model('EnrolledSubject', enrolledSubject);