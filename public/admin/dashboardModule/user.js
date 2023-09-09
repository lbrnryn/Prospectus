// const options = {
//     containerElement: 'div',
//     className: 'd-flex justify-content-between align-items-center',
//     id: data._id,
//     innerHTML: `
//         <a href='/student/${data._id}' class='text-capitalize text-white'><span class='small'>${data.firstname} ${data.lastname}</span> - <span class='small text-uppercase'>${data.course}</span></a>
//         <div class='d-flex align-items-center gap-3'>
//             <button type='button' class='btn badge text-primary p-0 editStudentBtn' data-url='/api/users/${data._id}'><i class='bi bi-pencil-fill'></i></button>
//             <button type='button' class='btn badge text-danger p-0 deleteStudentBtn' data-url='/api/users/${data._id}'><i class='bi bi-trash3-fill'></i></button>
//         </div>
//     `
// }

// // createElementAndAppendChild(options)

// function createElementAndAppendChild({ containerElement, className, id, innerHTML, parentElement }) {
//     const container = document.createElement(containerElement);
//     container.className = className;
//     container.dataset.id = id;
//     container.innerHTML = innerHTML;
//     parentElement.appendChild(container);
// }

export function userModule() {
    const studentList = document.querySelector('#studentList');
    const teacherList = document.querySelector('#teacherList');
    const addUserModal = document.querySelector('#addUserModal');
    const addUserForm = document.querySelector('#addUserForm');
    const { firstname, lastname, role, idNumber, course, campus } = addUserForm.elements;
    let editUserUrl;

    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // const { firstname, lastname, role, idNumber, course, campus } = e.target.elements;

        if (editUserUrl) {
            const res = await fetch(editUserUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstname: firstname.value,
                    lastname: lastname.value,
                    role: role.value,
                    idNumber: idNumber.value,
                    course: course.value,
                    campus: campus.value,
                })
            });

            const data = await res.json();

            if (data.role === 'student') {
                const foundMatchStudent = Array.from(studentList.children).find(studentLi => studentLi.dataset.id === data._id);
                // foundMatchStudent.innerHTML = `
                //     <a href='/student/${data._id}' class='text-capitalize text-white'><span class='small'>${data.firstname} ${data.lastname}</span> - <span class='small text-uppercase'>${data.course}</span></a>
                //     <div class='d-flex align-items-center gap-3'>
                //         <button type='button' class='btn badge text-primary p-0 editStudentBtn' data-url='/api/users/${data._id}'><i class='bi bi-pencil-fill'></i></button>
                //         <button type='button' class='btn badge text-danger p-0 deleteStudentBtn' data-url='/api/users/${data._id}'><i class='bi bi-trash3-fill'></i></button>
                //     </div>
                // `;
                foundMatchStudent.innerText = `${data.firstname} ${data.lastname}`;
            }

            if (data.role === 'teacher') {
                const foundMatchTeacher = Array.from(teacherList.children).find(teacherLi => teacherLi.dataset.id === data._id);
                foundMatchTeacher.innerHTML = `
                    <a href='/teacher/${data._id}' class='text-capitalize text-white'><span class='small'>${data.firstname} ${data.lastname}</span></a>
                    <div class='d-flex align-items-center gap-3'>
                        <button type='button' class='btn badge text-primary p-0 editTeacherBtn' data-url='/api/users/${data._id}'><i class='bi bi-pencil-fill'></i></button>
                        <button type='button' class='btn badge text-danger p-0 deleteTeacherBtn' data-url='/api/users/${data._id}'><i class='bi bi-trash3-fill'></i></button>
                    </div>
                `;
            }

            firstname.value = '';
            lastname.value = '';
            role[0].selected = true;
            idNumber.value = '';
            course[0].selected = true;
            campus[0].selected = true;

            editUserUrl = undefined;

            bootstrap.Modal.getInstance(addUserModal).hide();
        } else {
            const res = await fetch('/api/users/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstname: firstname.value,
                    lastname: lastname.value,
                    role: role.value,
                    idNumber: idNumber.value,
                    course: course.value,
                    campus: campus.value,
                })
            });
            const data = await res.json();
            
            if (data.role === 'student') {
                const div = document.createElement('div');
                div.className = 'text-capitalize student';
                div.dataset.id = data._id;
                div.innerText = `${data.firstname} ${data.lastname}`;
                studentList.appendChild(div);
            }

            if (data.role === 'teacher') {
                const div = document.createElement('div');
                div.className = 'd-flex justify-content-between align-items-center';
                div.dataset.id = data._id;
                div.innerHTML = `
                    <a href='/teacher/${data._id}' class='text-capitalize text-white'><span class='small'>${data.firstname} ${data.lastname}</span></a>
                    <div class='d-flex align-items-center gap-3'>
                        <button type='button' class='btn badge text-primary p-0 editTeacherBtn' data-url='/api/users/${data._id}'><i class='bi bi-pencil-fill'></i></button>
                        <button type='button' class='btn badge text-danger p-0 deleteTeacherBtn' data-url='/api/users/${data._id}'><i class='bi bi-trash3-fill'></i></button>
                    </div>
                `;
                teacherList.appendChild(div);
            }

            firstname.value = '';
            lastname.value = '';
            role[0].selected = true;
            idNumber.value = '';
            course[0].selected = true;
            campus[0].selected = true;

            bootstrap.Modal.getInstance(addUserModal).hide();
        }

    });

    //--------------------------------------------------

    addUserModal.addEventListener('hidden.bs.modal', () => {
        firstname.value = '';
        lastname.value = '';
        role[0].selected = true;
        idNumber.value = '';
        course[0].selected = true;
        campus[0].selected = true;
        addUserForm.lastElementChild.lastElementChild.innerText = 'Submit';
    });

    const studentGradeBox = document.querySelector('#studentGradeBox');

    // studentList.addEventListener('click', async (e) => {
    studentList.addEventListener('click', async (e) => {
        // console.log(e.target.classList.contains('student'))
        if (e.target.classList.contains('student')) {
            // console.log(e.target.dataset.id);
            const id = e.target.dataset.id;
            const res = await fetch(`/enrolledSubjects/${id}`);
            const data = await res.json();
            console.log(data);
            studentGradeBox.innerHTML = `
                <div class='d-flex justify-content-end gap-3'>
                    <button class='border-0 badge bg-primary'>Edit</button>
                    <button class='border-0 badge bg-danger'>Delete</button>
                </div>
                <p class='text-capitalize'>${data.student.firstname} ${data.student.lastname}</p>
                ${data.modifiedEnrolledSubjects.length !== 0 ? `${data.modifiedEnrolledSubjects[0].classSchedules[0].subject.year} Year ${data.modifiedEnrolledSubjects[0].classSchedules[0].subject.year} Trimester`: ''}
                ${data.modifiedEnrolledSubjects.length !== 0 ? enrolledSubjects(data.modifiedEnrolledSubjects) : '<p>No Enrolled Subjects</p>'}
            `;
        }

        // ${enrolledSubjects(data.modifiedEnrolledSubjects)}

        function enrolledSubjects(enrolledSubjects) {
            return enrolledSubjects.map(enrolledSubject => {
                return `
                    <table class="table table-sm text-white">
                        <tr>
                            <th>Code</th>
                            <th>Title</th>
                            <th>Professor</th>
                            <th>Units</th>
                            <th>Section</th>
                            <th>Grade</th>
                            <th></th>
                        </tr>
                        ${enrolledSubject.classSchedules.map(classSchedule => {
                            return `
                                <tr>
                                    <td>${classSchedule.subject.code}</td>
                                    <td class='text-capitalize'>${classSchedule.subject.title}</td>
                                    <td class='text-capitalize'>${classSchedule.teacher.firstname} ${classSchedule.teacher.lastname}</td>
                                    <td>${classSchedule.subject.units}</td>
                                    <td class='text-uppercase'>${classSchedule.section}</td>
                                    <td>
                                        <!--<input type="text" class="form-control text-white bg-transparent rounded-0 border-0 p-0 text-center ms-2" id="gradeBox" style="width: 1.5rem; font-size: .9rem;" value="3.5">-->
                                        <input type="text" class="form-control text-white bg-transparent rounded-0 border-0 p-0 text-center ms-2" id="gradeBox" style="width: 1.5rem; font-size: .9rem;">
                                    </td>
                                    <td></td>
                                </tr>
                            `
                        }).join('')}
                    </table>
                `
            }).join('');
        }

        // // Edit a user
        // if (e.target.parentElement.classList.contains('editStudentBtn')) {
        //     const editStudentBtn = e.target.parentElement;
        //     const url = editStudentBtn.dataset.url;
        //     editUserUrl = url;

        //     const res = await fetch(url);
        //     const data = await res.json();
        //     // console.log(data);

        //     firstname.value = data.firstname;
        //     lastname.value = data.lastname;
        //     Array.from(role).forEach(item => { if (item.value === data.role) { item.selected = true } });
        //     idNumber.value = data.idNumber;
        //     Array.from(course).forEach(item => { if (item.value === data.course) { item.selected = true } });
        //     Array.from(campus).forEach(item => { if (item.value === data.campus) { item.selected = true } });
        //     addUserForm.lastElementChild.lastElementChild.innerText = 'Edit';

        //     new bootstrap.Modal(addUserModal).show();

        // }

        // // Delete a user
        // if (e.target.parentElement.classList.contains('deleteStudentBtn')) {
        //     if (confirm('Are you sure you want to delete this user?')) {
        //         e.target.parentElement.parentElement.parentElement.remove();
        //         const deleteStudentBtn = e.target.parentElement;
        //         const url = deleteStudentBtn.dataset.url;

        //         await fetch(url, { method: 'DELETE' });
        //     }
        // }

    });

    teacherList.addEventListener('click', async (e) => {

        // Edit a user
        if (e.target.parentElement.classList.contains('editTeacherBtn')) {
            const editTeacherBtn = e.target.parentElement;
            const url = editTeacherBtn.dataset.url;
            editUserUrl = url;

            const res = await fetch(url);
            const data = await res.json();

            firstname.value = data.firstname;
            lastname.value = data.lastname;
            Array.from(role).forEach(item => { if (item.value === data.role) { item.selected = true } });
            idNumber.value = data.idNumber;
            Array.from(course).forEach(item => { if (item.value === data.course) { item.selected = true } });
            Array.from(campus).forEach(item => { if (item.value === data.campus) { item.selected = true } });
            addUserForm.lastElementChild.lastElementChild.innerText = 'Edit';

            new bootstrap.Modal(addUserModal).show();

        }

        // Delete a user
        if (e.target.parentElement.classList.contains('deleteTeacherBtn')) {
            if (confirm('Are you sure you want to delete this user?')) {
                e.target.parentElement.parentElement.parentElement.remove();
                const deleteTeacherBtn = e.target.parentElement;
                const url = deleteTeacherBtn.dataset.url;

                await fetch(url, { method: 'DELETE' });
            }
        }

    });
}
