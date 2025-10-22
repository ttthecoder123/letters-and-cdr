// Letter Generator Module
// Handles letter generation, client info loading, and letter-specific functionality

// Load Client Information
const loadClientInfo = () => {
    const selectValue = document.getElementById('clientSelect').value;
    const section = document.getElementById('clientInfoSection');

    if (!selectValue) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';

    // Handle new client mode
    if (selectValue === 'new') {
        // Create a temporary client object for new client
        currentClient = {
            id: 'new',
            name: '',
            address: '',
            matterNumber: '',
            court: '',
            matterType: '',
            charges: '',
            legalAid: false,
            nextCourt: '',
            isNew: true
        };

        // Show editable form for new client
        document.getElementById('clientInfoGrid').innerHTML = `
            ${['name:Client Name', 'address:Address', 'matterNumber:Matter Number', 'court:Court',
               'matterType:Matter Type', 'charges:Charges', 'legalAid:Legal Aid', 'nextCourt:Next Court']
               .map(field => {
                   const [key, label] = field.split(':');
                   let inputHtml = '';
                   
                   if (key === 'legalAid') {
                       inputHtml = `<select id="newClient_${key}" class="new-client-input" onchange="updateNewClientData('${key}', this.value === 'true')">
                           <option value="false">No</option>
                           <option value="true">Yes</option>
                       </select>`;
                   } else if (key === 'nextCourt') {
                       inputHtml = `<input type="date" id="newClient_${key}" class="new-client-input" onchange="updateNewClientData('${key}', this.value)">`;
                   } else if (key === 'charges') {
                       inputHtml = `<textarea id="newClient_${key}" class="new-client-input" rows="2" placeholder="Enter charges" onchange="updateNewClientData('${key}', this.value)"></textarea>`;
                   } else {
                       inputHtml = `<input type="text" id="newClient_${key}" class="new-client-input" placeholder="Enter ${label.toLowerCase()}" onchange="updateNewClientData('${key}', this.value)">`;
                   }
                   
                   return `<div class="info-item">
                       <div class="info-label">${label}</div>
                       <div class="info-value">${inputHtml}</div>
                   </div>`;
               }).join('')}`;
    } else {
        // Handle existing client
        const clientId = parseInt(selectValue);
        currentClient = clients.find(c => c.id === clientId);
        if (!currentClient) return;

        document.getElementById('clientInfoGrid').innerHTML = `
            ${['name:Client Name', 'address:Address', 'matterNumber:Matter Number', 'court:Court',
               'matterType:Matter Type', 'charges:Charges', 'legalAid:Legal Aid', 'nextCourt:Next Court']
               .map(field => {
                   const [key, label] = field.split(':');
                   let value = currentClient[key];
                   if (key === 'address' && !value) value = 'Not provided';
                   if (key === 'legalAid') value = value ? 'Yes' : 'No';
                   if (key === 'nextCourt') value = value ? formatDate(value) : 'TBD';
                   return `<div class="info-item">
                       <div class="info-label">${label}</div>
                       <div class="info-value">${value || ''}</div>
                   </div>`;
               }).join('')}`;
    }

    const historyList = document.getElementById('letterHistoryList');
    if (currentClient && !currentClient.isNew && currentClient.letterHistory?.length > 0) {
        historyList.innerHTML = currentClient.letterHistory.map(letter => `
            <div class="letter-item">
                <div>
                    <strong>${letter.type}</strong> - ${formatDate(letter.date)}
                    <br><small>${letter.notes || ''}</small>
                </div>
                <span class="status-badge status-completed">Sent</span>
            </div>
        `).join('');
    } else {
        historyList.innerHTML = '<p style="color: #6b7280; font-style: italic;">No letters sent yet</p>';
    }
};

// Update Letter Fields Based on Type
const updateLetterFields = () => {
    const letterType = document.getElementById('letterType').value;
    const dynamicFields = document.getElementById('dynamicFields');
    const cdrSection = document.getElementById('cdrForLetterSection');

    if (!letterType || !currentClient) {
        dynamicFields.innerHTML = '';
        if (cdrSection) cdrSection.style.display = 'none';
        return;
    }

    if (cdrSection) cdrSection.style.display = 'block';

    let fieldsHTML = '';

    switch(letterType) {
        case 'CCL':
            fieldsHTML = getCCLFields();
            break;
        case 'Mention':
            fieldsHTML = getMentionFields();
            break;
        case 'Final':
            fieldsHTML = getFinalFields();
            break;
        case 'FeeReestimate':
            fieldsHTML = getFeeReestimateFields();
            break;
    }

    dynamicFields.innerHTML = fieldsHTML;

    // Initialize any conditional logic
    if (letterType === 'CCL') {
        toggleLegalAidFields();
        togglePleaOptions();
    }
};

// Toggle CDR Fields
const toggleCDRFields = () => {
    document.getElementById('cdrFieldsInLetter').style.display =
        document.getElementById('generateCDRWithLetter').checked ? 'block' : 'none';
};

// Generate Prompt
const generatePrompt = () => {
    const letterType = document.getElementById('letterType').value;

    if (!letterType || !currentClient) {
        alert('Please select a client and letter type');
        return;
    }

    // Validate new client data
    if (currentClient.isNew) {
        if (!currentClient.name || !currentClient.matterNumber) {
            alert('Please fill in at least the Client Name and Matter Number for the new client');
            return;
        }
    }

    let prompt = '';

    switch(letterType) {
        case 'CCL':
            prompt = generateCCLPrompt();
            break;
        case 'Mention':
            prompt = generateMentionPrompt();
            break;
        case 'Final':
            prompt = generateFinalPrompt();
            break;
        case 'FeeReestimate':
            prompt = generateFeeReestimatePrompt();
            break;
    }

    const outputDiv = document.getElementById('promptOutput');
    outputDiv.textContent = prompt;
    outputDiv.style.display = 'block';

    // Update letter history (only for existing clients)
    if (!currentClient.isNew) {
        if (!currentClient.letterHistory) currentClient.letterHistory = [];
        currentClient.letterHistory.push({
            type: letterType,
            date: new Date().toISOString().slice(0,10),
            notes: `Generated ${letterType} prompt`
        });

        // Update letter sent status
        switch(letterType) {
            case 'CCL':
                currentClient.ccl = true;
                break;
            case 'Mention':
                currentClient.mention = true;
                break;
            case 'Final':
                currentClient.final = true;
                break;
        }
    }

    saveData();
    updateUI();
};

// Copy Prompt to Clipboard
const copyPrompt = () => {
    const promptText = document.getElementById('promptOutput').textContent;
    if (!promptText) {
        alert('Please generate a prompt first');
        return;
    }

    navigator.clipboard.writeText(promptText).then(() => {
        alert('Prompt copied to clipboard!');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = promptText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Prompt copied to clipboard!');
    });
};

// Clear Form
const clearForm = () => {
    if (confirm('Clear all fields?')) {
        document.getElementById('letterType').value = '';
        document.getElementById('dynamicFields').innerHTML = '';
        document.getElementById('promptOutput').style.display = 'none';
        
        // Clear letter CDR fields if they exist
        const letterSendToAdmin = document.getElementById('letterSendToAdmin');
        if (letterSendToAdmin) letterSendToAdmin.value = '';
        
        document.querySelectorAll('input[id^="letter_allocate_"]').forEach(cb => cb.checked = false);
        
        const letterCDRClientExcused = document.getElementById('letterCDRClientExcused');
        if (letterCDRClientExcused) letterCDRClientExcused.checked = false;
    }
};

// Update Excel Record
const updateExcelRecord = () => {
    const letterType = document.getElementById('letterType').value;

    if (!currentClient || !letterType) {
        alert('Please select a client and generate a letter first');
        return;
    }

    if (currentClient.isNew) {
        alert('Cannot update Excel record for a new client that is not in the database');
        return;
    }

    const clientIndex = clients.findIndex(c => c.id === currentClient.id);
    if (clientIndex !== -1) {
        const typeMap = {'CCL': 'ccl', 'Mention': 'mention', 'Final': 'final'};
        if (typeMap[letterType]) clients[clientIndex][typeMap[letterType]] = true;

        clients[clientIndex].lastUpdated = new Date().toLocaleDateString('en-AU');

        saveData();
        updateUI();
        exportToExcel();

        alert(`Excel database updated!\n${letterType} marked as sent for ${currentClient.name}`);
    }
};
