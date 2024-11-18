document.addEventListener('DOMContentLoaded', () => {
    const notesKey = 'notes';
    let notes = JSON.parse(localStorage.getItem(notesKey)) || [];
    let mediaRecorder, audioChunks = [];

    // Initialize Quill
    const quill = new Quill('#editor-container', {
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

    // Save note
    window.saveNote = function () {
        const content = quill.root.innerHTML;
        notes.push({ content, date: new Date().toISOString(), audio: null });
        localStorage.setItem(notesKey, JSON.stringify(notes));
        quill.setText('');
        alert('Note saved!');
        renderNotes();
    };

    // Render notes
    function renderNotes() {
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = '';
        notes.forEach(note => {
            const li = document.createElement('li');
            li.innerHTML = `<div>${note.content}</div>`;
            notesList.appendChild(li);
        });
    }

    // Toggle history
    window.toggleHistory = function () {
        document.getElementById('history-panel').classList.toggle('hidden');
        renderNotes();
    };

    // Clear editor
    window.clearEditor = function () {
        quill.setText('');
    };

    // Change theme
    window.changeTheme = function (theme) {
        document.body.className = theme;
    };

    // Start recording
    window.startRecording = function () {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks);
                    const audioUrl = URL.createObjectURL(audioBlob);
                    alert('Voice recording saved!');
                };
            })
            .catch(() => alert('Microphone access denied.'));
    };
});
