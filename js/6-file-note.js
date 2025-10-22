// File Note Module
// Handles file note generation for general, court, and email notes

// Toggle File Note Type
const toggleFileNoteType = () => {
    const noteType = document.querySelector('input[name="noteType"]:checked')?.value;
    
    document.getElementById('generalNoteFields').style.display = noteType === 'general' ? 'block' : 'none';
    document.getElementById('courtNoteFields').style.display = noteType === 'court' ? 'block' : 'none';
    document.getElementById('emailNoteFields').style.display = noteType === 'email' ? 'block' : 'none';
};

// Toggle File Note Client Selection
const toggleFileNoteClientSelection = () => {
    const source = document.querySelector('input[name="fileNoteClientSource"]:checked')?.value;
    
    document.getElementById('fileNoteFromDatabase').style.display = source === 'database' ? 'block' : 'none';
    document.getElementById('fileNoteManualEntry').style.display = source === 'manual' ? 'block' : 'none';
    
    if (source === 'database') {
        const select = document.getElementById('fileNoteClientSelect');
        if (select && select.value) {
            loadFileNoteClientInfo();
        }
    }
};

// Load File Note Client Info
const loadFileNoteClientInfo = () => {
    const clientId = parseInt(document.getElementById('fileNoteClientSelect').value);
    
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    document.getElementById('fileNoteClientName').value = client.name;
    document.getElementById('fileNoteMatterNumber').value = client.matterNumber;
    document.getElementById('fileNoteCourt').value = client.court || '';
};

// Toggle Follow Up Details
const toggleFollowUpDetails = () => {
    const followUp = document.querySelector('input[name="followUp"]:checked')?.value;
    
    document.getElementById('followUpDetails').style.display = followUp === 'yes' ? 'block' : 'none';
};

// Toggle Multiple Matters
const toggleMultipleMatters = () => {
    const checked = document.getElementById('multipleMatters').checked;
    
    document.getElementById('additionalMattersSection').style.display = checked ? 'block' : 'none';
};

// Calculate Time Units
const calculateTimeUnits = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    const diffMs = end - start;
    const diffMins = diffMs / (1000 * 60);
    
    // Round to nearest 6-minute unit (0.1 hour)
    const units = Math.ceil(diffMins / 6) / 10;
    
    return units.toFixed(1);
};

// Generate File Note Prompt
const generateFileNotePrompt = () => {
    const noteType = document.querySelector('input[name="noteType"]:checked')?.value;
    
    if (!noteType) {
        alert('Please select a note type');
        return;
    }
    
    let prompt = '';
    
    switch(noteType) {
        case 'general':
            prompt = generateGeneralFileNote();
            break;
        case 'court':
            prompt = generateCourtFileNote();
            break;
        case 'email':
            prompt = generateEmailFileNote();
            break;
    }
    
    const outputDiv = document.getElementById('fileNoteOutput');
    outputDiv.textContent = prompt;
    outputDiv.style.display = 'block';
};

// Generate General File Note
const generateGeneralFileNote = () => {
    const clientName = document.getElementById('fileNoteClientName').value;
    const matterNumber = document.getElementById('fileNoteMatterNumber').value;
    const date = document.getElementById('fileNoteDate').value;
    const startTime = document.getElementById('fileNoteStartTime').value;
    const endTime = document.getElementById('fileNoteEndTime').value;
    const timeUnits = calculateTimeUnits(startTime, endTime);
    const contactMethod = document.getElementById('fileNoteContactMethod').value;
    const discussion = document.getElementById('fileNoteDiscussion').value;
    const followUp = document.querySelector('input[name="followUp"]:checked')?.value;
    const followUpDetails = followUp === 'yes' ? document.getElementById('followUpDetailsText').value : '';
    
    return `FILE NOTE - GENERAL

Client: ${clientName}
Matter: ${matterNumber}
Date: ${formatDate(date)}
Time: ${startTime} - ${endTime} (${timeUnits} units)
Contact Method: ${contactMethod}

Discussion:
${discussion}

${followUp === 'yes' ? `Follow-up Required:\n${followUpDetails}` : 'No follow-up required'}`;
};

// Generate Court File Note
const generateCourtFileNote = () => {
    const clientName = document.getElementById('fileNoteClientName').value;
    const matterNumber = document.getElementById('fileNoteMatterNumber').value;
    const court = document.getElementById('fileNoteCourt').value;
    const date = document.getElementById('courtNoteDate').value;
    const startTime = document.getElementById('courtNoteStartTime').value;
    const endTime = document.getElementById('courtNoteEndTime').value;
    const timeUnits = calculateTimeUnits(startTime, endTime);
    const appearance = document.getElementById('courtAppearance').value;
    const outcome = document.getElementById('courtOutcome').value;
    const nextDate = document.getElementById('courtNextDate').value;
    const followUp = document.querySelector('input[name="followUp"]:checked')?.value;
    const followUpDetails = followUp === 'yes' ? document.getElementById('followUpDetailsText').value : '';
    
    return `FILE NOTE - COURT APPEARANCE

Client: ${clientName}
Matter: ${matterNumber}
Court: ${court}
Date: ${formatDate(date)}
Time: ${startTime} - ${endTime} (${timeUnits} units)
Appearance Type: ${appearance}

Outcome:
${outcome}

${nextDate ? `Next Court Date: ${formatDate(nextDate)}` : 'No further court dates scheduled'}

${followUp === 'yes' ? `Follow-up Required:\n${followUpDetails}` : 'No follow-up required'}`;
};

// Generate Email File Note
const generateEmailFileNote = () => {
    const clientName = document.getElementById('fileNoteClientName').value;
    const matterNumber = document.getElementById('fileNoteMatterNumber').value;
    const date = document.getElementById('emailNoteDate').value;
    const from = document.getElementById('emailFrom').value;
    const to = document.getElementById('emailTo').value;
    const subject = document.getElementById('emailSubject').value;
    const summary = document.getElementById('emailSummary').value;
    const followUp = document.querySelector('input[name="followUp"]:checked')?.value;
    const followUpDetails = followUp === 'yes' ? document.getElementById('followUpDetailsText').value : '';
    
    return `FILE NOTE - EMAIL CORRESPONDENCE

Client: ${clientName}
Matter: ${matterNumber}
Date: ${formatDate(date)}
From: ${from}
To: ${to}
Subject: ${subject}

Summary:
${summary}

${followUp === 'yes' ? `Follow-up Required:\n${followUpDetails}` : 'No follow-up required'}`;
};

// Copy File Note
const copyFileNote = () => {
    const noteText = document.getElementById('fileNoteOutput').textContent;
    if (!noteText) {
        alert('Please generate a file note first');
        return;
    }
    
    navigator.clipboard.writeText(noteText).then(() => {
        alert('File note copied to clipboard!');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = noteText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('File note copied to clipboard!');
    });
};

// Clear File Note Form
const clearFileNoteForm = () => {
    if (confirm('Clear all file note fields?')) {
        document.querySelectorAll('#filenote input[type="text"], #filenote input[type="date"], #filenote input[type="time"], #filenote textarea, #filenote select').forEach(el => {
            el.value = '';
        });
        document.getElementById('fileNoteOutput').style.display = 'none';
    }
};
