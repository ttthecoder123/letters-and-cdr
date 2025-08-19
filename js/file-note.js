// FILE NOTE MODULE
// Handles file note generation functionality

// ===== FILE NOTE DATA =====
let currentFileNoteData = {
    clientName: '',
    matterNumber: '',
    date: '',
    time: '',
    type: '',
    content: '',
    attendees: [],
    action: '',
    followUp: ''
};

// ===== CLIENT INTEGRATION =====
function loadFileNoteClientData() {
    const clientSelect = document.getElementById('fileNoteClientSelect');
    const selectedClientId = parseInt(clientSelect.value);
    
    if (!selectedClientId) {
        clearFileNoteForm();
        return;
    }
    
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;
    
    // Populate form with client data
    setFormFieldValue('fileNoteClientName', client.name);
    setFormFieldValue('fileNoteMatterNumber', client.matterNumber);
    
    // Update current file note data
    currentFileNoteData.clientName = client.name;
    currentFileNoteData.matterNumber = client.matterNumber;
    
    // Show client info
    showElement('fileNoteClientInfo');
}

function clearFileNoteForm() {
    // Clear all form fields
    const formFields = [
        'fileNoteClientName', 'fileNoteMatterNumber', 'fileNoteDate', 
        'fileNoteTime', 'fileNoteContent', 'fileNoteAction', 'fileNoteFollowUp'
    ];
    
    formFields.forEach(fieldId => {
        setFormFieldValue(fieldId, '');
    });
    
    // Reset file note type
    const typeRadios = document.querySelectorAll('input[name="fileNoteType"]');
    typeRadios.forEach(radio => radio.checked = false);
    
    // Hide conditional sections
    hideElement('phoneCallDetails');
    hideElement('meetingDetails');
    hideElement('courtDetails');
    hideElement('correspondenceDetails');
    hideElement('fileNoteClientInfo');
    hideElement('fileNoteOutput');
    
    // Reset current file note data
    currentFileNoteData = {
        clientName: '',
        matterNumber: '',
        date: '',
        time: '',
        type: '',
        content: '',
        attendees: [],
        action: '',
        followUp: ''
    };
}

// ===== FILE NOTE TYPE HANDLING =====
function toggleFileNoteType() {
    const selectedType = document.querySelector('input[name="fileNoteType"]:checked');
    
    // Hide all conditional sections first
    hideElement('phoneCallDetails');
    hideElement('meetingDetails');
    hideElement('courtDetails');
    hideElement('correspondenceDetails');
    
    if (!selectedType) return;
    
    const noteType = selectedType.value;
    currentFileNoteData.type = noteType;
    
    // Show relevant section based on type
    switch(noteType) {
        case 'Phone Call':
            showElement('phoneCallDetails');
            break;
        case 'Meeting':
            showElement('meetingDetails');
            break;
        case 'Court Appearance':
            showElement('courtDetails');
            break;
        case 'Correspondence':
            showElement('correspondenceDetails');
            break;
    }
}

// ===== FORM HANDLING =====
function updateFileNoteData() {
    // Update basic data
    currentFileNoteData.clientName = getFormFieldValue('fileNoteClientName');
    currentFileNoteData.matterNumber = getFormFieldValue('fileNoteMatterNumber');
    currentFileNoteData.date = getFormFieldValue('fileNoteDate');
    currentFileNoteData.time = getFormFieldValue('fileNoteTime');
    currentFileNoteData.content = getFormFieldValue('fileNoteContent');
    currentFileNoteData.action = getFormFieldValue('fileNoteAction');
    currentFileNoteData.followUp = getFormFieldValue('fileNoteFollowUp');
    
    // Get file note type
    const selectedType = document.querySelector('input[name="fileNoteType"]:checked');
    currentFileNoteData.type = selectedType ? selectedType.value : '';
    
    // Get type-specific data
    switch(currentFileNoteData.type) {
        case 'Phone Call':
            currentFileNoteData.phoneDirection = getFormFieldValue('phoneDirection');
            currentFileNoteData.phoneNumber = getFormFieldValue('phoneNumber');
            currentFileNoteData.callDuration = getFormFieldValue('callDuration');
            break;
        case 'Meeting':
            currentFileNoteData.meetingLocation = getFormFieldValue('meetingLocation');
            currentFileNoteData.meetingAttendees = getFormFieldValue('meetingAttendees');
            currentFileNoteData.meetingPurpose = getFormFieldValue('meetingPurpose');
            break;
        case 'Court Appearance':
            currentFileNoteData.courtName = getFormFieldValue('courtName');
            currentFileNoteData.courtJudge = getFormFieldValue('courtJudge');
            currentFileNoteData.courtOutcome = getFormFieldValue('courtOutcome');
            break;
        case 'Correspondence':
            currentFileNoteData.correspondenceType = getFormFieldValue('correspondenceType');
            currentFileNoteData.correspondenceDirection = getFormFieldValue('correspondenceDirection');
            currentFileNoteData.correspondenceParty = getFormFieldValue('correspondenceParty');
            break;
    }
}

function generateFileNote() {
    updateFileNoteData();
    
    // Validate required fields
    if (!currentFileNoteData.clientName || !currentFileNoteData.type || !currentFileNoteData.content) {
        alert('Please fill in Client Name, File Note Type, and Content');
        return;
    }
    
    // Generate file note output
    const fileNoteOutput = createFileNoteOutput();
    
    // Display output
    const outputElement = document.getElementById('fileNoteOutputText');
    if (outputElement) {
        outputElement.textContent = fileNoteOutput;
        showElement('fileNoteOutput');
    }
    
    // Update client data if client is selected
    const clientSelect = document.getElementById('fileNoteClientSelect');
    if (clientSelect && clientSelect.value) {
        addFileNoteToClient(parseInt(clientSelect.value));
    }
}

function createFileNoteOutput() {
    const date = currentFileNoteData.date ? formatDate(currentFileNoteData.date) : formatDate(getTodayDate());
    const time = currentFileNoteData.time || new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
    
    let output = `FILE NOTE
    
Date: ${date}
Time: ${time}
Client: ${currentFileNoteData.clientName}
Matter: ${currentFileNoteData.matterNumber}
Type: ${currentFileNoteData.type}

`;

    // Add type-specific details
    switch(currentFileNoteData.type) {
        case 'Phone Call':
            output += `PHONE CALL DETAILS:
Direction: ${currentFileNoteData.phoneDirection || 'Not specified'}
Phone Number: ${currentFileNoteData.phoneNumber || 'Not specified'}
Duration: ${currentFileNoteData.callDuration || 'Not specified'}

`;
            break;
        case 'Meeting':
            output += `MEETING DETAILS:
Location: ${currentFileNoteData.meetingLocation || 'Not specified'}
Attendees: ${currentFileNoteData.meetingAttendees || 'Not specified'}
Purpose: ${currentFileNoteData.meetingPurpose || 'Not specified'}

`;
            break;
        case 'Court Appearance':
            output += `COURT DETAILS:
Court: ${currentFileNoteData.courtName || 'Not specified'}
Judge/Magistrate: ${currentFileNoteData.courtJudge || 'Not specified'}
Outcome: ${currentFileNoteData.courtOutcome || 'Not specified'}

`;
            break;
        case 'Correspondence':
            output += `CORRESPONDENCE DETAILS:
Type: ${currentFileNoteData.correspondenceType || 'Not specified'}
Direction: ${currentFileNoteData.correspondenceDirection || 'Not specified'}
Other Party: ${currentFileNoteData.correspondenceParty || 'Not specified'}

`;
            break;
    }

    output += `CONTENT:
${currentFileNoteData.content}

`;

    if (currentFileNoteData.action) {
        output += `ACTION TAKEN:
${currentFileNoteData.action}

`;
    }

    if (currentFileNoteData.followUp) {
        output += `FOLLOW-UP REQUIRED:
${currentFileNoteData.followUp}

`;
    }

    output += `---
File note created: ${formatDate(getTodayDate())} at ${new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}`;

    return output;
}

function addFileNoteToClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    // Initialize file notes array if it doesn't exist
    if (!client.fileNotes) {
        client.fileNotes = [];
    }
    
    // Add file note to client history
    const fileNote = {
        id: Date.now(), // Simple ID based on timestamp
        date: currentFileNoteData.date || getTodayDate(),
        time: currentFileNoteData.time || new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
        type: currentFileNoteData.type,
        content: currentFileNoteData.content,
        action: currentFileNoteData.action,
        followUp: currentFileNoteData.followUp,
        createdBy: 'System', // In a real system, this would be the logged-in user
        ...getTypeSpecificData()
    };
    
    client.fileNotes.push(fileNote);
    
    // Save and update UI
    saveData();
    updateUI();
}

function getTypeSpecificData() {
    const data = {};
    
    switch(currentFileNoteData.type) {
        case 'Phone Call':
            data.phoneDirection = currentFileNoteData.phoneDirection;
            data.phoneNumber = currentFileNoteData.phoneNumber;
            data.callDuration = currentFileNoteData.callDuration;
            break;
        case 'Meeting':
            data.meetingLocation = currentFileNoteData.meetingLocation;
            data.meetingAttendees = currentFileNoteData.meetingAttendees;
            data.meetingPurpose = currentFileNoteData.meetingPurpose;
            break;
        case 'Court Appearance':
            data.courtName = currentFileNoteData.courtName;
            data.courtJudge = currentFileNoteData.courtJudge;
            data.courtOutcome = currentFileNoteData.courtOutcome;
            break;
        case 'Correspondence':
            data.correspondenceType = currentFileNoteData.correspondenceType;
            data.correspondenceDirection = currentFileNoteData.correspondenceDirection;
            data.correspondenceParty = currentFileNoteData.correspondenceParty;
            break;
    }
    
    return data;
}

// ===== ZAPIER INTEGRATION =====
function submitFileNoteToZapier() {
    const outputElement = document.getElementById('fileNoteOutputText');
    if (!outputElement || !outputElement.textContent) {
        alert('Please generate file note first');
        return;
    }
    
    updateFileNoteData();
    
    const data = {
        ...currentFileNoteData,
        fileNoteContent: outputElement.textContent,
        submissionDate: getTodayDate(),
        submissionTime: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
        type: 'FileNote'
    };
    
    // Submit to Zapier webhook
    fetch('https://hooks.zapier.com/hooks/catch/19889498/2l8jroj/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('File note submitted to Zapier successfully!');
        } else {
            throw new Error('Submission failed');
        }
    })
    .catch(error => {
        console.error('Error submitting file note to Zapier:', error);
        alert('Error submitting file note to Zapier. Please try again.');
    });
}

function copyFileNoteToClipboard() {
    const outputElement = document.getElementById('fileNoteOutputText');
    if (!outputElement || !outputElement.textContent) {
        alert('No file note content to copy');
        return;
    }
    
    copyToClipboard(outputElement.textContent).then(success => {
        if (success) {
            alert('File note copied to clipboard');
        } else {
            alert('Failed to copy to clipboard');
        }
    });
}

// ===== TIME UTILITIES =====
function setCurrentDateTime() {
    const now = new Date();
    setFormFieldValue('fileNoteDate', now.toISOString().split('T')[0]);
    setFormFieldValue('fileNoteTime', now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false }));
}

// ===== INITIALIZATION =====
function initializeFileNoteModule() {
    // Set up event listeners
    const clientSelect = document.getElementById('fileNoteClientSelect');
    if (clientSelect) {
        clientSelect.addEventListener('change', loadFileNoteClientData);
    }
    
    // Set up file note type radio buttons
    document.querySelectorAll('input[name="fileNoteType"]').forEach(radio => {
        radio.addEventListener('change', toggleFileNoteType);
    });
    
    // Set current date and time by default
    setCurrentDateTime();
    
    // Set up auto-update for date/time fields
    const dateField = document.getElementById('fileNoteDate');
    const timeField = document.getElementById('fileNoteTime');
    
    if (dateField && !dateField.value) {
        dateField.value = getTodayDate();
    }
    
    if (timeField && !timeField.value) {
        timeField.value = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
}

// ===== EXPORT FUNCTIONS =====
// Make functions globally available
window.loadFileNoteClientData = loadFileNoteClientData;
window.toggleFileNoteType = toggleFileNoteType;
window.generateFileNote = generateFileNote;
window.submitFileNoteToZapier = submitFileNoteToZapier;
window.copyFileNoteToClipboard = copyFileNoteToClipboard;
window.setCurrentDateTime = setCurrentDateTime;
window.initializeFileNoteModule = initializeFileNoteModule;