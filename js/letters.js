// LETTERS MODULE
// Handles letter generation functionality

// ===== LETTER GENERATION =====
function loadClientInfo() {
    const clientSelect = document.getElementById('clientSelect');
    const selectedClientId = parseInt(clientSelect.value);
    
    if (!selectedClientId) {
        hideElement('selectedClientInfo');
        hideElement('letterHistory');
        return;
    }
    
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;
    
    currentClient = client;
    
    // Update client info display
    document.getElementById('selectedClientName').textContent = client.name;
    document.getElementById('selectedMatterNumber').textContent = client.matterNumber;
    document.getElementById('selectedCourt').textContent = client.court;
    document.getElementById('selectedCharges').textContent = client.charges;
    document.getElementById('selectedNextCourt').textContent = client.nextCourt ? formatDate(client.nextCourt) : 'TBD';
    
    // Show client info and letter history
    showElement('selectedClientInfo');
    showElement('letterHistory');
    
    // Update letter history
    updateLetterHistory(client);
}

function updateLetterHistory(client) {
    const historyDiv = document.getElementById('letterHistoryList');
    if (!historyDiv) return;
    
    if (!client.letterHistory || client.letterHistory.length === 0) {
        historyDiv.innerHTML = '<p style="color: #6b7280;">No letters generated yet</p>';
        return;
    }
    
    historyDiv.innerHTML = client.letterHistory.map(letter => `
        <div class="letter-item">
            <div>
                <strong>${letter.type}</strong> - ${letter.template}
                <div style="font-size: 12px; color: #6b7280;">
                    Generated: ${formatDate(letter.date)}
                </div>
            </div>
            <button onclick="downloadLetter('${letter.filename}')" class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;">
                Download
            </button>
        </div>
    `).join('');
}

function generateLetter() {
    const letterType = document.getElementById('letterType').value;
    const template = document.getElementById('templateSelect').value;
    
    if (!currentClient) {
        alert('Please select a client first');
        return;
    }
    
    if (!letterType || !template) {
        alert('Please select both letter type and template');
        return;
    }
    
    // Generate the letter
    const letterData = {
        client: currentClient,
        type: letterType,
        template: template,
        date: getTodayDate(),
        solicitor: getSolicitorName()
    };
    
    // Create output text
    const outputText = createLetterOutput(letterData);
    
    // Display output
    const outputElement = document.getElementById('letterOutput');
    if (outputElement) {
        outputElement.textContent = outputText;
        showElement('letterOutputSection');
    }
    
    // Update client status
    updateClientLetterStatus(currentClient.id, letterType);
    
    // Add to letter history
    const letterRecord = {
        type: letterType,
        template: template,
        date: getTodayDate(),
        filename: `${letterType}_${currentClient.matterNumber}_${getTodayDate()}.docx`
    };
    
    if (!currentClient.letterHistory) {
        currentClient.letterHistory = [];
    }
    currentClient.letterHistory.push(letterRecord);
    
    // Save and update UI
    saveData();
    updateUI();
    updateLetterHistory(currentClient);
}

function createLetterOutput(data) {
    const { client, type, template, date, solicitor } = data;
    
    return `LEGAL LETTER - ${type.toUpperCase()}

Client: ${client.name}
Matter Number: ${client.matterNumber}
Court: ${client.court}
Date: ${formatDate(date)}
Solicitor: ${solicitor}

Template: ${template}

[Letter content would be generated here based on the selected template]

Charges: ${client.charges}
Next Court Date: ${client.nextCourt ? formatDate(client.nextCourt) : 'TBD'}

---
This letter was generated on ${formatDate(date)} using the ${template} template.`;
}

function updateClientLetterStatus(clientId, letterType) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    // Update status based on letter type
    switch(letterType) {
        case 'CCL':
            client.ccl = true;
            break;
        case 'Mention':
            client.mention = true;
            break;
        case 'Final':
            client.final = true;
            break;
    }
    
    saveData();
}

function getSolicitorName() {
    const solicitorSelect = document.getElementById('solicitorSelect');
    if (!solicitorSelect) return 'Not specified';
    
    const selectedValue = solicitorSelect.value;
    const solicitorNames = {
        'RHH': 'Rylie Hahn-Hamilton',
        'SRS': 'Sophia Seton',
        'NKM': 'Natalie McDonald'
    };
    
    return solicitorNames[selectedValue] || selectedValue;
}

function downloadLetter(filename) {
    // In a real implementation, this would download the actual file
    alert(`Downloading: ${filename}\n\nIn a full implementation, this would download the generated document.`);
}

function copyLetterToClipboard() {
    const outputElement = document.getElementById('letterOutput');
    if (!outputElement || !outputElement.textContent) {
        alert('No letter content to copy');
        return;
    }
    
    copyToClipboard(outputElement.textContent).then(success => {
        if (success) {
            alert('Letter copied to clipboard');
        } else {
            alert('Failed to copy to clipboard');
        }
    });
}

// ===== ZAPIER INTEGRATION =====
function submitToZapier() {
    const outputElement = document.getElementById('letterOutput');
    if (!outputElement || !outputElement.textContent) {
        alert('No letter content to submit');
        return;
    }
    
    if (!currentClient) {
        alert('No client selected');
        return;
    }
    
    const letterType = document.getElementById('letterType').value;
    const template = document.getElementById('templateSelect').value;
    
    const data = {
        clientName: currentClient.name,
        matterNumber: currentClient.matterNumber,
        court: currentClient.court,
        charges: currentClient.charges,
        letterType: letterType,
        template: template,
        solicitor: getSolicitorName(),
        letterContent: outputElement.textContent,
        date: getTodayDate()
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
            alert('Letter submitted to Zapier successfully!');
        } else {
            throw new Error('Submission failed');
        }
    })
    .catch(error => {
        console.error('Error submitting to Zapier:', error);
        alert('Error submitting to Zapier. Please try again.');
    });
}

// ===== TEMPLATE MANAGEMENT =====
function updateTemplateOptions() {
    const letterType = document.getElementById('letterType').value;
    const templateSelect = document.getElementById('templateSelect');
    
    if (!templateSelect) return;
    
    // Clear existing options
    templateSelect.innerHTML = '<option value="">-- Select Template --</option>';
    
    // Add templates based on letter type
    const templates = {
        'CCL': ['CCL_Standard.docx', 'CCL_Urgent.docx'],
        'Mention': ['Mention_Standard.docx', 'Mention_Brief.docx'],
        'Final': ['Final_Standard.docx', 'Final_Detailed.docx'],
        'FeeReestimate': ['FeeReestimate_Standard.docx']
    };
    
    if (templates[letterType]) {
        templates[letterType].forEach(template => {
            const option = document.createElement('option');
            option.value = template;
            option.textContent = template;
            templateSelect.appendChild(option);
        });
    }
}

// ===== INITIALIZATION =====
function initializeLettersModule() {
    // Set up event listeners for letter generation
    const letterTypeSelect = document.getElementById('letterType');
    if (letterTypeSelect) {
        letterTypeSelect.addEventListener('change', updateTemplateOptions);
    }
    
    const clientSelect = document.getElementById('clientSelect');
    if (clientSelect) {
        clientSelect.addEventListener('change', loadClientInfo);
    }
    
    // Initialize template options
    updateTemplateOptions();
}

// ===== EXPORT FUNCTIONS =====
// Make functions globally available
window.loadClientInfo = loadClientInfo;
window.generateLetter = generateLetter;
window.copyLetterToClipboard = copyLetterToClipboard;
window.submitToZapier = submitToZapier;
window.updateTemplateOptions = updateTemplateOptions;
window.downloadLetter = downloadLetter;
window.initializeLettersModule = initializeLettersModule;