export function subjectModule() {
    const addSubjectModal = document.querySelector('#addSubjectModal');
    const addSubjectForm = document.querySelector('#addSubjectForm');
    const subjectList = document.querySelector('#subjectList');
    let editSubjectUrl;

    addSubjectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { course, year, trimester, title, code, prerequisite, units  } = e.target.elements;

        if (editSubjectUrl) {
            const res = await fetch(editSubjectUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course: Array.from(course).filter(item => item.checked).map(item => item.value),
                    year: year.value,
                    trimester: trimester.value,
                    title: title.value,
                    code: code.value,
                    prerequisite: prerequisite.value,
                    units: units.value
                })
            });
            const data = await res.json();

            const foundMatchSubject = Array.from(subjectList.children).find(subject => subject.dataset.id === data._id);
            foundMatchSubject.innerText = data.code;

            Array.from(e.target.elements.course).forEach(course => course.checked = false);
            Array.from(e.target.elements.year).forEach(year => year.checked = false);
            Array.from(e.target.elements.trimester).forEach(trimester => trimester.checked = false);
            e.target.elements.title.value = '';
            e.target.elements.code.value = '';
            e.target.elements.prerequisite.value = '';
            e.target.elements.units.value = '';
            e.target.elements.submitSubjectBtn.innerText = 'Submit';
            e.target.elements.deleteSubjectBtn.parentElement.classList.add('d-none');
            e.target.elements.deleteSubjectBtn.removeAttribute('data-id');

            bootstrap.Modal.getInstance(addSubjectModal).hide();

        } else {
            const res = await fetch('/api/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course: Array.from(course).filter(item => item.checked).map(item => item.value),
                    year: year.value,
                    trimester: trimester.value,
                    title: title.value,
                    code: code.value,
                    prerequisite: prerequisite.value,
                    units: units.value
                })
            });

            const data = await res.json();

            const div = document.createElement('div');
            div.className = 'subject';
            div.dataset.id = data._id;
            div.innerText = data.code;
            subjectList.appendChild(div);

            Array.from(e.target.elements.course).forEach(course => course.checked = false);
            Array.from(e.target.elements.year).forEach(year => year.checked = false);
            Array.from(e.target.elements.trimester).forEach(trimester => trimester.checked = false);
            e.target.elements.title.value = '';
            e.target.elements.code.value = '';
            e.target.elements.prerequisite.value = '';
            e.target.elements.units.value = '';

            bootstrap.Modal.getInstance(addSubjectModal).hide();
        }
    });

    addSubjectForm.addEventListener('click', async (e) => {

        if (e.target.id === 'deleteSubjectBtn') {
            const id = e.target.dataset.id;

            bootstrap.Modal.getInstance(addSubjectModal).hide();
            
            Array.from(addSubjectForm.elements.course).forEach(course => course.checked = false);
            Array.from(addSubjectForm.elements.year).forEach(year => year.checked = false);
            Array.from(addSubjectForm.elements.trimester).forEach(trimester => trimester.checked = false);
            addSubjectForm.elements.title.value = '';
            addSubjectForm.elements.code.value = '';
            addSubjectForm.elements.prerequisite.value = '';
            addSubjectForm.elements.units.value = '';
            addSubjectForm.elements.submitSubjectBtn.innerText = 'Submit';
            !addSubjectForm.elements.deleteSubjectBtn.parentElement.classList.contains('d-none') && addSubjectForm.elements.deleteSubjectBtn.parentElement.classList.add('d-none');
            addSubjectForm.elements.deleteSubjectBtn.removeAttribute('data-id');

            Array.from(subjectList.children).find(subject => subject.dataset.id === id).remove();

            if (confirm('Are you sure you want to delete this subject?')) {
                await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
            }

        }
    });

    let touchTimer;

    subjectList.addEventListener('dblclick', async (e) => {

        const { code  } = addSubjectForm.elements;
        const courseCheckBoxes = document.querySelectorAll('#courseCheckBoxes > .form-check > input[name="course"]');
        const yearRadioBtns = document.querySelectorAll('#yearRadioBtns > .form-check > input[name="year"]');
        const trimesterRadioBtns = document.querySelectorAll('#trimesterRadioBtns > .form-check > input[name="trimester"]');

        if (e.target.classList.contains('subject')) {
            const id = e.target.dataset.id;
    
            const res = await fetch(`/api/subjects/${id}`);
            const data = await res.json();

            courseCheckBoxes.forEach(courseCheckBox => data.course.includes(courseCheckBox.value) ? courseCheckBox.checked = true : courseCheckBox.checked = false);
            yearRadioBtns.forEach(yearRadioBtn => yearRadioBtn.value === data.year ? yearRadioBtn.checked = true : yearRadioBtn.checked = false);
            trimesterRadioBtns.forEach(trimesterRadioBtn => trimesterRadioBtn.value === data.trimester ? trimesterRadioBtn.checked = true : trimesterRadioBtn.checked = false);

            title.value = data.title === undefined ? '': data.title;
            code.value = data.code;
            prerequisite.value = data.prerequisite;
            units.value = data.units === undefined ? '': data.units;

            addSubjectForm.elements.submitSubjectBtn.innerText = 'Edit';
            addSubjectForm.elements.deleteSubjectBtn.parentElement.classList.contains('d-none') ? addSubjectForm.elements.deleteSubjectBtn.parentElement.classList.remove('d-none') : addSubjectForm.elements.deleteSubjectBtn.parentElement.classList.add('d-none');
            addSubjectForm.elements.deleteSubjectBtn.dataset.id = data._id;
            editSubjectUrl  = `/api/subjects/${data._id}`;

            new bootstrap.Modal(addSubjectModal).show();
        }

    });

    addSubjectModal.addEventListener('hidden.bs.modal', event => {
        Array.from(addSubjectForm.elements.course).forEach(course => course.checked = false);
        Array.from(addSubjectForm.elements.year).forEach(year => year.checked = false);
        Array.from(addSubjectForm.elements.trimester).forEach(trimester => trimester.checked = false);
        addSubjectForm.elements.title.value = '';
        addSubjectForm.elements.code.value = '';
        addSubjectForm.elements.prerequisite.value = '';
        addSubjectForm.elements.units.value = '';
        addSubjectForm.elements.submitSubjectBtn.innerText = 'Submit';
        !addSubjectForm.elements.deleteSubjectBtn.parentElement.classList.contains('d-none') && addSubjectForm.elements.deleteSubjectBtn.parentElement.classList.add('d-none');
        addSubjectForm.elements.deleteSubjectBtn.removeAttribute('data-id');
    });

    //--------------------------------------------------

    const searchSubjectBar = document.querySelector('#searchSubjectBar');
    const subjectListItems = Array.from(subjectList.children);

    searchSubjectBar.addEventListener('keyup', (e) => {
        subjectListItems.forEach(subject => {
            if (subject.innerText.toLowerCase().includes((e.target.value).toLowerCase())) {
                subject.classList.contains('d-none') && subject.classList.remove('d-none');
            } else {
                subject.classList.add('d-none');
            }
        })
    });
}