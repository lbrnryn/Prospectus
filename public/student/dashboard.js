const dropdowns = document.querySelectorAll('[data-bs-toggle="dropdown"]');
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseover', (e) => {
        new bootstrap.Dropdown(dropdown).show();
        dropdown.style.outline = 'none';
    })
    
    dropdown.addEventListener('mouseout', (e) => {
        new bootstrap.Dropdown(dropdown).hide();
        dropdown.style.outline = 'none';
    })
});

//--------------------------------------------------

const searchBar = document.querySelector('#searchBar');
const classScheduleList = document.querySelector('#classScheduleList');
const classSchedulesCount = document.querySelector('#classSchedulesCount');

classSchedulesCount.innerText = Array.from(classScheduleList.children).filter(div => div.style.display !== 'none').length;

searchBar.addEventListener('keyup', e => {
    // console.log(e.target.value);
    Array.from(classScheduleList.children).forEach(div => {
        if (div.innerText.toLowerCase().includes(e.target.value)) {
            div.style.display = 'block';
        } else {
            div.style.display = 'none';
        }
    });
    // console.log(Array.from(classScheduleList.children).filter(div => div.style.display !== 'none').length)
    classSchedulesCount.innerText = Array.from(classScheduleList.children).filter(div => div.style.display !== 'none').length;
});

// console.log(classScheduleList.children[0].innerText.toLowerCase().includes('software engineering'));
