// CDR MODULE
// Handles Court Disposition Record functionality

// ===== CDR DATA MANAGEMENT =====
let currentCDRData = {
    clientName: '',
    matterNumber: '',
    court: '',
    legalAidCertificate: '',
    charges: '',
    pleaEntered: '',
    courtOutcome: '',
    nextCourtDate: '',
    allocatedTo: []
};

// ===== CLIENT INTEGRATION =====
function loadCDRClientData() {
    const clientSelect = document.getElementById('cdrClientSelect');
    const selectedClientId = parseInt(clientSelect.value);
    
    if (!selectedClientId) {
        clearCDRForm();
        return;
    }
    
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;
    
    // Populate form with client data
    setFormFieldValue('cdrClientName', client.name);
    setFormFieldValue('cdrMatterNumber', client.matterNumber);
    setFormFieldValue('cdrCourt', client.court);
    setFormFieldValue('cdrCharges', client.charges);
    setFormFieldValue('cdrLegalAid', client.legalAid ? 'Yes' : 'No');
    
    // Update current CDR data
    currentCDRData.clientName = client.name;
    currentCDRData.matterNumber = client.matterNumber;
    currentCDRData.court = client.court;
    currentCDRData.charges = client.charges;
    currentCDRData.legalAidCertificate = client.legalAid ? 'Yes' : 'No';
}

function clearCDRForm() {
    // Clear all form fields
    const formFields = [
        'cdrClientName', 'cdrMatterNumber', 'cdrCourt', 'cdrCharges',
        'cdrLegalAid', 'cdrPlea', 'cdrNextCourtDate'
    ];
    
    formFields.forEach(fieldId => {
        setFormFieldValue(fieldId, '');
    });
    
    // Clear checkboxes
    document.querySelectorAll('.cdr-allocate input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.checkbox-item')?.classList.remove('checked');
    });
    
    // Clear radio buttons
    document.querySelectorAll('.cdr-outcome input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Reset current CDR data
    currentCDRData = {
        clientName: '',
        matterNumber: '',
        court: '',
        legalAidCertificate: '',
        charges: '',
        pleaEntered: '',
        courtOutcome: '',
        nextCourtDate: '',
        allocatedTo: []
    };
    
    hideElement('cdrOutput');
}

// ===== FORM HANDLING =====
function updateCDRData() {
    // Update CDR data from form fields
    currentCDRData.clientName = getFormFieldValue('cdrClientName');
    currentCDRData.matterNumber = getFormFieldValue('cdrMatterNumber');
    currentCDRData.court = getFormFieldValue('cdrCourt');
    currentCDRData.charges = getFormFieldValue('cdrCharges');
    currentCDRData.legalAidCertificate = getFormFieldValue('cdrLegalAid');
    currentCDRData.pleaEntered = getFormFieldValue('cdrPlea');
    currentCDRData.nextCourtDate = getFormFieldValue('cdrNextCourtDate');
    
    // Get court outcome from radio buttons
    const selectedOutcome = document.querySelector('.cdr-outcome input[type="radio"]:checked');
    currentCDRData.courtOutcome = selectedOutcome ? selectedOutcome.value : '';
    
    // Get allocated to from checkboxes
    const allocatedCheckboxes = document.querySelectorAll('.cdr-allocate input[type="checkbox"]:checked');
    currentCDRData.allocatedTo = Array.from(allocatedCheckboxes).map(cb => cb.value);
}

function generateCDR() {
    updateCDRData();
    
    // Validate required fields
    if (!currentCDRData.clientName || !currentCDRData.matterNumber) {
        alert('Please fill in at least Client Name and Matter Number');
        return;
    }
    
    // Generate CDR output
    const cdrOutput = createCDROutput();
    
    // Display output
    const outputElement = document.getElementById('cdrOutputText');
    if (outputElement) {
        outputElement.textContent = cdrOutput;
        showElement('cdrOutput');
    }
    
    // Update client data if client is selected
    const clientSelect = document.getElementById('cdrClientSelect');
    if (clientSelect && clientSelect.value) {
        updateClientFromCDR(parseInt(clientSelect.value));
    }
}

function createCDROutput() {
    const today = formatDate(getTodayDate());
    
    return `COURT DISPOSITION RECORD (CDR)

Generated: ${today}

CLIENT INFORMATION:
Name: ${currentCDRData.clientName}
Matter Number: ${currentCDRData.matterNumber}
Court: ${currentCDRData.court}
Legal Aid Certificate: ${currentCDRData.legalAidCertificate}

CASE DETAILS:
Charges: ${currentCDRData.charges}
Plea Entered: ${currentCDRData.pleaEntered}
Court Outcome: ${currentCDRData.courtOutcome}
Next Court Date: ${currentCDRData.nextCourtDate ? formatDate(currentCDRData.nextCourtDate) : 'N/A'}

ALLOCATION:
${currentCDRData.allocatedTo.length > 0 ? 
    currentCDRData.allocatedTo.map(item => `✓ ${item}`).join('\n') : 
    'No allocations selected'
}

---
This CDR was generated on ${today}`;
}

function updateClientFromCDR(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    // Update client with CDR data
    if (currentCDRData.nextCourtDate) {
        client.nextCourt = currentCDRData.nextCourtDate;
    }
    
    // Add CDR record to client history
    if (!client.cdrHistory) {
        client.cdrHistory = [];
    }
    
    client.cdrHistory.push({
        date: getTodayDate(),
        outcome: currentCDRData.courtOutcome,
        plea: currentCDRData.pleaEntered,
        nextCourt: currentCDRData.nextCourtDate,
        allocatedTo: [...currentCDRData.allocatedTo]
    });
    
    saveData();
    updateUI();
}

// ===== CHECKBOX HANDLERS =====
function handleAllocateChange(checkbox) {
    const container = checkbox.closest('.checkbox-item');
    if (!container) return;
    
    // Update visual state
    if (checkbox.checked) {
        container.classList.add('checked');
    } else {
        container.classList.remove('checked');
    }
    
    // Update CDR data
    updateCDRData();
}

function handleOutcomeChange(radio) {
    // Update CDR data when court outcome changes
    updateCDRData();
    
    // Show/hide diary request based on outcome
    const diarySection = document.getElementById('diaryRequestSection');
    if (diarySection) {
        if (radio.value === 'Adjourned' || radio.value === 'Mention') {
            showElement('diaryRequestSection');
        } else {
            hideElement('diaryRequestSection');
        }
    }
}

// ===== ZAPIER INTEGRATION =====
function submitCDRToZapier() {
    const outputElement = document.getElementById('cdrOutputText');
    if (!outputElement || !outputElement.textContent) {
        alert('Please generate CDR first');
        return;
    }
    
    updateCDRData();
    
    const data = {
        ...currentCDRData,
        cdrContent: outputElement.textContent,
        submissionDate: getTodayDate(),
        type: 'CDR'
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
            alert('CDR submitted to Zapier successfully!');
        } else {
            throw new Error('Submission failed');
        }
    })
    .catch(error => {
        console.error('Error submitting CDR to Zapier:', error);
        alert('Error submitting CDR to Zapier. Please try again.');
    });
}

function copyCDRToClipboard() {
    const outputElement = document.getElementById('cdrOutputText');
    if (!outputElement || !outputElement.textContent) {
        alert('No CDR content to copy');
        return;
    }
    
    copyToClipboard(outputElement.textContent).then(success => {
        if (success) {
            alert('CDR copied to clipboard');
        } else {
            alert('Failed to copy to clipboard');
        }
    });
}

// ===== DIARY REQUEST =====
function toggleDiaryRequest() {
    const checkbox = document.getElementById('diaryRequest');
    const detailsSection = document.getElementById('diaryDetails');
    
    if (!checkbox || !detailsSection) return;
    
    if (checkbox.checked) {
        showElement('diaryDetails');
    } else {
        hideElement('diaryDetails');
        // Clear diary request fields
        setFormFieldValue('diaryDate', '');
        setFormFieldValue('diaryTime', '');
        setFormFieldValue('diaryNotes', '');
    }
}

// ===== INITIALIZATION =====
function initializeCDRModule() {
    // Set up event listeners
    const clientSelect = document.getElementById('cdrClientSelect');
    if (clientSelect) {
        clientSelect.addEventListener('change', loadCDRClientData);
    }
    
    // Set up checkbox handlers for allocate section
    document.querySelectorAll('.cdr-allocate input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => handleAllocateChange(checkbox));
    });
    
    // Set up radio button handlers for court outcome
    document.querySelectorAll('.cdr-outcome input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => handleOutcomeChange(radio));
    });
    
    // Set up diary request handler
    const diaryRequestCheckbox = document.getElementById('diaryRequest');
    if (diaryRequestCheckbox) {
        diaryRequestCheckbox.addEventListener('change', toggleDiaryRequest);
    }
    
    // Initialize checkbox handlers
    initializeCheckboxHandlers();
}

// ===== EXPORT FUNCTIONS =====
// Make functions globally available
window.loadCDRClientData = loadCDRClientData;
window.generateCDR = generateCDR;
window.submitCDRToZapier = submitCDRToZapier;
window.copyCDRToClipboard = copyCDRToClipboard;
window.toggleDiaryRequest = toggleDiaryRequest;
window.handleAllocateChange = handleAllocateChange;
window.handleOutcomeChange = handleOutcomeChange;
window.initializeCDRModule = initializeCDRModule;