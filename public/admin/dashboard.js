import { userModule } from './dashboardModule/user.js';
import { subjectModule } from './dashboardModule/subject.js';
import { classScheduleModule } from './dashboardModule/classSchedule.js';
import { gradeModule } from './dashboardModule/grade.js';

userModule();
subjectModule();
classScheduleModule();
gradeModule();

const trimesterSelect = document.querySelector('#trimesterSelect');
const currentTrime = Array.from(trimesterSelect.children).find(option => option.selected === true);

trimesterSelect.addEventListener('change', async (e) => {
    if (confirm('Are you sure you want to change trimester now?')) {
        const res = await fetch('/trimester', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trimester: e.target.value })
        });
    }
    currentTrime.selected = true;
});  