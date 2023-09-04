const yearTrimeHelper = (subjects, student, grades, year, trimester) => {
    const filteredSubjects = subjects.filter(subject => subject.year === year && subject.trimester === trimester);

    filteredSubjects.forEach((subject) => {
        grades.forEach(grade => {
            if (subject._id.toString() === grade.subject.toString()) {
                subject.grade = grade.grade;
                subject.gradeID = grade._id;
            }
        })
    });

    const mapSubjects = filteredSubjects.map(subject => {
        return `
            <div class="col-5">
                <div class="d-flex justify-content-between align-items-center">
                    <input type="hidden" value="${subject._id}" name="subjectID">
                    <input type="hidden" value="${student._id}" name="studentID">
                    <input type="hidden" value="${subject.gradeID ? subject.gradeID : ""}" name="gradeID">
                    <label for="${subject.code}" class="text-uppercase">${subject.code}</label>
                    <div>
                        <input type="text" class="border-0 border-bottom bg-transparent text-white" id="${subject.code}" style="width: 2rem;" name="grade" value="${subject.grade ? subject.grade : ""}" ${subject.grade ? "disabled": ""} required>
                        <button type="button" class="btn border-0 p-0 text-secondary-emphasis ${subject.grade ? "": "d-none"} editGradeBtn"><i class="bi bi-pencil-fill"></i></button>
                        <button type='button' class='btn border-0 p-0 text-secondary-emphasis ${subject.grade ? "d-none": ""} submitGradeBtn'><i class='bi bi-caret-right-fill'></i></button>
                        <button type="button" class="btn border-0 p-0 text-secondary-emphasis d-none cancelEditGradeBtn"><i class="bi bi-x"></i></button>
                    </div>
                </div>
            </div>
        `
    });

    return mapSubjects.join("")
}

module.exports = yearTrimeHelper;

// ${subject.grade ? `
// <button type="button" class="btn border-0 p-0 editGradeBtn"><i class="bi bi-pencil-fill"></i></button>
// <button type="button" class="btn border-0 p-0 d-none cancelEditGradeBtn"><i class="bi bi-x"></i></button>
// ` : "<button type='button' class='btn border-0 p-0 submitGradeBtn'><i class='bi bi-caret-right-fill'></i></button>"}