const subjectDiv = document.querySelector("#subjectDiv");
let editState = false;
let currentGrade;

subjectDiv.addEventListener("click", async (e) => {
    if (e.target.parentElement.classList.contains("submitGradeBtn")) {

        const submitGradeBtn = e.target.parentElement;
        const [subjectID, studentID, gradeID] = submitGradeBtn.parentElement.parentElement.children;
        const [grade] = submitGradeBtn.parentElement.children;
        const editGradeBtn = Array.from(submitGradeBtn.parentElement.children).find(element => element.classList.contains("editGradeBtn"));
        const cancelEditGradeBtn = Array.from(submitGradeBtn.parentElement.children).find(element => element.classList.contains("cancelEditGradeBtn"));

        if (editState) {
            // console.log(subjectID.value, studentID.value, grade.value, gradeID.value);
            const res = await fetch(`/api/grades/${gradeID.value}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: subjectID.value,
                    student: studentID.value,
                    grade: grade.value
                })
            });
            const data = await res.json();
            // console.log(data)

            grade.value = data.grade;
            grade.disabled = true;
            submitGradeBtn.classList.add("d-none");
            editGradeBtn.classList.remove("d-none");
            cancelEditGradeBtn.classList.add("d-none");
            editState = false;

        } else {

            const res = await fetch("/api/grades", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: subjectID.value,
                    student: studentID.value,
                    grade: grade.value
                })
            });
            const data = await res.json();

            grade.value = data.grade;
            grade.disabled = true;
            submitGradeBtn.classList.add("d-none");
            editGradeBtn.classList.remove("d-none");
        }
    }

    if (e.target.parentElement.classList.contains("editGradeBtn")) {
        const editGradeBtn = e.target.parentElement;
        const [grade] = editGradeBtn.parentElement.children;
        const submitGradeBtn = Array.from(editGradeBtn.parentElement.children).find(element => element.classList.contains("submitGradeBtn"));
        const cancelEditGradeBtn = Array.from(editGradeBtn.parentElement.children).find(element => element.classList.contains("cancelEditGradeBtn"));
        currentGrade = grade.value;
        grade.disabled = false;
        grade.focus();
        editGradeBtn.classList.add("d-none");
        submitGradeBtn.classList.remove("d-none");
        cancelEditGradeBtn.classList.remove("d-none");
        editState = true;
    }

    if (e.target.parentElement.classList.contains("cancelEditGradeBtn")) {
        const cancelEditGradeBtn = e.target.parentElement;
        const [grade] = cancelEditGradeBtn.parentElement.children;
        const editGradeBtn = Array.from(cancelEditGradeBtn.parentElement.children).find(element => element.classList.contains("editGradeBtn"));
        const submitGradeBtn = Array.from(cancelEditGradeBtn.parentElement.children).find(element => element.classList.contains("submitGradeBtn"));
        grade.value = currentGrade;
        grade.disabled = true;
        editGradeBtn.classList.remove("d-none");
        submitGradeBtn.classList.add("d-none");
        cancelEditGradeBtn.classList.add("d-none");
    }

});