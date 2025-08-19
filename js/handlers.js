// EVENT HANDLERS
// Consolidate ALL event handling functions to eliminate repetition

const EventHandlers = {
    // Letter generation handlers
    generateLetter(letterType) {
        try {
            const prompt = PromptGenerator.generateLetterPrompt(letterType);
            const webhookData = PromptGenerator.generateWebhookData(letterType);
            
            // Display prompt
            const outputElement = document.getElementById('letterOutput');
            if (outputElement) {
                outputElement.style.display = 'block';
                outputElement.innerHTML = `
                    <h3>Generated ${LETTER_TEMPLATES[letterType]?.title || letterType}</h3>
                    <div class="letter-content">${prompt.replace(/\n/g, '<br>')}</div>
                    <div class="actions">
                        <button onclick="copyToClipboard('${prompt.replace(/'/g, "\\'")}')">Copy to Clipboard</button>
                        <button onclick="EventHandlers.sendWebhook('${letterType}', ${JSON.stringify(webhookData).replace(/'/g, "\\'")})">Send to Zapier</button>
                    </div>
                `;
            }
            
            CoreUtils.showStatus('statusMessage', `${letterType} letter generated successfully`, 'success');
            
        } catch (error) {
            CoreUtils.handleError(error, 'generating letter');
        }
    },
    
    // CDR generation handler
    generateCDR() {
        try {
            const prompt = PromptGenerator.generateCDRPrompt();
            const webhookData = PromptGenerator.generateWebhookData('CDR');
            
            // Display CDR
            const outputElement = document.getElementById('cdrOutputText');
            if (outputElement) {
                outputElement.style.display = 'block';
                outputElement.innerHTML = `
                    <h3>Generated CDR</h3>
                    <div class="cdr-content">${prompt.replace(/\n/g, '<br>')}</div>
                    <div class="actions">
                        <button onclick="copyToClipboard('${prompt.replace(/'/g, "\\'")}')">Copy to Clipboard</button>
                        <button onclick="EventHandlers.sendWebhook('CDR', ${JSON.stringify(webhookData).replace(/'/g, "\\'")})">Send to Zapier</button>
                    </div>
                `;
            }
            
            CoreUtils.showStatus('cdrStatus', 'CDR generated successfully', 'success');
            
        } catch (error) {
            CoreUtils.handleError(error, 'generating CDR');
        }
    },
    
    // File note generation handler
    generateFileNote() {
        try {
            const prompt = PromptGenerator.generateFileNotePrompt();
            const webhookData = PromptGenerator.generateWebhookData('FileNote');
            
            // Display file note
            const outputElement = document.getElementById('fileNoteOutput');
            if (outputElement) {
                outputElement.style.display = 'block';
                outputElement.innerHTML = `
                    <h3>Generated File Note</h3>
                    <div class="file-note-content">${prompt.replace(/\n/g, '<br>')}</div>
                    <div class="actions">
                        <button onclick="copyToClipboard('${prompt.replace(/'/g, "\\'")}')">Copy to Clipboard</button>
                        <button onclick="EventHandlers.sendWebhook('FileNote', ${JSON.stringify(webhookData).replace(/'/g, "\\'")})">Send to Zapier</button>
                    </div>
                `;
            }
            
            CoreUtils.showStatus('fileNoteStatus', 'File note generated successfully', 'success');
            
        } catch (error) {
            CoreUtils.handleError(error, 'generating file note');
        }
    },
    
    // Subpoena generation handler
    generateSubpoena() {
        try {
            const prompt = PromptGenerator.generateSubpoenaPrompt();
            const webhookData = PromptGenerator.generateWebhookData('Subpoena');
            
            // Display subpoena
            const outputElement = document.getElementById('subpoenaOutput');
            if (outputElement) {
                outputElement.style.display = 'block';
                outputElement.innerHTML = `
                    <h3>Generated Subpoena</h3>
                    <div class="subpoena-content">${prompt.replace(/\n/g, '<br>')}</div>
                    <div class="actions">
                        <button onclick="copyToClipboard('${prompt.replace(/'/g, "\\'")}')">Copy to Clipboard</button>
                        <button onclick="EventHandlers.sendWebhook('Subpoena', ${JSON.stringify(webhookData).replace(/'/g, "\\'")})">Send to Zapier</button>
                    </div>
                `;
            }
            
            CoreUtils.showStatus('subpoenaStatus', 'Subpoena generated successfully', 'success');
            
        } catch (error) {
            CoreUtils.handleError(error, 'generating subpoena');
        }
    },
    
    // Webhook sender
    async sendWebhook(type, data) {
        const webhookUrl = 'https://hooks.zapier.com/hooks/catch/18972475/2l3o62e/';
        
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                CoreUtils.showStatus('statusMessage', 'Data sent to Zapier successfully', 'success');
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            CoreUtils.handleError(error, 'sending to Zapier');
        }
    },
    
    // Conditional field toggles
    toggleConditionalFields(triggerElement, conditionalId) {
        const conditional = document.getElementById(conditionalId);
        if (!conditional) return;
        
        const value = triggerElement.value;
        conditional.style.display = value && value !== 'No' && value !== '' ? 'block' : 'none';
    },
    
    // Specific toggle handlers (maintain backward compatibility)
    toggleLegalAidFields() {
        const legalAidStatus = document.getElementById('legalAidStatus');
        if (!legalAidStatus) return;
        
        const yesFields = document.getElementById('legalAidStatus_yes');
        const noFields = document.getElementById('legalAidStatus_no');
        
        if (legalAidStatus.value === 'Yes') {
            if (yesFields) yesFields.style.display = 'block';
            if (noFields) noFields.style.display = 'none';
        } else if (legalAidStatus.value === 'No') {
            if (yesFields) yesFields.style.display = 'none';
            if (noFields) noFields.style.display = 'block';
        } else {
            if (yesFields) yesFields.style.display = 'none';
            if (noFields) noFields.style.display = 'none';
        }
    },
    
    toggleDepositFields() {
        const depositPaid = document.getElementById('depositPaid');
        if (!depositPaid) return;
        
        const depositFields = document.getElementById('depositPaid_yes');
        if (depositFields) {
            depositFields.style.display = depositPaid.value === 'Yes' ? 'block' : 'none';
        }
    },
    
    togglePleaFields() {
        const plea = document.getElementById('plea');
        if (!plea) return;
        
        // Handle any plea-specific fields if needed
        // Currently no conditional fields for plea, but structure is ready
    },
    
    toggleSentenceMaterials() {
        const checkbox = document.getElementById('requiresSentenceMaterials');
        const materials = document.getElementById('sentenceMaterials');
        
        if (checkbox && materials) {
            materials.style.display = checkbox.checked ? 'block' : 'none';
        }
    },
    
    toggleADVOFields() {
        const advoSelect = document.getElementById('advoApplied');
        if (!advoSelect) return;
        
        const interimFields = document.getElementById('advoapplied_interim');
        const finalFields = document.getElementById('advoapplied_final');
        
        // Hide all first
        [interimFields, finalFields].forEach(field => {
            if (field) field.style.display = 'none';
        });
        
        // Show relevant fields
        const value = advoSelect.value.toLowerCase().replace(/\s+/g, '_');
        const relevantField = document.getElementById(`advoapplied_${value}`);
        if (relevantField) {
            relevantField.style.display = 'block';
        }
    },
    
    toggleBailFields() {
        const bailSelect = document.getElementById('bailConditions');
        if (!bailSelect) return;
        
        const conditionalFields = document.getElementById('bailconditions_yes_-_conditional_bail');
        if (conditionalFields) {
            conditionalFields.style.display = bailSelect.value.includes('Conditional') ? 'block' : 'none';
        }
    },
    
    togglePenaltyFields() {
        const verdict = document.getElementById('verdict');
        const penalty = document.getElementById('penalty');
        
        if (verdict && penalty) {
            // Auto-update penalty options based on verdict if needed
            // Currently maintained as separate fields
        }
    },
    
    toggleFinalADVOFields() {
        const finalADVO = document.getElementById('finalADVO');
        if (!finalADVO) return;
        
        // Handle final ADVO conditional fields
        const value = finalADVO.value.toLowerCase().replace(/\s+/g, '_');
        const conditionalField = document.getElementById(`finaladvo_${value}`);
        
        // Hide all ADVO conditional fields first
        document.querySelectorAll('[id^="finaladvo_"]').forEach(field => {
            field.style.display = 'none';
        });
        
        // Show relevant field
        if (conditionalField) {
            conditionalField.style.display = 'block';
        }
    },
    
    // File note type handler
    toggleFileNoteType() {
        const typeRadios = document.querySelectorAll('input[name="fileNoteType"]');
        const selectedType = Array.from(typeRadios).find(radio => radio.checked);
        
        if (!selectedType) return;
        
        // Hide all type-specific sections
        document.querySelectorAll('.file-note-conditional').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show relevant section
        const typeSection = document.getElementById(`fileNoteType_${selectedType.value.toLowerCase().replace(/\s+/g, '_')}`);
        if (typeSection) {
            typeSection.style.display = 'block';
        }
    },
    
    // CDR outcome handler
    handleOutcomeChange(radio) {
        // Handle any outcome-specific fields
        const outcome = radio.value;
        
        // Hide all outcome-specific sections
        document.querySelectorAll('.cdr-outcome-conditional').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show relevant section
        const outcomeSection = document.getElementById(`outcome_${outcome.toLowerCase()}`);
        if (outcomeSection) {
            outcomeSection.style.display = 'block';
        }
    },
    
    // Subpoena organization handler
    handleOrganizationChange() {
        const orgType = document.getElementById('organizationType');
        if (!orgType) return;
        
        const template = STATIC_DATA.organizationTemplates[orgType.value];
        if (template) {
            const nameField = document.getElementById('recipientName');
            const addressField = document.getElementById('recipientAddress');
            
            if (nameField) nameField.value = template.name;
            if (addressField) addressField.value = template.address;
        }
    },
    
    // Date validation for subpoenas
    validateDates() {
        const returnDate = document.getElementById('returnDate');
        const complianceDate = document.getElementById('complianceDate');
        
        if (!returnDate || !complianceDate) return;
        
        const returnDateValue = new Date(returnDate.value);
        const complianceDateValue = new Date(complianceDate.value);
        
        if (complianceDateValue >= returnDateValue) {
            alert('Compliance date must be before the return date');
            complianceDate.value = '';
        }
    },
    
    // Client selection handlers
    loadClientInfo() {
        const clientSelect = document.getElementById('clientSelect');
        if (!clientSelect || !clientSelect.value) return;
        
        const clientId = clientSelect.value;
        const client = window.clients ? window.clients.find(c => c.id === clientId) : null;
        
        if (client) {
            window.currentClient = client;
            
            // Update selected client display
            this.updateSelectedClientDisplay(client);
            
            // Show client info section
            CoreUtils.showElement('clientInfoSection');
            
            // Update form fields
            CoreUtils.setFormFieldValue('matterNumber', client.matterNumber);
            
            // Show template selection
            CoreUtils.showElement('templateSelection');
        }
    },
    
    loadCDRClientInfo() {
        const clientSelect = document.getElementById('cdrClientSelect');
        if (!clientSelect || !clientSelect.value) return;
        
        const clientId = clientSelect.value;
        const client = window.clients ? window.clients.find(c => c.id === clientId) : null;
        
        if (client) {
            CoreUtils.setFormFieldValue('cdrClientName', CoreUtils.convertNameFormat(client.name));
            CoreUtils.setFormFieldValue('cdrMatterNumber', client.matterNumber);
            CoreUtils.setFormFieldValue('cdrCharges', client.charges);
        }
    },
    
    loadFileNoteClientInfo() {
        const clientSelect = document.getElementById('fileNoteClientSelect');
        if (!clientSelect || !clientSelect.value) return;
        
        const clientId = clientSelect.value;
        const client = window.clients ? window.clients.find(c => c.id === clientId) : null;
        
        if (client) {
            CoreUtils.setFormFieldValue('fileNoteClientName', CoreUtils.convertNameFormat(client.name));
            CoreUtils.setFormFieldValue('fileNoteMatterNumber', client.matterNumber);
            
            // Update client info display
            const clientInfo = document.getElementById('fileNoteClientInfo');
            if (clientInfo) {
                clientInfo.innerHTML = `
                    <h4>Client Information</h4>
                    <p><strong>Name:</strong> ${CoreUtils.convertNameFormat(client.name)}</p>
                    <p><strong>Matter:</strong> ${client.matterNumber}</p>
                    ${client.phone ? `<p><strong>Phone:</strong> ${client.phone}</p>` : ''}
                    ${client.email ? `<p><strong>Email:</strong> ${client.email}</p>` : ''}
                `;
                clientInfo.style.display = 'block';
            }
        }
    },
    
    // Update selected client display
    updateSelectedClientDisplay(client) {
        const displays = ['selectedClientName', 'selectedMatterNumber'];
        
        displays.forEach(displayId => {
            const element = document.getElementById(displayId);
            if (element) {
                switch(displayId) {
                    case 'selectedClientName':
                        element.textContent = CoreUtils.convertNameFormat(client.name);
                        break;
                    case 'selectedMatterNumber':
                        element.textContent = client.matterNumber;
                        break;
                }
                element.style.display = 'block';
            }
        });
    },
    
    // Template selection handler
    selectTemplate(templateType) {
        // Update all necessary UI elements
        const templateDisplay = document.getElementById('selectedTemplate');
        if (templateDisplay) {
            templateDisplay.textContent = LETTER_TEMPLATES[templateType]?.title || templateType;
            templateDisplay.style.display = 'block';
        }
        
        // Show appropriate form
        this.showTemplateForm(templateType);
    },
    
    // Show template-specific form
    showTemplateForm(templateType) {
        // Hide all template forms
        Object.keys(FORM_DEFINITIONS).forEach(type => {
            const formContainer = document.getElementById(`${type.toLowerCase()}Form`);
            if (formContainer) {
                formContainer.style.display = 'none';
            }
        });
        
        // Show selected template form
        const selectedFormContainer = document.getElementById(`${templateType.toLowerCase()}Form`);
        if (selectedFormContainer) {
            selectedFormContainer.style.display = 'block';
            
            // Build form dynamically using UIBuilder
            UIBuilder.buildForm(templateType, `${templateType.toLowerCase()}Form`);
        }
        
        // Show generate button
        CoreUtils.showElement('generateSection');
    }
};

// Make all handlers globally available for backwards compatibility
Object.assign(window, {
    // Generation functions
    generateLetter: EventHandlers.generateLetter.bind(EventHandlers),
    generateCDR: EventHandlers.generateCDR.bind(EventHandlers),
    generateFileNote: EventHandlers.generateFileNote.bind(EventHandlers),
    generateSubpoena: EventHandlers.generateSubpoena.bind(EventHandlers),
    
    // Toggle functions
    toggleLegalAidFields: EventHandlers.toggleLegalAidFields,
    toggleDepositFields: EventHandlers.toggleDepositFields,
    togglePleaFields: EventHandlers.togglePleaFields,
    toggleSentenceMaterials: EventHandlers.toggleSentenceMaterials,
    toggleADVOFields: EventHandlers.toggleADVOFields,
    toggleBailFields: EventHandlers.toggleBailFields,
    togglePenaltyFields: EventHandlers.togglePenaltyFields,
    toggleFinalADVOFields: EventHandlers.toggleFinalADVOFields,
    toggleFileNoteType: EventHandlers.toggleFileNoteType,
    
    // CDR and subpoena handlers
    handleOutcomeChange: EventHandlers.handleOutcomeChange,
    handleOrganizationChange: EventHandlers.handleOrganizationChange,
    validateDates: EventHandlers.validateDates,
    
    // Client handlers
    loadClientInfo: EventHandlers.loadClientInfo.bind(EventHandlers),
    loadCDRClientInfo: EventHandlers.loadCDRClientInfo.bind(EventHandlers),
    loadFileNoteClientInfo: EventHandlers.loadFileNoteClientInfo.bind(EventHandlers),
    
    // Template handlers
    selectTemplate: EventHandlers.selectTemplate.bind(EventHandlers),
    
    // Webhook
    sendWebhook: EventHandlers.sendWebhook
});

// Export for module use
window.EventHandlers = EventHandlers;
