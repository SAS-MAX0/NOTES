let quill;
let notes = [];

document.addEventListener('DOMContentLoaded', () => {
    quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ header: [1, 2, false] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
            ],
        },
    });
});

function saveNote() {
    const noteContent = quill.root.innerHTML;
    if (noteContent.trim() === '') {
        alert('Please write something before saving.');
        return;
    }
    notes.push(noteContent);
    updateNotesList();
    clearEditor();
}

function updateNotesList() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.innerHTML = note;
        notesList.appendChild(li);
    });
}

function clearEditor() {
    quill.setContents([]);
}

function toggleHistory() {
    const historyPanel = document.getElementById('history-panel');
    historyPanel.classList.toggle('hidden');
}

function startRecording() {
    // Placeholder for voice recording functionality
    alert('Voice recording feature is not implemented yet.');
}

function setReminder() {
    // Placeholder for reminder functionality
    alert('Set reminder feature is not implemented yet.');
}
