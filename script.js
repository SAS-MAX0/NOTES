const notesKey = 'notes';
let notes = JSON.parse(localStorage.getItem(notesKey)) || [];

// Initialize Quill editor
const quill = new Quill('#editor-container', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // added strike
            [{ 'header': '1' }, { 'header': '2' }],    // added header options
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean'] // add remove formatting button
        ]
    }
});

// Save note function
function saveNote() {
    const noteContent = quill.root.innerHTML.trim();
    if (!noteContent || noteContent === '<p><br></p>') {
        showNotification('Cannot save an empty note.');
        return;
    }

    const note = {
        content: noteContent,
        audio: null,
        date: new Date().toISOString()
    };
    notes.push(note);  // Add new note to notes array
    localStorage.setItem(notesKey, JSON.stringify(notes)); // Save notes array to localStorage
    quill.setText(''); // Clear the editor
    showNotification('Note saved!');
    renderNotes(); // Render updated list of notes
}

// Render notes
function renderNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';  // Clear current list of notes

    if (notes.length === 0) {
        notesList.innerHTML = '<p>No notes available</p>';
        return;
    }

    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.classList.add('note-item');
        li.innerHTML = `
            <div class="note-content">${note.content}</div>
            ${note.audio ? `<audio controls src="${note.audio}"></audio>` : ''}
        `;
        notesList.appendChild(li);
    });
}

// Toggle history panel
function toggleHistory() {
    const historyPanel = document.getElementById('history-panel');
    historyPanel.classList.toggle('hidden');
    renderNotes(); // Update the displayed notes
}

// Clear the Quill editor
function clearEditor() {
    quill.setText(''); // Reset the editor
}

// Set reminder function
function setReminder() {
    const reminderTime = prompt("Enter reminder time in minutes:");
    if (reminderTime) {
        setTimeout(() => {
            alert("Reminder: Time to check your notes!");
        }, reminderTime * 60000);
    }
}

// Change theme function
function changeTheme(theme) {
    document.body.className = theme; // Change body class to theme name
}

// Show notification function
function showNotification(message) {
    alert(message);  // Display alert notification
}

// Voice recording functionality
let mediaRecorder;
let audioChunks = [];

// Start recording audio
function startRecording() {
    saveNote(); // Ensure a note exists first before recording
    navigator.mediaDevices.getUserMedia({ audio: true })  // Request access to audio
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);  // Initialize media recorder
            mediaRecorder.start();  // Start recording audio

            showNotification('Recording started. Speak now!');

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);  // Store audio chunks
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });  // Combine audio chunks
                audioChunks = [];  // Reset chunks array
                const audioUrl = URL.createObjectURL(audioBlob);  // Create an object URL for the audio file
                
                // Save the audio URL to the most recent note
                const noteIndex = notes.length - 1; // Get the last note (most recent)
                if (noteIndex >= 0) {
                    notes[noteIndex].audio = audioUrl;  // Save the audio URL to the note's audio property
                    localStorage.setItem(notesKey, JSON.stringify(notes));  // Save updated notes to localStorage
                    showNotification('Voice note recorded!');
                    renderNotes();  // Re-render the notes with the audio included
                } else {
                    showNotification('No note available to attach audio.');
                }
            };
        })
        .catch(error => {
            console.error('Error accessing audio devices:', error);
            alert('Microphone access denied. Please check your browser settings.');
        });
}

// Ensure the history panel renders saved notes when toggled
window.onload = () => {
    renderNotes();
};
