// LETTER TEMPLATES CONFIGURATION
// Letter-specific settings and prompt generation rules

const LETTER_TEMPLATES = {
    CCL: {
        title: 'Client Care Letter (CCL)',
        templateFiles: 'CCL',
        promptTemplate: `Using the CCL template, draft a client care letter with this information:

CLIENT: {clientName}
ADDRESS: {address}
MATTER REF: {matterNumber}
CONTACT METHOD: {contactMethod}
CONTACT DATE: {contactDate}

CHARGES:
{charges}

LEGAL AID: {legalAidStatus}
{legalAidDetails}

PLEA: {plea}
FACTS: {facts}
INSTRUCTIONS: {instructions}
LISTED FOR: {listedFor}

{conditionalSections}

Please draft a comprehensive client care letter following the standard format.`,
        
        webhookData: {
            type: 'CCL',
            template: 'CCL_Template.docx'
        }
    },
    
    Mention: {
        title: 'Mention Letter',
        templateFiles: 'Mention',
        promptTemplate: `Using the Mention template, draft a mention letter with this information:

CLIENT: {clientName}
MATTER REF: {matterNumber}
COURT DATE: {courtDate}
COURT TIME: {courtTime}

OUTCOME: {outcome}

NEXT COURT DATE: {nextCourtDate}
NEXT COURT TIME: {nextCourtTime}
LISTED FOR: {nextListedFor}

BILLING:
Time spent: {timeSpent} hours
Travel time: {travelTime} hours

Please draft a mention letter following the standard format.`,
        
        webhookData: {
            type: 'Mention',
            template: 'Mention_Template.docx'
        }
    },
    
    Final: {
        title: 'Final Letter',
        templateFiles: 'Final',
        promptTemplate: `Using the Final template, draft a final letter with this information:

CLIENT: {clientName}
MATTER REF: {matterNumber}
FINAL COURT DATE: {finalCourtDate}
COURT TIME: {finalCourtTime}

BRIEF FACTS: {finalFacts}
SUBMISSIONS: {submissions}

VERDICT: {verdict}
PENALTY: {penalty}
{conditionalFields}

FINAL OUTCOME: {finalOutcome}
COSTS: {costs}

APPEAL ADVICE: {appealAdvice}

Please draft a final letter following the standard format.`,
        
        webhookData: {
            type: 'Final',
            template: 'Final_Template.docx'
        }
    },
    
    FeeReestimate: {
        title: 'Fee Re-estimate Letter',
        templateFiles: 'FeeReestimate',
        promptTemplate: `Using the Fee Re-estimate template, draft a fee re-estimate letter with this information:

CLIENT: {clientName}
MATTER REF: {matterNumber}
CONFERENCE DATE: {conferenceDate}

CONFERENCE OUTCOME: {conferenceOutcome}

ORIGINAL ESTIMATE: {originalEstimate}
REVISED ESTIMATE: {revisedEstimate}
REASON FOR INCREASE: {reasonForIncrease}
ADDITIONAL DEPOSIT: {additionalDeposit}

MATTER UPDATE: {matterUpdate}
NEXT ACTION DATE: {nextAction}
NEXT STEPS: {nextSteps}

Please draft a fee re-estimate letter following the standard format.`,
        
        webhookData: {
            type: 'FeeReestimate',
            template: 'FeeReestimate_Template.docx'
        }
    }
};

const CDR_TEMPLATE = {
    title: 'Court Disposition Record (CDR)',
    promptTemplate: `** ** ** ** **COURT OUTCOME** ** ** **
COURT: {cdrOutcomeCourt}
DATE: {cdrOutcomeDate}
CORAM: 
CROWN: 
START: {cdrStartTime}
FINISH: {cdrFinishTime}

**COURT DIARY REQUEST**
COURT DATE: {cdrCourtDate}
SOLICITOR: {cdrSolicitor}
CLIENT: {cdrClientName}
FILE NUMBER: {cdrMatterNumber}
REASON: {cdrReason}
COURT: {cdrCourt}
COURT TIME: {cdrCourtTime}
ALLOCATE TO: {allocatedTo}
CLIENT EXCUSED: {cdrClientExcused}
FEE REMINDER: {cdrFeeReminder}`,
    
    webhookData: {
        type: 'CDR'
    }
};

const FILE_NOTE_TEMPLATE = {
    title: 'File Note',
    promptTemplate: `FILE NOTE

Date: {fileNoteDate}
Time: {fileNoteTime}
Client: {fileNoteClientName}
Matter: {fileNoteMatterNumber}
Type: {fileNoteType}

{typeSpecificDetails}

CONTENT:
{fileNoteContent}

{actionSection}

{followUpSection}

---
File note created: {createdDate} at {createdTime}`,
    
    webhookData: {
        type: 'FileNote'
    }
};

const SUBPOENA_TEMPLATE = {
    title: 'Subpoena to Produce Documents',
    promptTemplate: `SUBPOENA TO PRODUCE DOCUMENTS

{courtLevel} of New South Wales
At {courtLocation}

{partyType} {clientName}
{proceedingsNumberLine}

TO: {recipientName}
    {recipientAddress}

YOU ARE COMMANDED to attend at {courtLevel} at {courtLocation} on {returnDate} at 9:00 AM and to bring with you and produce at that time and place the documents and things specified in the Schedule below.

YOU ARE FURTHER COMMANDED to produce the documents and things specified in the Schedule below to the solicitor named below by {complianceDate}.

FAILURE TO COMPLY WITH THIS SUBPOENA may constitute contempt of court and may result in the issue of a warrant for your arrest.

SCHEDULE OF DOCUMENTS

{documentsRequested}

RELEVANCE

{relevanceStatement}

DATED: {todayDate}

ISSUED BY:
{solicitorName}
Solicitor for the {partyDescription}
{lawFirmName}
{firmAddress}

Phone: {contactPhone}
Email: {contactEmail}

---
This subpoena was generated on {todayDate} using the Legal Letter Generation System.`,
    
    webhookData: {
        type: 'Subpoena'
    }
};

// Template processing functions
const TemplateProcessor = {
    // Process template with data replacement
    process(templateType, data) {
        let template;
        
        switch(templateType) {
            case 'CDR':
                template = CDR_TEMPLATE.promptTemplate;
                break;
            case 'FileNote':
                template = FILE_NOTE_TEMPLATE.promptTemplate;
                break;
            case 'Subpoena':
                template = SUBPOENA_TEMPLATE.promptTemplate;
                break;
            default:
                template = LETTER_TEMPLATES[templateType]?.promptTemplate || '';
        }
        
        return this.replaceTokens(template, data);
    },
    
    // Replace tokens in template with actual data
    replaceTokens(template, data) {
        let result = template;
        
        // Replace simple tokens
        Object.keys(data).forEach(key => {
            const token = `{${key}}`;
            const value = data[key] || '';
            result = result.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), value);
        });
        
        // Process conditional sections
        result = this.processConditionalSections(result, data);
        
        return result;
    },
    
    // Process conditional sections in templates
    processConditionalSections(template, data) {
        // Handle conditional sections like {conditionalSections}
        if (template.includes('{conditionalSections}')) {
            let conditionalContent = '';
            
            // Add ADVO section if applicable
            if (data.advoApplied && data.advoApplied !== 'No') {
                conditionalContent += `\nADVO: ${data.advoApplied}`;
                if (data.protectedPerson) {
                    conditionalContent += `\nProtected Person: ${data.protectedPerson}`;
                }
                if (data.advoConditions) {
                    conditionalContent += `\nConditions: ${data.advoConditions}`;
                }
            }
            
            // Add bail conditions if applicable
            if (data.bailConditions && data.bailConditions !== 'No') {
                conditionalContent += `\nBAIL: ${data.bailConditions}`;
                if (data.bailDetails) {
                    conditionalContent += `\nDetails: ${data.bailDetails}`;
                }
            }
            
            template = template.replace('{conditionalSections}', conditionalContent);
        }
        
        return template;
    },
    
    // Get webhook data structure for template type
    getWebhookData(templateType, data) {
        let baseData;
        
        switch(templateType) {
            case 'CDR':
                baseData = CDR_TEMPLATE.webhookData;
                break;
            case 'FileNote':
                baseData = FILE_NOTE_TEMPLATE.webhookData;
                break;
            case 'Subpoena':
                baseData = SUBPOENA_TEMPLATE.webhookData;
                break;
            default:
                baseData = LETTER_TEMPLATES[templateType]?.webhookData || {};
        }
        
        return {
            ...baseData,
            ...data,
            submissionDate: new Date().toISOString().split('T')[0]
        };
    }
};

// Freeze to prevent accidental modification
Object.freeze(LETTER_TEMPLATES);
Object.freeze(CDR_TEMPLATE);
Object.freeze(FILE_NOTE_TEMPLATE);
Object.freeze(SUBPOENA_TEMPLATE);
Object.freeze(TemplateProcessor);

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.LETTER_TEMPLATES = LETTER_TEMPLATES;
    window.CDR_TEMPLATE = CDR_TEMPLATE;
    window.FILE_NOTE_TEMPLATE = FILE_NOTE_TEMPLATE;
    window.SUBPOENA_TEMPLATE = SUBPOENA_TEMPLATE;
    window.TemplateProcessor = TemplateProcessor;
}
