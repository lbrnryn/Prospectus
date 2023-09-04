const takeClassBtns = document.querySelectorAll('.takeClassBtn');
const enrollClassBox = document.querySelector('#enrollClassBox');
const saveEnrollSubjectsBtn = document.querySelector('#saveEnrollSubjectsBtn');

takeClassBtns.forEach(takeClassBtn => {
    takeClassBtn.addEventListener('click', async (e) => {
        const id = e.target.parentElement.parentElement.dataset.id;
        e.target.parentElement.parentElement.classList.add('d-none');

        saveEnrollSubjectsBtn.parentElement.classList.contains('d-none') && saveEnrollSubjectsBtn.parentElement.classList.remove('d-none')

        const res = await fetch(`/api/classSchedules/${id}`);
        const data = await res.json();
        console.log(data);

        const p = document.createElement('p');
        p.className = 'd-flex align-items-center justify-content-between mb-0';
        // p.dataset.id = data.subject._id;
        p.dataset.id = data._id;
        p.innerHTML = `${data.subject.title} <span class='text-danger fs-5'><i class='bi bi-x'></i></span`;
        enrollClassBox.appendChild(p);
    });
});

saveEnrollSubjectsBtn.addEventListener('click', async (e) => {

    const studentID = enrollClassBox.dataset.studentid;
    // const subjectIDs = Array.from(enrollClassBox.children).map(p => p.dataset.id);
    const classScheduleIDs = Array.from(enrollClassBox.children).map(p => p.dataset.id);
    
    Array.from(enrollClassBox.children).forEach(p => p.remove());
    e.target.parentElement.classList.add('d-none');
    // location.href = '/dashboard';

    await fetch('/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            student: studentID,
            // subjects: subjectIDs
            classSchedule: classScheduleIDs
        })
    });

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