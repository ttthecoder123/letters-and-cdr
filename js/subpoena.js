// SUBPOENA MODULE
// Handles subpoena generation functionality

// ===== SUBPOENA DATA =====
let currentSubpoenaData = {
    recipientName: '',
    recipientAddress: '',
    courtLevel: '',
    courtLocation: '',
    returnDate: '',
    complianceDate: '',
    partyType: 'R v',
    clientName: '',
    proceedingsNumber: '',
    chargeOffence: '',
    documentsRequested: '',
    relevanceStatement: '',
    solicitorName: '',
    lawFirmName: '',
    firmAddress: '',
    contactPhone: '',
    contactEmail: ''
};

// ===== ORGANIZATION TEMPLATES =====
const organizationTemplates = {
    'NSW Police': {
        name: 'Commissioner of NSW Police',
        address: `NSW Police Force
1 Charles Street
Parramatta NSW 2150`
    }
};

// ===== FORM HANDLING =====
function handleOrganizationChange() {
    const orgType = document.getElementById('organizationType').value;
    const recipientNameField = document.getElementById('recipientName');
    const recipientAddressField = document.getElementById('recipientAddress');
    
    if (orgType && organizationTemplates[orgType]) {
        const template = organizationTemplates[orgType];
        recipientNameField.value = template.name;
        recipientAddressField.value = template.address;
    } else {
        recipientNameField.value = '';
        recipientAddressField.value = '';
    }
}

function updateSubpoenaData() {
    // Update subpoena data from form fields
    currentSubpoenaData.recipientName = getFormFieldValue('recipientName');
    currentSubpoenaData.recipientAddress = getFormFieldValue('recipientAddress');
    currentSubpoenaData.courtLevel = getFormFieldValue('courtLevel');
    currentSubpoenaData.courtLocation = getFormFieldValue('courtLocation');
    currentSubpoenaData.returnDate = getFormFieldValue('returnDate');
    currentSubpoenaData.complianceDate = getFormFieldValue('complianceDate');
    currentSubpoenaData.partyType = getFormFieldValue('partyType');
    currentSubpoenaData.clientName = getFormFieldValue('clientName');
    currentSubpoenaData.proceedingsNumber = getFormFieldValue('proceedingsNumber');
    currentSubpoenaData.chargeOffence = getFormFieldValue('chargeOffence');
    currentSubpoenaData.documentsRequested = getFormFieldValue('documentsRequested');
    currentSubpoenaData.relevanceStatement = getFormFieldValue('relevanceStatement');
    currentSubpoenaData.solicitorName = getFormFieldValue('solicitorName');
    currentSubpoenaData.lawFirmName = getFormFieldValue('lawFirmName');
    currentSubpoenaData.firmAddress = getFormFieldValue('firmAddress');
    currentSubpoenaData.contactPhone = getFormFieldValue('contactPhone');
    currentSubpoenaData.contactEmail = getFormFieldValue('contactEmail');
}

function generateSubpoena() {
    updateSubpoenaData();
    
    // Validate required fields
    const requiredFields = [
        'recipientName', 'recipientAddress', 'courtLevel', 'courtLocation',
        'returnDate', 'complianceDate', 'clientName', 'chargeOffence',
        'documentsRequested', 'relevanceStatement', 'solicitorName',
        'lawFirmName', 'firmAddress', 'contactPhone', 'contactEmail'
    ];
    
    const missingFields = requiredFields.filter(field => !currentSubpoenaData[field]);
    
    if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
    }
    
    // Validate dates
    const complianceDate = new Date(currentSubpoenaData.complianceDate);
    const returnDate = new Date(currentSubpoenaData.returnDate);
    
    if (complianceDate >= returnDate) {
        alert('Compliance date must be before the return date');
        return;
    }
    
    // Generate subpoena output
    const subpoenaOutput = createSubpoenaOutput();
    
    // Display output
    const outputElement = document.getElementById('subpoenaText');
    if (outputElement) {
        outputElement.textContent = subpoenaOutput;
        showElement('subpoenaOutput');
    }
}

function createSubpoenaOutput() {
    const data = currentSubpoenaData;
    
    // Format dates
    const returnDateFormatted = formatDateForSubpoena(data.returnDate);
    const complianceDateFormatted = formatDateForSubpoena(data.complianceDate);
    const todayFormatted = formatDateForSubpoena(getTodayDate());
    
    return `SUBPOENA TO PRODUCE DOCUMENTS

${data.courtLevel} of New South Wales
At ${data.courtLocation}

${data.partyType} ${data.clientName}
${data.proceedingsNumber ? `Proceedings No: ${data.proceedingsNumber}` : ''}

TO: ${data.recipientName}
    ${data.recipientAddress.replace(/\n/g, '\n    ')}

YOU ARE COMMANDED to attend at ${data.courtLevel} at ${data.courtLocation} on ${returnDateFormatted} at 9:00 AM and to bring with you and produce at that time and place the documents and things specified in the Schedule below.

YOU ARE FURTHER COMMANDED to produce the documents and things specified in the Schedule below to the solicitor named below by ${complianceDateFormatted}.

FAILURE TO COMPLY WITH THIS SUBPOENA may constitute contempt of court and may result in the issue of a warrant for your arrest.

SCHEDULE OF DOCUMENTS

${data.documentsRequested}

RELEVANCE

${data.relevanceStatement}

DATED: ${todayFormatted}

ISSUED BY:
${data.solicitorName}
Solicitor for the ${data.partyType.includes('R v') ? 'Accused' : 'Defendant'}
${data.lawFirmName}
${data.firmAddress.replace(/\n/g, '\n')}

Phone: ${data.contactPhone}
Email: ${data.contactEmail}

---
This subpoena was generated on ${todayFormatted} using the Legal Letter Generation System.`;
}

function formatDateForSubpoena(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

function clearSubpoenaForm() {
    if (confirm('Clear all subpoena fields?')) {
        // Reset form fields
        const formFields = [
            'organizationType', 'recipientName', 'recipientAddress', 'courtLevel',
            'courtLocation', 'returnDate', 'complianceDate', 'partyType',
            'clientName', 'proceedingsNumber', 'chargeOffence', 'documentsRequested',
            'relevanceStatement', 'solicitorName', 'lawFirmName', 'firmAddress',
            'contactPhone', 'contactEmail'
        ];
        
        formFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                if (field.type === 'select-one') {
                    field.selectedIndex = 0;
                } else {
                    field.value = '';
                }
            }
        });
        
        // Reset current subpoena data
        currentSubpoenaData = {
            recipientName: '',
            recipientAddress: '',
            courtLevel: '',
            courtLocation: '',
            returnDate: '',
            complianceDate: '',
            partyType: 'R v',
            clientName: '',
            proceedingsNumber: '',
            chargeOffence: '',
            documentsRequested: '',
            relevanceStatement: '',
            solicitorName: '',
            lawFirmName: '',
            firmAddress: '',
            contactPhone: '',
            contactEmail: ''
        };
        
        // Hide output section
        hideElement('subpoenaOutput');
        hideElement('clientInfo');
    }
}

// ===== CLIENT INTEGRATION =====
function loadClientFromMain() {
    // Check if client data was passed from main system
    if (window.pendingSubpoenaClient) {
        const client = window.pendingSubpoenaClient;
        
        // Auto-fill client name
        setFormFieldValue('clientName', client.name);
        
        // Display client info
        displayClientInfo(client);
        
        // Clear the pending data
        window.pendingSubpoenaClient = null;
    }
    
    // Check localStorage as fallback
    const storedClient = loadFromStorage('selectedClient');
    if (storedClient && !getFormFieldValue('clientName')) {
        const convertedName = convertNameFormat(storedClient.name || '');
        setFormFieldValue('clientName', convertedName);
        displayClientInfo({ ...storedClient, name: convertedName });
    }
}

function displayClientInfo(client) {
    const infoDiv = document.getElementById('clientInfo');
    if (client && client.name) {
        infoDiv.style.display = 'block';
        infoDiv.innerHTML = `
            <h3>Client Information</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Client Name</div>
                    <div class="info-value">${client.name}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Matter Number</div>
                    <div class="info-value">${client.matterNumber || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Court</div>
                    <div class="info-value">${client.court || 'Not specified'}</div>
                </div>
            </div>
        `;
    } else {
        infoDiv.style.display = 'none';
    }
}

// ===== DATE VALIDATION =====
function validateDates() {
    const complianceDate = getFormFieldValue('complianceDate');
    const returnDate = getFormFieldValue('returnDate');
    const warningDiv = document.getElementById('dateWarning');
    
    if (complianceDate && returnDate) {
        const compliance = new Date(complianceDate);
        const returnD = new Date(returnDate);
        
        if (compliance >= returnD) {
            warningDiv.innerHTML = '⚠️ Compliance date should be before the return date';
            warningDiv.style.display = 'block';
            warningDiv.style.color = '#dc2626';
        } else {
            warningDiv.style.display = 'none';
        }
    } else {
        warningDiv.style.display = 'none';
    }
}

// ===== ZAPIER INTEGRATION =====
function submitSubpoenaToZapier() {
    const outputElement = document.getElementById('subpoenaText');
    if (!outputElement || !outputElement.textContent) {
        alert('Please generate subpoena first');
        return;
    }
    
    updateSubpoenaData();
    
    const data = {
        ...currentSubpoenaData,
        subpoenaContent: outputElement.textContent,
        submissionDate: getTodayDate(),
        type: 'Subpoena'
    };
    
    const statusDiv = document.getElementById('subpoenaZapierStatus');
    statusDiv.style.display = 'block';
    statusDiv.style.backgroundColor = '#fef3c7';
    statusDiv.style.color = '#92400e';
    statusDiv.textContent = 'Submitting to Zapier...';
    
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
            statusDiv.style.backgroundColor = '#d4edda';
            statusDiv.style.color = '#155724';
            statusDiv.textContent = '✓ Subpoena submitted to Zapier successfully!';
            setTimeout(() => statusDiv.style.display = 'none', 3000);
        } else {
            throw new Error('Submission failed');
        }
    })
    .catch(error => {
        console.error('Error submitting subpoena to Zapier:', error);
        statusDiv.style.backgroundColor = '#f8d7da';
        statusDiv.style.color = '#721c24';
        statusDiv.textContent = '✗ Failed to submit to Zapier. Please try again.';
    });
}

function copySubpoenaToClipboard() {
    const outputElement = document.getElementById('subpoenaText');
    if (!outputElement || !outputElement.textContent) {
        alert('No subpoena content to copy');
        return;
    }
    
    copyToClipboard(outputElement.textContent).then(success => {
        if (success) {
            alert('Subpoena copied to clipboard');
        } else {
            alert('Failed to copy to clipboard');
        }
    });
}

// ===== INITIALIZATION =====
function initializeSubpoenaModule() {
    // Set up date validation listeners
    const complianceDateField = document.getElementById('complianceDate');
    const returnDateField = document.getElementById('returnDate');
    
    if (complianceDateField) {
        complianceDateField.addEventListener('change', validateDates);
    }
    
    if (returnDateField) {
        returnDateField.addEventListener('change', validateDates);
    }
    
    // Load client data if available
    loadClientFromMain();
    
    // Set default law firm name if needed
    const lawFirmField = document.getElementById('lawFirmName');
    if (lawFirmField && !lawFirmField.value) {
        lawFirmField.value = '[Your Law Firm Name]';
    }
}

// ===== EXPORT FUNCTIONS =====
// Make functions globally available
window.handleOrganizationChange = handleOrganizationChange;
window.generateSubpoena = generateSubpoena;
window.clearSubpoenaForm = clearSubpoenaForm;
window.submitSubpoenaToZapier = submitSubpoenaToZapier;
window.copySubpoenaToClipboard = copySubpoenaToClipboard;
window.validateDates = validateDates;
window.initializeSubpoenaModule = initializeSubpoenaModule;