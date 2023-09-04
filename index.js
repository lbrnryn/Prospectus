const express = require('express');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
require('./passport')(passport);
const session = require('express-session');
const yearTrimeHelper = require('./templateHelper');
require('dotenv').config();

(async function main() {
    try {
        // await mongoose.connect('mongodb://127.0.0.1:27017/prospectus');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prospectus');
        console.log('Database connected')
    } catch(err) { console.log(err) }
})()

// Models
const Subject = require('./models/Subject');
const User = require('./models/User');
const Grade = require('./models/Grade');
const ClassSchedule = require('./models/ClassSchedule');
const EnrolledSubject = require('./models/EnrolledSubject');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: {
        formatTime(timeStart, timeEnd) {
            let [startHour, startMinute] = timeStart.split(':');
            const startPeriod = startHour < 12 ? 'am' : 'pm';
            startHour = startHour > 12 ? String(startHour - 12) : startHour;
            
            let [endHour, endMinute] = timeEnd.split(':')
            const endPeriod = endHour < 12 ? 'am' : 'pm';
            endHour = endHour > 12 ? String(endHour - 12) : endHour;

            return `${startHour}:${startMinute} ${startPeriod} - ${endHour}:${endMinute} ${endPeriod}`
        }
    }
}));
app.set('view engine', '.hbs');
app.set('views', './views');
app.set('json spaces', 2);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/student', express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', require('./api/user'));
app.use('/api/subjects', require('./api/subject'));
app.use('/api/grades', require('./api/grade'));
app.use('/api/classSchedules', require('./api/classSchedule'));

// GET - / - Home Route
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard', 
    failureRedirect: '/' 
}));

app.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err) }
      res.redirect('/');
    });
  });

// GET - /dashboard - Dashboard Page (Admin/Student)
app.get('/dashboard', async (req, res) => {
    if (req.user === undefined) {
        res.redirect('/');
    } else if (req.user.role === 'admin') {

        const user = await User.findById(req.user._id).lean();
        const students = await User.find({ role: 'student' }).lean();
        const teachers = await User.find({ role: 'teacher' }).lean();
        // fs.readFile(path.join(__dirname, 'data', 'global.txt'), 'utf-8', (err, data) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log(data);
        //     }
        // });
        // const data = JSON.parse(await fs.readFileSync(path.join(__dirname, 'data', 'global.txt'), 'utf-8'));
        let data = await fs.readFileSync(path.join(__dirname, 'data', 'global.txt'), 'utf-8');
        data = data !== '' ? JSON.parse(data): '';
        // const subjects = await Subject.find({ trimester: data.trimester }).lean();
        const subjects = await Subject.find().lean();
        const subjectsInTrimester = await Subject.find({ trimester: data.trimester }).lean();
        const classSchedules = await ClassSchedule.find().populate('teacher').populate('subject').lean();
        

        res.render('admin/dashboard', {
            title: 'Admin - Dashboard',
            isStudent: user.role === 'student',
            script: './admin/dashboard.js',
            students,
            teachers,
            subjects,
            subjectsInTrimester,
            classSchedules,
            data,
            helpers: {
                optionTrimesterHelper(trimester) {
                    const data = [
                        { value: '1st', text: '1st Trimester' },
                        { value: '2nd', text: '2nd Trimester' },
                        { value: '3rd', text: '3rd Trimester' }
                    ];

                    return data.map(item => {
                        if (item.value === trimester) {
                            return `<option value='${item.value}' selected>${item.text}</option>`
                        }
                        return `<option value='${item.value}'>${item.text}</option>`
                    }).join('')
                }
            }
        });
    } else {
        const user = await User.findById(req.user._id).lean();
        const subjects = await Subject.find({ course: user.course }).lean();
        const grades = await Grade.find({ student: req.user._id }).lean();
        // const enrolledSubjects = await EnrolledSubject.find().populate('student').populate('subjects').lean();
        const enrolledSubjects = await EnrolledSubject.find().populate('student').populate('classSchedules').lean();
        // console.log(enrolledSubjects[0].classSchedules)
        // console.log(subjects)

        // console.log(enrolledSubjects[0].classSchedules)
        // console.log(enrolledSubjects[0].classSchedules.map(classSchedule => {
        //     const matchedSubject = subjects.find(subject => subject._id.toString() === classSchedule.subject.toString());

        //     return { ...classSchedule, subject: matchedSubject }
        // }))

        const modifiedEnrolledSubjects = enrolledSubjects.map(enrolledSubject => {

            const modifiedClassSchedules = enrolledSubject.classSchedules.map(classSchedule => {

                const matchedSubject = subjects.find(subject => subject._id.toString() === classSchedule.subject.toString());

                return { ...classSchedule, subject: matchedSubject };
            });

            return { ...enrolledSubject, classSchedules: modifiedClassSchedules }
        });
        // console.log(modifiedEnrolledSubjects[0].classSchedules);
        // console.log(modifiedEnrolledSubjects);

        // const modifiedSubjects = subjects.map(subject => {
        //     const subjectGrade = grades.find(grade => grade.subject._id.toString() === subject._id.toString());

        //     return { ...subject, grade: subjectGrade }
        // });
        
        res.render('student/dashboard', { 
            title: 'Student - Dashboard', 
            user,
            isStudent: user.role === 'student',
            // subjects: modifiedSubjects,
            enrolledSubjects: modifiedEnrolledSubjects,
            helpers: {
                subjectYearTrime(subjects) {
                    return `<p class='text-white small'>${subjects[0].year} Year ${subjects[0].trimester} Trimester</p>`
                }
            }
        });
    }
});

app.get('/student/:id', async (req, res) => {
    const student = await User.findById(req.params.id).lean();
    const subjects = await Subject.find({ course: student.course }).lean();
    const grades = await Grade.find({ student: student._id }).lean();

    res.render('admin/student', { 
        student, 
        subjects,
        grades,
        script: './admin/grade.js',
        helpers: {
            firstYearfirstTrime(subjects, student) { return yearTrimeHelper(subjects, student, grades, '1st', '1st') },
            firstYearsecondTrime(subjects, student) { return yearTrimeHelper(subjects, student, grades, '1st', '2nd') },
            firstYearthirdTrime(subjects, student) { return yearTrimeHelper(subjects, student, grades, '1st', '3rd') },
            secondYearfirstTrime(subjects, student) { return yearTrimeHelper(subjects, student, grades, '2nd', '1st') },
            secondYearsecondTrime(subjects, student) { return yearTrimeHelper(subjects, student, grades, '2nd', '2nd') },
            secondYearthirdTrime(subjects, student) { return yearTrimeHelper(subjects, student, grades, '2nd', '3rd') },
            thirdYearfirstTrime(subjects, student) { return yearTrimeHelper(subjects, student, grades, '3rd', '1st') },
            thirdYearsecondTrime(subjects, student) { return yearTrimeHelper(subjects, student, grades, '3rd', '2nd') },
            thirdYearthirdTrime(subjects, student) { return yearTrimeHelper(subjects, student, grades, '3rd', '3rd') },
            fourthYearfirstTrime(subjects, student) { return yearTrimeHelper(subjects, student, grades, '4th', '1st') },
        }
     });
});

app.put('/grade/subject/:id', async (req, res) => {
    try {
        const updateGrade = await Grade.findByIdAndUpdate(req.body.gradeID, { grade: req.body.grade }, { new: true });
        res.status(200).redirect(`/student/${req.body.studentID}`);
    } catch(err) { console.log(err) }
});

app.get('/enroll', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).lean();
        const classSchedules = await ClassSchedule.find().populate('teacher').populate('subject').lean();
        const enrolledSubjects = await EnrolledSubject.find().lean();
        // console.log(classSchedules.filter(classSchedule => {
        //     return !enrolledSubjects.some(enrolledSubject => enrolledSubject.classSchedules.toString().includes(classSchedule._id.toString()))
        // }))
        const modifiedClassSchedules = classSchedules.filter(classSchedule => !enrolledSubjects.some(enrolledSubject => enrolledSubject.classSchedules.toString().includes(classSchedule._id.toString())));

        res.render('student/enroll', {
            title: 'Student - Enroll',
            user,
            isStudent: user.role === 'student',
            classSchedules: modifiedClassSchedules,
            script: './student/enroll.js'
        });
    } catch(err) { console.log(err) }
});

app.post('/enroll', async (req, res) => {
    try {
        const enrolledSubjects = await EnrolledSubject.create(req.body);
        console.log(enrolledSubjects);
    } catch(err) { console.log(err) }   
});

app.get('/kiosk', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).lean();
        const classSchedules = await ClassSchedule.find(req.query).populate('teacher').populate('subject').lean();
        res.render('student/kiosk', {
            isStudent: user.role === 'student',
            classSchedules,
            script: './student/dashboard.js'
        });
    } catch(err) { console.log(err) }
});

app.post('/trimester', async (req, res) => {
    try {
        fs.writeFile(path.join(__dirname, 'data', 'global.txt'), JSON.stringify(req.body), err => { if (err) { console.log(err) } });
    } catch (err) { console.log(err) }
});

app.use((err, req, res, next) => console.log(`Error catch: ${err}` ));

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));