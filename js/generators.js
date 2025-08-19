// PROMPT GENERATION FUNCTIONS
// Consolidate ALL prompt generation logic to eliminate repetition

const PromptGenerator = {
    // Collect all form data from any module
    collectFormData(formId = null) {
        const data = {};
        
        // Get all form inputs, textareas, and selects from the current module or specific form
        const container = formId ? document.getElementById(formId) : document.getElementById('moduleContainer');
        if (!container) return data;
        
        // Collect all input values
        container.querySelectorAll('input, textarea, select').forEach(element => {
            const { id, type, value, checked, name } = element;
            
            if (!id && !name) return;
            
            const key = id || name;
            
            switch(type) {
                case 'checkbox':
                    if (checked) {
                        // Handle checkbox groups
                        if (data[key]) {
                            data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
                        } else {
                            data[key] = value;
                        }
                    }
                    break;
                    
                case 'radio':
                    if (checked) {
                        data[key] = value;
                    }
                    break;
                    
                default:
                    if (value) {
                        data[key] = value;
                    }
            }
        });
        
        return data;
    },
    
    // Collect client information 
    getClientInfo() {
        const clientSelect = document.getElementById('clientSelect');
        if (!clientSelect || !clientSelect.value) return {};
        
        const clientId = clientSelect.value;
        const client = window.clients ? window.clients.find(c => c.id === clientId) : null;
        
        if (!client) return {};
        
        return {
            clientName: CoreUtils.convertNameFormat(client.name) || '',
            address: client.address || '',
            matterNumber: client.matterNumber || '',
            phone: client.phone || '',
            email: client.email || '',
            charges: client.charges || ''
        };
    },
    
    // Process checkbox groups into formatted text
    processCheckboxGroup(prefix, data, formatFunction = null) {
        const items = [];
        
        Object.keys(data).forEach(key => {
            if (key.startsWith(prefix) && data[key]) {
                const value = Array.isArray(data[key]) ? data[key].join(', ') : data[key];
                if (formatFunction) {
                    items.push(formatFunction(value));
                } else {
                    items.push(value);
                }
            }
        });
        
        return items.join(', ');
    },
    
    // Generate charges text from selected checkboxes
    generateChargesText(formData) {
        let chargesText = '';
        
        // Add database charges if present
        if (window.currentClient && window.currentClient.charges) {
            chargesText += `Database Charges: ${window.currentClient.charges}\n\n`;
        }
        
        // Process selected charges from checkboxes
        const selectedCharges = this.processCheckboxGroup('charge_', formData);
        if (selectedCharges) {
            chargesText += `Selected Charges: ${selectedCharges}`;
        }
        
        // Add additional charges
        if (formData.additionalCharges) {
            chargesText += `${chargesText ? '\n\n' : ''}Additional: ${formData.additionalCharges}`;
        }
        
        return chargesText || 'No charges specified';
    },
    
    // Generate legal aid section
    generateLegalAidSection(formData) {
        let section = '';
        
        if (formData.legalAidStatus === 'Yes') {
            section = 'Legal Aid: YES';
            if (formData.contribution) {
                section += `\nContribution: $${formData.contribution}`;
            }
        } else {
            section = 'Legal Aid: NO';
            if (formData.estimate) {
                section += `\nEstimate: $${formData.estimate}`;
            }
            if (formData.depositPaid === 'Yes' && formData.depositAmount) {
                section += `\nDeposit: $${formData.depositAmount} (PAID)`;
            }
        }
        
        return section;
    },
    
    // Generate conditional sections for letters
    generateConditionalSections(formData) {
        let sections = '';
        
        // ADVO section
        if (formData.advoApplied && formData.advoApplied !== 'No') {
            sections += `\nADVO: ${formData.advoApplied}`;
            if (formData.protectedPerson) {
                sections += `\nProtected Person: ${formData.protectedPerson}`;
            }
            if (formData.advoFacts) {
                sections += `\nADVO Facts: ${formData.advoFacts}`;
            }
            
            // Process ADVO conditions
            const advoConditions = this.processCheckboxGroup('advo_', formData, (condition) => {
                const conditionData = STATIC_DATA.advoConditions.find(c => c.id === condition || c.text.includes(condition));
                return conditionData ? `${conditionData.num}. ${conditionData.text}` : condition;
            });
            
            if (advoConditions) {
                sections += `\nADVO Conditions:\n${advoConditions}`;
            }
        }
        
        // Bail conditions section
        if (formData.bailConditions && formData.bailConditions.includes('Yes')) {
            sections += `\n\nBAIL: ${formData.bailConditions}`;
            if (formData.bailDetails) {
                sections += `\nDetails: ${formData.bailDetails}`;
            }
            
            const bailConditions = this.processCheckboxGroup('bail_', formData);
            if (bailConditions) {
                sections += `\nConditions: ${bailConditions}`;
            }
        }
        
        // Sentence materials
        if (formData.requiresSentenceMaterials && this.processCheckboxGroup('sentenceMaterials_', formData)) {
            const materials = this.processCheckboxGroup('sentenceMaterials_', formData);
            sections += `\n\nSentence Materials Required: ${materials}`;
        }
        
        return sections;
    },
    
    // Generate letter prompts
    generateLetterPrompt(letterType) {
        const formData = this.collectFormData();
        const clientInfo = this.getClientInfo();
        const combinedData = { ...clientInfo, ...formData };
        
        // Generate specific sections
        combinedData.charges = this.generateChargesText(formData);
        combinedData.legalAidDetails = this.generateLegalAidSection(formData);
        combinedData.conditionalSections = this.generateConditionalSections(formData);
        
        // Use template processor to generate final prompt
        return TemplateProcessor.process(letterType, combinedData);
    },
    
    // Generate CDR prompt
    generateCDRPrompt() {
        const formData = this.collectFormData();
        const clientInfo = this.getClientInfo();
        const combinedData = { ...clientInfo, ...formData };
        
        // Process allocate group
        const allocatedTo = this.processCheckboxGroup('allocate_', formData);
        combinedData.allocatedTo = allocatedTo || 'Not specified';
        
        // Format boolean fields
        combinedData.cdrClientExcused = formData.cdrClientExcused ? 'Yes' : 'No';
        combinedData.cdrFeeReminder = formData.cdrFeeReminder || 'No';
        
        return TemplateProcessor.process('CDR', combinedData);
    },
    
    // Generate file note prompt
    generateFileNotePrompt() {
        const formData = this.collectFormData();
        const clientInfo = this.getClientInfo();
        const combinedData = { ...clientInfo, ...formData };
        
        // Generate type-specific details
        let typeSpecificDetails = '';
        
        switch(formData.fileNoteType) {
            case 'Phone Call':
                if (formData.phoneDirection) {
                    typeSpecificDetails = `Direction: ${formData.phoneDirection}`;
                }
                if (formData.phoneNumber) {
                    typeSpecificDetails += `${typeSpecificDetails ? '\n' : ''}Phone: ${formData.phoneNumber}`;
                }
                break;
                
            case 'Meeting':
                if (formData.meetingLocation) {
                    typeSpecificDetails = `Location: ${formData.meetingLocation}`;
                }
                if (formData.attendees) {
                    typeSpecificDetails += `${typeSpecificDetails ? '\n' : ''}Attendees: ${formData.attendees}`;
                }
                break;
                
            case 'Court Appearance':
                if (formData.courtName) {
                    typeSpecificDetails = `Court: ${formData.courtName}`;
                }
                if (formData.magistrate) {
                    typeSpecificDetails += `${typeSpecificDetails ? '\n' : ''}Magistrate: ${formData.magistrate}`;
                }
                break;
                
            case 'Correspondence':
                if (formData.correspondenceType) {
                    typeSpecificDetails = `Type: ${formData.correspondenceType}`;
                }
                if (formData.correspondenceDirection) {
                    typeSpecificDetails += `${typeSpecificDetails ? '\n' : ''}Direction: ${formData.correspondenceDirection}`;
                }
                break;
        }
        
        combinedData.typeSpecificDetails = typeSpecificDetails;
        
        // Generate action section
        combinedData.actionSection = formData.fileNoteAction ? 
            `ACTION TAKEN:\n${formData.fileNoteAction}` : '';
        
        // Generate follow-up section
        combinedData.followUpSection = formData.fileNoteFollowUp ? 
            `FOLLOW-UP:\n${formData.fileNoteFollowUp}` : '';
        
        // Add creation timestamp
        combinedData.createdDate = CoreUtils.formatDate(CoreUtils.getTodayDate());
        combinedData.createdTime = new Date().toLocaleTimeString('en-AU', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        });
        
        return TemplateProcessor.process('FileNote', combinedData);
    },
    
    // Generate subpoena prompt
    generateSubpoenaPrompt() {
        const formData = this.collectFormData();
        const clientInfo = this.getClientInfo();
        const combinedData = { ...clientInfo, ...formData };
        
        // Format proceedings number line
        combinedData.proceedingsNumberLine = formData.proceedingsNumber ? 
            `Proceedings Number: ${formData.proceedingsNumber}` : '';
        
        // Format party description
        combinedData.partyDescription = formData.partyType === 'R v' ? 'Defendant' : 'Defendant';
        
        // Set today's date
        combinedData.todayDate = CoreUtils.formatDate(CoreUtils.getTodayDate());
        
        return TemplateProcessor.process('Subpoena', combinedData);
    },
    
    // Generate webhook data for Zapier integration
    generateWebhookData(type) {
        const formData = this.collectFormData();
        const clientInfo = this.getClientInfo();
        const combinedData = { ...clientInfo, ...formData };
        
        // Add generated prompt
        let prompt = '';
        switch(type) {
            case 'CDR':
                prompt = this.generateCDRPrompt();
                break;
            case 'FileNote':
                prompt = this.generateFileNotePrompt();
                break;
            case 'Subpoena':
                prompt = this.generateSubpoenaPrompt();
                break;
            default:
                prompt = this.generateLetterPrompt(type);
        }
        
        const webhookData = TemplateProcessor.getWebhookData(type, combinedData);
        webhookData.prompt = prompt;
        webhookData.clientName = combinedData.clientName;
        webhookData.matterNumber = combinedData.matterNumber;
        
        return webhookData;
    }
};

// Export for global use
window.PromptGenerator = PromptGenerator;
