// FORM DEFINITIONS CONFIGURATION
// Define all form structures without repetition

const FORM_DEFINITIONS = {
    CCL: {
        sections: [
            {
                title: 'Contact Details',
                fields: [
                    { 
                        type: 'select', 
                        id: 'contactMethod', 
                        label: 'Contact Method', 
                        required: true, 
                        options: 'contactMethods' 
                    },
                    { 
                        type: 'date', 
                        id: 'contactDate', 
                        label: 'Contact Date', 
                        required: true, 
                        default: 'today' 
                    }
                ]
            },
            {
                title: 'Charges',
                type: 'charges-selector',
                includeDatabase: true,
                additionalFields: [
                    { type: 'textarea', id: 'additionalCharges', label: 'Additional Charges', placeholder: 'Enter any additional charges not listed above' },
                    { type: 'number', id: 'counts', label: 'Number of Counts', min: 1, value: 1 }
                ]
            },
            {
                title: 'Legal Aid & Fees',
                fields: [
                    { 
                        type: 'select', 
                        id: 'legalAidStatus', 
                        label: 'Legal Aid?', 
                        required: true,
                        options: ['Yes', 'No'],
                        onchange: 'toggleLegalAidFields()',
                        conditional: {
                            'Yes': [
                                { type: 'number', id: 'contribution', label: 'Contribution Amount ($)', step: '0.01' }
                            ],
                            'No': [
                                { type: 'number', id: 'estimate', label: 'Estimate Amount ($)', required: true, step: '0.01' },
                                { 
                                    type: 'select', 
                                    id: 'depositPaid', 
                                    label: 'Deposit Paid?', 
                                    options: ['Yes', 'No'],
                                    onchange: 'toggleDepositFields()',
                                    conditional: {
                                        'Yes': [
                                            { type: 'number', id: 'depositAmount', label: 'Deposit Amount ($)', step: '0.01' }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            {
                title: 'Instructions',
                fields: [
                    { 
                        type: 'select', 
                        id: 'plea', 
                        label: 'Plea', 
                        required: true,
                        options: ['Not Guilty', 'Guilty', 'No plea entered', 'Undecided'],
                        onchange: 'togglePleaFields()'
                    },
                    { type: 'textarea', id: 'facts', label: 'Brief facts as related by client', rows: 4 },
                    { type: 'textarea', id: 'instructions', label: 'Instructions', rows: 3 },
                    { 
                        type: 'select', 
                        id: 'listedFor', 
                        label: 'Next Court Date Listed For', 
                        options: 'listedForOptions' 
                    },
                    {
                        type: 'checkbox-conditional',
                        id: 'requiresSentenceMaterials',
                        label: 'Requires sentence materials?',
                        onchange: 'toggleSentenceMaterials()',
                        conditionalId: 'sentenceMaterials',
                        conditionalType: 'checkbox-group',
                        conditionalOptions: 'sentenceMaterials'
                    }
                ]
            },
            {
                title: 'ADVO Details',
                type: 'conditional-section',
                triggerField: {
                    type: 'select',
                    id: 'advoApplied',
                    label: 'ADVO Applied For?',
                    options: ['No', 'Interim', 'Final'],
                    onchange: 'toggleADVOFields()'
                },
                conditionalContent: {
                    'Interim': 'advo-details',
                    'Final': 'advo-details'
                }
            },
            {
                title: 'Bail Conditions',
                type: 'conditional-section',
                triggerField: {
                    type: 'select',
                    id: 'bailConditions',
                    label: 'Bail Conditions?',
                    options: ['No', 'Yes - Conditional Bail', 'Yes - Unconditional Bail'],
                    onchange: 'toggleBailFields()'
                },
                conditionalContent: {
                    'Yes - Conditional Bail': 'bail-conditions'
                }
            }
        ]
    },
    
    Mention: {
        sections: [
            {
                title: 'Appearance Details',
                fields: [
                    { type: 'date', id: 'courtDate', label: 'Court Date', required: true },
                    { type: 'time', id: 'courtTime', label: 'Court Time', value: '09:30', required: true },
                    { type: 'textarea', id: 'outcome', label: 'Court Outcome', required: true, rows: 4 }
                ]
            },
            {
                title: 'Next Court Date',
                fields: [
                    { type: 'date', id: 'nextCourtDate', label: 'Next Court Date', required: true },
                    { type: 'time', id: 'nextCourtTime', label: 'Next Court Time', value: '09:30' },
                    { type: 'select', id: 'nextListedFor', label: 'Listed For', options: 'listedForOptions', required: true }
                ]
            },
            {
                title: 'Billing',
                fields: [
                    { type: 'number', id: 'timeSpent', label: 'Time Spent (hours)', step: '0.1', required: true },
                    { type: 'number', id: 'travelTime', label: 'Travel Time (hours)', step: '0.1', value: 0 }
                ]
            }
        ]
    },
    
    Final: {
        sections: [
            {
                title: 'Final Court Appearance',
                fields: [
                    { type: 'date', id: 'finalCourtDate', label: 'Final Court Date', required: true },
                    { type: 'time', id: 'finalCourtTime', label: 'Court Time', value: '09:30' },
                    { type: 'textarea', id: 'finalFacts', label: 'Brief Facts', rows: 4 },
                    { type: 'textarea', id: 'submissions', label: 'Submissions Made', rows: 4 }
                ]
            },
            {
                title: 'Outcome',
                fields: [
                    { type: 'select', id: 'verdict', label: 'Verdict', options: 'outcomes', required: true, onchange: 'togglePenaltyFields()' },
                    { type: 'select', id: 'penalty', label: 'Penalty', options: 'penalties', required: true },
                    { 
                        type: 'textarea', 
                        id: 'conditions', 
                        label: 'Conditions (if applicable)', 
                        rows: 3,
                        conditional: {
                            showWhen: ['penalty', 'contains', 'Conditional']
                        }
                    },
                    { type: 'textarea', id: 'finalOutcome', label: 'Final Outcome Summary', rows: 4, required: true },
                    { type: 'textarea', id: 'costs', label: 'Costs Order', rows: 2 }
                ]
            },
            {
                title: 'Final ADVO',
                type: 'conditional-section',
                triggerField: {
                    type: 'select',
                    id: 'finalADVO',
                    label: 'Final ADVO Outcome',
                    options: ['No ADVO', 'ADVO Made', 'ADVO Dismissed', 'ADVO Withdrawn'],
                    onchange: 'toggleFinalADVOFields()'
                }
            },
            {
                title: 'Appeal Information',
                fields: [
                    { type: 'textarea', id: 'appealAdvice', label: 'Appeal advice given to client', rows: 3 }
                ]
            }
        ]
    },
    
    FeeReestimate: {
        sections: [
            {
                title: 'Conference Details',
                fields: [
                    { type: 'date', id: 'conferenceDate', label: 'Conference Date', required: true },
                    { type: 'textarea', id: 'conferenceOutcome', label: 'Conference Outcome', rows: 4, required: true }
                ]
            },
            {
                title: 'Fee Information',
                fields: [
                    { type: 'number', id: 'originalEstimate', label: 'Original Estimate ($)', step: '0.01', required: true },
                    { type: 'number', id: 'revisedEstimate', label: 'Revised Estimate ($)', step: '0.01', required: true },
                    { type: 'textarea', id: 'reasonForIncrease', label: 'Reason for Increase', rows: 3, required: true },
                    { type: 'number', id: 'additionalDeposit', label: 'Additional Deposit Required ($)', step: '0.01' }
                ]
            },
            {
                title: 'Matter Update',
                fields: [
                    { type: 'textarea', id: 'matterUpdate', label: 'Matter Update', rows: 4, required: true },
                    { type: 'date', id: 'nextAction', label: 'Next Action Date' },
                    { type: 'textarea', id: 'nextSteps', label: 'Next Steps', rows: 3 }
                ]
            }
        ]
    },
    
    CDR: {
        sections: [
            {
                title: 'Client Information',
                fields: [
                    { type: 'text', id: 'cdrClientName', label: 'Client Name', required: true },
                    { type: 'text', id: 'cdrMatterNumber', label: 'Matter Number', required: true },
                    { type: 'text', id: 'cdrCourt', label: 'Court', required: true },
                    { type: 'textarea', id: 'cdrCharges', label: 'Charges', rows: 2 },
                    { type: 'select', id: 'cdrLegalAid', label: 'Legal Aid', options: ['No', 'Yes'] },
                    { type: 'text', id: 'cdrPlea', label: 'Plea Entered' }
                ]
            },
            {
                title: 'Court Outcome',
                fields: [
                    {
                        type: 'radio-group',
                        name: 'courtOutcome',
                        label: 'Outcome',
                        options: [
                            { value: 'Adjourned', label: 'Adjourned', id: 'outcomeAdjourned' },
                            { value: 'Mention', label: 'Mention', id: 'outcomeMention' },
                            { value: 'Resolved', label: 'Resolved', id: 'outcomeResolved' },
                            { value: 'Sentence', label: 'Sentence', id: 'outcomeSentence' }
                        ],
                        onchange: 'handleOutcomeChange(this)'
                    },
                    { type: 'text', id: 'cdrOutcomeCourt', label: 'Court' },
                    { type: 'date', id: 'cdrOutcomeDate', label: 'Date' },
                    { type: 'time', id: 'cdrStartTime', label: 'Start Time', value: '09:30' },
                    { type: 'time', id: 'cdrFinishTime', label: 'Finish Time', value: '10:00' }
                ]
            },
            {
                title: 'Court Diary Request',
                fields: [
                    { type: 'date', id: 'cdrCourtDate', label: 'Court Date' },
                    { type: 'select', id: 'cdrSolicitor', label: 'Solicitor', options: 'solicitors', optionKey: 'code' },
                    { type: 'select', id: 'cdrReason', label: 'Reason', options: 'listedForOptions' },
                    { type: 'time', id: 'cdrCourtTime', label: 'Court Time', value: '09:30' },
                    {
                        type: 'checkbox-group',
                        label: 'Allocate To',
                        id: 'allocateGroup',
                        options: 'solicitors',
                        prefix: 'allocate_',
                        optionKey: 'code'
                    },
                    { type: 'checkbox', id: 'cdrClientExcused', label: 'Client Excused' },
                    { type: 'text', id: 'cdrFeeReminder', label: 'Fee Reminder' }
                ]
            }
        ]
    },
    
    FileNote: {
        sections: [
            {
                title: 'Note Type',
                fields: [
                    {
                        type: 'radio-group',
                        name: 'fileNoteType',
                        label: 'File Note Type',
                        options: 'fileNoteTypes',
                        optionKey: 'value',
                        labelKey: 'label',
                        onchange: 'toggleFileNoteType()'
                    }
                ]
            },
            {
                title: 'Basic Information',
                fields: [
                    { type: 'text', id: 'fileNoteClientName', label: 'Client Name', required: true },
                    { type: 'text', id: 'fileNoteMatterNumber', label: 'Matter Number', required: true },
                    { type: 'date', id: 'fileNoteDate', label: 'Date', required: true, default: 'today' },
                    { type: 'time', id: 'fileNoteTime', label: 'Time', required: true, default: 'now' },
                    { type: 'textarea', id: 'fileNoteContent', label: 'Content', required: true, rows: 4 },
                    { type: 'textarea', id: 'fileNoteAction', label: 'Action Taken', rows: 2 },
                    { type: 'textarea', id: 'fileNoteFollowUp', label: 'Follow-up Required', rows: 2 }
                ]
            }
        ]
    },
    
    Subpoena: {
        sections: [
            {
                title: 'Recipient Details',
                fields: [
                    {
                        type: 'select',
                        id: 'organizationType',
                        label: 'Organization Type',
                        options: ['', 'NSW Police'],
                        onchange: 'handleOrganizationChange()'
                    },
                    { type: 'text', id: 'recipientName', label: 'Name of Person/Organization', required: true },
                    { type: 'textarea', id: 'recipientAddress', label: 'Full Address', required: true, rows: 3 }
                ]
            },
            {
                title: 'Court Information',
                fields: [
                    { type: 'select', id: 'courtLevel', label: 'Court Level', options: 'courtLevels', required: true },
                    { type: 'text', id: 'courtLocation', label: 'Court Location', required: true },
                    { type: 'date', id: 'returnDate', label: 'Return Date', required: true },
                    { type: 'date', id: 'complianceDate', label: 'Compliance Date', required: true, onchange: 'validateDates()' }
                ]
            },
            {
                title: 'Case Details',
                fields: [
                    { type: 'select', id: 'partyType', label: 'Party Type', options: ['R v', 'Police v'], required: true },
                    { type: 'text', id: 'clientName', label: 'Client Name', required: true },
                    { type: 'text', id: 'proceedingsNumber', label: 'Proceedings Number' },
                    { type: 'textarea', id: 'chargeOffence', label: 'Charge/Offence', required: true, rows: 2 }
                ]
            },
            {
                title: 'Documents Sought',
                fields: [
                    { type: 'textarea', id: 'documentsRequested', label: 'Documents Requested', required: true, rows: 3 },
                    { type: 'textarea', id: 'relevanceStatement', label: 'Relevance Statement', required: true, rows: 3 }
                ]
            },
            {
                title: 'Contact Information',
                fields: [
                    { type: 'select', id: 'solicitorName', label: 'Solicitor Name', options: 'solicitors', optionKey: 'name', required: true },
                    { type: 'text', id: 'lawFirmName', label: 'Law Firm Name', required: true },
                    { type: 'textarea', id: 'firmAddress', label: 'Firm Address', required: true, rows: 3 },
                    { type: 'tel', id: 'contactPhone', label: 'Contact Phone', required: true },
                    { type: 'email', id: 'contactEmail', label: 'Contact Email', required: true }
                ]
            }
        ]
    }
};

// Special content definitions for complex sections
const SPECIAL_SECTIONS = {
    'advo-details': {
        fields: [
            { type: 'date', id: 'advoDate', label: 'ADVO Date' },
            { type: 'text', id: 'protectedPerson', label: 'Protected Person(s)' },
            { type: 'textarea', id: 'advoFacts', label: 'ADVO Facts', rows: 3 },
            {
                type: 'checkbox-group',
                label: 'ADVO Conditions',
                options: 'advoConditions',
                prefix: 'advo_',
                displayFull: true
            }
        ]
    },
    
    'bail-conditions': {
        fields: [
            { type: 'textarea', id: 'bailDetails', label: 'Bail Conditions Details', rows: 4 },
            {
                type: 'checkbox-group',
                label: 'Standard Bail Conditions',
                options: 'bailConditions',
                prefix: 'bail_'
            }
        ]
    }
};

// Freeze to prevent accidental modification
Object.freeze(FORM_DEFINITIONS);
Object.freeze(SPECIAL_SECTIONS);

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.FORM_DEFINITIONS = FORM_DEFINITIONS;
    window.SPECIAL_SECTIONS = SPECIAL_SECTIONS;
}
