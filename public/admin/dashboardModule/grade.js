export function gradeModule() {
    const importGradeForm = document.querySelector('#importGradeForm');
    const importGradeModal = document.querySelector('#importGradeModal');

    importGradeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = e.target.elements.file.files[0];

        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const res = await fetch('/api/grades/upload', {
                method: 'POST',
                body: formData
            });
            await res.json();
        
            e.target.elements.file.value = '';
            bootstrap.Modal.getInstance(importGradeModal).hide();

            const div = document.createElement('div');
            div.className = 'toast position-absolute bottom-0 end-0 show';
            div.innerHTML = `
                <div class='toast-body text-white bg-success bg-gradient'>
                    Grade upload successfully!
                </div>
            `;
            document.querySelector('body').appendChild(div);
            setTimeout(() => div.remove(), 1500);
        } catch(err) { console.log(err) }

    });

    importGradeModal.addEventListener('hidden.bs.modal', (e) => importGradeForm.elements.file.value = '');
}