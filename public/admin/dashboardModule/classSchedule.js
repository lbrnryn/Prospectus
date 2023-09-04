export function classScheduleModule() {
    const addClassScheduleForm = document.querySelector('#addClassScheduleForm');
    const { subject, section, days, timeStart, timeEnd, room, teacher, slot } = addClassScheduleForm.elements;
    const addClassScheduleModal = document.querySelector('#addClassScheduleModal');
    const classScheduleList  = document.querySelector('#classScheduleList');
    let editClassScheduleUrl;

    addClassScheduleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (editClassScheduleUrl) {
            const res = await fetch(editClassScheduleUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: subject.value,
                    section: section.value,
                    days: days.value,
                    timeStart: timeStart.value,
                    timeEnd: timeEnd.value,
                    room: room.value,
                    teacher: teacher.value,
                    slot: slot.value
                })
            });
            const data = await res.json();
            
            const foundMatchClassSchedule = Array.from(classScheduleList.children).find(classScheduleDiv => classScheduleDiv.dataset.id === data._id);

            // foundMatchClassSchedule.innerHTML = `
            //     <div class='small text-uppercase'>
            //         <p class='mb-0'>${data.subject.code} | ${data.section} | ${data.room}</p>
            //         <p class='mb-0'>${data.days} | ${formatTime(data.timeStart, data.timeEnd)}</p>
            //     </div>
            //     <div class='d-flex align-items-center justify-content-end gap-3'>
            //         <button type='button' class='btn badge text-primary p-0 editClassScheduleBtn' data-url='/api/classSchedules/${data._id}'><i class='bi bi-pencil-fill'></i></button>
            //         <button type='button' class='btn badge text-danger p-0 deleteClassScheduleBtn' data-url='/api/classSchedules/${data._id}'><i class='bi bi-trash3-fill'></i></button>
            //     </div>
            // `
            foundMatchClassSchedule.innerHTML = `
                <p class='mb-0 text-capitalize'>${data.subject.title} <span class='text-uppercase'>(${data.subject.code})</span></p>
                <p class='mb-0'><span class='text-uppercase'>${data.section}</span> | Prof. <span class='text-capitalize'>${data.teacher.firstname} ${data.teacher.lastname}</span></p>
                <p class='mb-0'>Mon-Wed-Fri | ${data.timeStart}-${data.timeEnd} | <span class='text-uppercase'>${data.room}</span></p>
            `

            editClassScheduleUrl = undefined;

            Array.from(addClassScheduleForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');

            addClassScheduleForm.elements.submitClassScheduleBtn.innerText = 'Submit';

            bootstrap.Modal.getInstance(addClassScheduleModal).hide();
        } else {
            const res = await fetch('/api/classSchedules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: subject.value,
                    section: section.value,
                    days: days.value,
                    timeStart: timeStart.value,
                    timeEnd: timeEnd.value,
                    room: room.value,
                    teacher: teacher.value,
                    slot: slot.value
                })
            });
            const data = await res.json();

            const div = document.createElement('div');
            // div.className = 'd-flex justify-content-between text-white';
            div.className = 'p-3 mb-3 classSchedule';
            div.dataset.id = data._id;
            // div.innerHTML = `
            //     <span class='small text-uppercase'>
            //         ${data.subject.code} | ${data.section} | ${data.days} | ${formatTime(data.timeStart, data.timeEnd)} | ${data.room}
            //     </span>
            //     <div class='d-flex align-items-center gap-3'>
            //         <button type='button' class='btn badge text-primary p-0 editClassScheduleBtn' data-url='/api/classSchedules/${data._id}'><i class='bi bi-pencil-fill'></i></button>
            //         <button type='button' class='btn badge text-danger p-0 deleteClassScheduleBtn' data-url='/api/classSchedules/${data._id}'><i class='bi bi-trash3-fill'></i></button>
            //     </div>
            // `;
            div.innerHTML = `
                <p class='mb-0 text-capitalize'>${data.subject.title} <span class='text-uppercase'>(${data.subject.code})</span></p>
                <p class='mb-0'><span class='text-uppercase'>${data.section}</span> | Prof. <span class='text-capitalize'>${data.teacher.firstname} ${data.teacher.lastname}</span></p>
                <p class='mb-0'>Mon-Wed-Fri | ${data.timeStart}-${data.timeEnd} | <span class='text-uppercase'>${data.room}</span></p>
            `
            classScheduleList.appendChild(div);
            
            Array.from(addClassScheduleForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');

            bootstrap.Modal.getInstance(addClassScheduleModal).hide();
        }
    });

    addClassScheduleForm.addEventListener('click', async (e) => {
        if (e.target.id === 'deleteClassScheduleBtn') {
            const id = e.target.dataset.id;

            bootstrap.Modal.getInstance(addClassScheduleModal).hide();

            Array.from(addClassScheduleForm.elements).forEach(element => {
                if (element.tagName !== 'BUTTON' || element.tagName !== 'SELECT') { element.value = '' }
            });
            addClassScheduleForm.elements.submitClassScheduleBtn.innerText = 'Submit';
            !addClassScheduleForm.elements.deleteClassScheduleBtn.parentElement.classList.contains('d-none') && addClassScheduleForm.elements.deleteClassScheduleBtn.parentElement.classList.add('d-none');
            addClassScheduleForm.elements.teacher[0].selected = true;

            Array.from(classScheduleList.children).find(classSchedule => classSchedule.dataset.id === id).remove();

            if (confirm('Are you sure you want to delete this class schedule?')) {
                    await fetch(`/api/classSchedules/${id}`, { method: 'DELETE' });
            }
        }
    });

    classScheduleList.addEventListener('dblclick', async (e) => {
        
        if (e.target.closest('.classSchedule')) {
            const id = e.target.closest('.classSchedule').dataset.id;
            const url = `/api/classSchedules/${id}`;
            editClassScheduleUrl = url;

            const res = await fetch(url);
            const data = await res.json();

            subject.value = data.subject;
            section.value = data.section;
            days.value = data.days;
            timeStart.value = data.timeStart;
            timeEnd.value = data.timeEnd;
            room.value = data.room;
            teacher.value = data.teacher;
            slot.value = data.slot;
            addClassScheduleForm.elements.submitClassScheduleBtn.innerText = 'Edit';
            addClassScheduleForm.elements.deleteClassScheduleBtn.parentElement.classList.contains('d-none') ? addClassScheduleForm.elements.deleteClassScheduleBtn.parentElement.classList.remove('d-none') : addClassScheduleForm.elements.deleteClassScheduleBtn.parentElement.classList.add('d-none');
            addClassScheduleForm.elements.deleteClassScheduleBtn.dataset.id = data._id;

            new bootstrap.Modal(addClassScheduleModal).show();
        }

    });

    addClassScheduleModal.addEventListener('hidden.bs.modal', event => {
        Array.from(addClassScheduleForm.elements).forEach(element => {
            if (element.tagName !== 'BUTTON' || element.tagName !== 'SELECT') { element.value = '' }
        });
        addClassScheduleForm.elements.submitClassScheduleBtn.innerText = 'Submit';
        !addClassScheduleForm.elements.deleteClassScheduleBtn.parentElement.classList.contains('d-none') && addClassScheduleForm.elements.deleteClassScheduleBtn.parentElement.classList.add('d-none');
        addClassScheduleForm.elements.teacher[0].selected = true;
    });

    function formatTime(timeStart, timeEnd) {
        let [startHour, startMinute] = timeStart.split(':');
        const startPeriod = startHour < 12 ? 'am' : 'pm';
        startHour = startHour > 12 ? String(startHour - 12) : startHour;
        
        let [endHour, endMinute] = timeEnd.split(':');
        const endPeriod = endHour < 12 ? 'am' : 'pm';
        endHour = endHour > 12 ? String(endHour - 12) : endHour;

        return `${startHour}:${startMinute} ${startPeriod} - ${endHour}:${endMinute} ${endPeriod}`;
    }
}