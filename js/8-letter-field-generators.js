
const generateCCLPrompt = () => {
    const contactMethod = document.getElementById('contactMethod')?.value;
    const contactDate = document.getElementById('contactDate')?.value;
    const charges = getSelectedCharges();
    const plea = document.getElementById('plea')?.value;
    const legalAid = document.getElementById('legalAidStatus')?.value;
    const clientInstructions = document.getElementById('clientInstructions')?.value;
    const nextCourtDate = document.getElementById('nextCourtDate')?.value;
    const requiredAttend = document.getElementById('requiredAttend')?.value;

    let prompt = `Using the CCL template, draft a letter with this information:\n\n`;
    prompt += `CLIENT: ${currentClient.name}\n`;
    prompt += `ADDRESS: ${currentClient.address || 'Not provided'}\n`;
    prompt += `MATTER REF: ${currentClient.matterNumber}\n\n`;

    prompt += `Contact: ${contactMethod} on ${formatDate(contactDate)}\n\n`;

    prompt += `COURT: ${currentClient.court}\n`;
    prompt += `MATTER TYPE: ${currentClient.matterType}\n`;
    prompt += `CHARGES: ${charges}\n\n`;

    if (legalAid === 'Yes') {
        prompt += `LEGAL AID: Yes`;
        const contribution = document.getElementById('contribution')?.value;
        if (contribution) {
            prompt += ` - Contribution: ${contribution}`;
        }
    } else {
        prompt += `PRIVATE CLIENT - Estimate: ${document.getElementById('estimate')?.value || 'TBD'}`;
        if (document.getElementById('depositPaid')?.value === 'Yes') {
            prompt += ` (deposit of ${document.getElementById('depositAmount')?.value} already paid)`;
        }
    }
    prompt += `\n\n`;

    prompt += `PLEA: ${plea}\n`;
    prompt += `CLIENT INSTRUCTIONS: ${clientInstructions}\n`;

    if (nextCourtDate) {
        prompt += `NEXT COURT DATE: ${formatDate(nextCourtDate)}`;
        if (requiredAttend) {
            prompt += ` - Client ${requiredAttend === 'Yes' ? 'required' : 'not required'} to attend`;
        }
        prompt += `\n`;
    }

    if (plea === 'Guilty') {
        const materials = getSelectedMaterials();
        if (materials) {
            prompt += `\nSENTENCE MATERIALS DISCUSSED: ${materials}\n`;
        }
    }

    const advoType = document.getElementById('advoType')?.value;
    if (advoType) {
        prompt += `\nADVO: ${advoType} for ${document.getElementById('pinop')?.value}`;
        prompt += ` (${document.getElementById('advoDuration')?.value})`;
        const conditions = getADVOConditions();
        prompt += `\nCONDITIONS: ${conditions}\n`;
    }

    if (document.getElementById('hasBail')?.value === 'Yes') {
        const bailConditions = getBailConditions();
        if (bailConditions) {
            prompt += `\nBAIL CONDITIONS: ${bailConditions}\n`;
        }
    }

    const additionalInfo = document.getElementById('additionalInfo')?.value;
    if (additionalInfo) {
        prompt += `\nADDITIONAL INFORMATION: ${additionalInfo}\n`;
    }

    return prompt;
};

const generateMentionPrompt = () => {
    const courtDate = document.getElementById('courtDate')?.value;
    const whoAppeared = document.getElementById('whoAppeared')?.value;
    const listedFor = document.getElementById('listedFor')?.value;
    const whatOccurred = document.getElementById('whatOccurred')?.value;
    const nextCourtDate = document.getElementById('nextCourtDate')?.value;
    const nextListedFor = document.getElementById('nextListedFor')?.value;
    const requiredAttend = document.getElementById('requiredAttend')?.value;

    let prompt = `Using the Mention Letter template, draft a letter with this information:\n\n`;
    prompt += `CLIENT: ${currentClient.name}\n`;
    prompt += `ADDRESS: ${currentClient.address || 'Not provided'}\n`;
    prompt += `MATTER REF: ${currentClient.matterNumber}\n\n`;

    prompt += `COURT: ${currentClient.court}\n`;
    prompt += `Date of appearance: ${formatDate(courtDate)}\n`;
    prompt += `Listed for: ${listedFor}\n`;
    prompt += `Who appeared: ${whoAppeared}\n\n`;

    prompt += `WHAT OCCURRED: ${whatOccurred}\n\n`;

    if (nextCourtDate) {
        prompt += `NEXT DATE: ${formatDate(nextCourtDate)}`;
        if (nextListedFor) {
            prompt += ` for ${nextListedFor}`;
        }
        prompt += `\n`;
        if (requiredAttend) {
            prompt += `Client ${requiredAttend === 'Yes' ? 'required' : 'not required'} to attend\n`;
        }
    }

    const interimInvoice = document.getElementById('interimInvoice')?.value;
    if (interimInvoice) {
        const status = document.getElementById('invoiceStatus')?.value;
        prompt += `\nInterim invoice amount: ${interimInvoice}`;
        if (status) {
            prompt += ` (${status.toLowerCase()})`;
        }
        prompt += `\n`;
    }

    const additionalInfo = document.getElementById('additionalInfo')?.value;
    if (additionalInfo) {
        prompt += `\nADDITIONAL INFORMATION: ${additionalInfo}\n`;
    }

    return prompt;
};

const generateFinalPrompt = () => {
    const courtDate = document.getElementById('courtDate')?.value;
    const finalListedFor = document.getElementById('finalListedFor')?.value;
    const whoAppeared = document.getElementById('whoAppeared')?.value;
    const outcome = document.getElementById('outcome')?.value;
    const penalty = document.getElementById('penalty')?.value;
    const penaltyLength = document.getElementById('penaltyLength')?.value;
    const appealProspects = document.getElementById('appealProspects')?.value;

    let prompt = `Using the Final Letter template, draft a letter with this information:\n\n`;
    prompt += `CLIENT: ${currentClient.name}\n`;
    prompt += `ADDRESS: ${currentClient.address || 'Not provided'}\n`;
    prompt += `MATTER REF: ${currentClient.matterNumber}\n\n`;

    prompt += `COURT: ${currentClient.court}\n`;
    prompt += `Date: ${formatDate(courtDate)}\n`;
    prompt += `Matter was listed for: ${finalListedFor}\n\n`;

    prompt += `CHARGES: ${currentClient.charges}\n\n`;

    if (whoAppeared === 'Counsel appeared') {
        prompt += `REPRESENTATION: Counsel appeared (need name)\n`;
    } else {
        prompt += `REPRESENTATION: I appeared\n`;
    }

    prompt += `\nOUTCOME: ${outcome}\n`;

    if (penalty) {
        prompt += `\nPENALTY: ${penalty}`;
        if (penaltyLength) {
            prompt += ` - ${penaltyLength}`;
        }
        prompt += `\n`;

        const conditions = document.getElementById('penaltyConditions')?.value;
        if (conditions) {
            prompt += `CONDITIONS: ${conditions}\n`;
        }
    }

    const license = document.getElementById('licenseDisqualification')?.value;
    if (license) {
        prompt += `\nLICENSE DISQUALIFICATION: ${license}\n`;
        const interlock = document.getElementById('interlockOrder')?.value;
        if (interlock) {
            prompt += `INTERLOCK ORDER: ${interlock}\n`;
        }
    }

    if (document.getElementById('finalADVO')?.value === 'Yes') {
        const pinop = document.getElementById('pinop')?.value;
        const duration = document.getElementById('advoDuration')?.value;
        const conditions = getFinalADVOConditions();
        prompt += `\nADVO made final for ${pinop} (${duration})\n`;
        prompt += `CONDITIONS: ${conditions}\n`;
    }

    prompt += `\nAPPEAL PROSPECTS: ${appealProspects}\n`;

    if (currentClient.legalAid) {
        prompt += `\nLEGAL AID MATTER`;
        if (currentClient.contribution) {
            prompt += ` - Outstanding contribution: ${currentClient.contribution}`;
        }
    } else {
        const finalInvoice = document.getElementById('finalInvoiceAmount')?.value;
        const outstanding = document.getElementById('outstandingAmount')?.value;
        prompt += `\nPRIVATE MATTER`;
        if (finalInvoice) {
            prompt += ` - Final invoice: ${finalInvoice}`;
        }
        if (outstanding) {
            prompt += ` - Outstanding: ${outstanding}`;
        }
    }

    const additionalInfo = document.getElementById('additionalInfo')?.value;
    if (additionalInfo) {
        prompt += `\n\nADDITIONAL INFORMATION: ${additionalInfo}\n`;
    }

    return prompt;
};

const generateFeeReestimatePrompt = () => {
    const conferenceDate = document.getElementById('conferenceDate')?.value;
    const conferenceType = document.getElementById('conferenceType')?.value;
    const originalEstimate = document.getElementById('originalEstimate')?.value;
    const additionalAmount = document.getElementById('additionalAmount')?.value;
    const reasonIncrease = document.getElementById('reasonIncrease')?.value;
    const nextCourtDate = document.getElementById('nextCourtDate')?.value;
    const nextListedFor = document.getElementById('nextListedFor')?.value;

    let prompt = `Using the Fee Re-estimate Letter template, draft a letter with this information:\n\n`;
    prompt += `CLIENT: ${currentClient.name}\n`;
    prompt += `ADDRESS: ${currentClient.address || 'Not provided'}\n`;
    prompt += `MATTER REF: ${currentClient.matterNumber}\n\n`;

    prompt += `Conference date: ${formatDate(conferenceDate)}\n`;
    prompt += `Conference type: ${conferenceType}\n\n`;

    prompt += `COURT: ${currentClient.court}\n`;

    if (nextCourtDate) {
        prompt += `Next court date: ${formatDate(nextCourtDate)}`;
        if (nextListedFor) {
            prompt += ` for ${nextListedFor}`;
        }
        prompt += `\n`;
    }

    const total = (parseFloat(originalEstimate) || 0) + (parseFloat(additionalAmount) || 0);
    prompt += `\nOriginal estimate: ${originalEstimate}\n`;
    prompt += `Additional amount: ${additionalAmount}\n`;
    prompt += `New total estimate: ${total}\n`;
    prompt += `Reason for increase: ${reasonIncrease}\n`;

    const progress = document.getElementById('matterProgress')?.value;
    if (progress) {
        prompt += `\nMatter progress: ${progress}\n`;
    }

    const interimAmount = document.getElementById('interimInvoiceAmount')?.value;
    if (interimAmount) {
        const status = document.getElementById('interimStatus')?.value;
        prompt += `\nInterim invoice: ${interimAmount}`;
        if (status) {
            prompt += ` - ${status}`;
        }
        prompt += `\n`;
    }

    const trustDeposit = document.getElementById('trustDeposit')?.value;
    if (trustDeposit) {
        prompt += `Trust deposit required: ${trustDeposit}\n`;
    }

    if (currentClient.matterType?.includes('Criminal')) {
        prompt += `\nNote: This is a criminal matter (use criminal variable list in paragraph 27)\n`;
    }

    const additionalInfo = document.getElementById('additionalInfo')?.value;
    if (additionalInfo) {
        prompt += `\nADDITIONAL INFORMATION: ${additionalInfo}\n`;
    }

    return prompt;
};

const getSelectedCharges = () => {
    const charges = [];

    if (currentClient && currentClient.charges) {
        charges.push(currentClient.charges);
    }

    document.querySelectorAll('input[type="checkbox"][id^="charge_"]:checked').forEach(cb => {
        charges.push(cb.value);
    });

    const additional = document.getElementById('additionalCharges')?.value;
    if (additional) charges.push(additional);

    let allCharges = charges.join(', ');

    const counts = document.getElementById('counts')?.value;
    if (counts && counts > 1) {
        allCharges += ` (${counts} counts)`;
    }

    return allCharges || 'No charges specified';
};

const getSelectedMaterials = () => {
    const materials = [];
    document.querySelectorAll('input[type="checkbox"][id^="mat_"]:checked').forEach(cb => {
        materials.push(cb.value);
    });
    return materials.join(', ');
};

const getADVOConditions = () => {
    const conditions = ['1 (mandatory)'];
    document.querySelectorAll('input[type="checkbox"][id^="advo_"]:checked').forEach(cb => {
        conditions.push(cb.value);
    });
    return conditions.join(', ');
};

const getFinalADVOConditions = () => {
    const conditions = ['1 (mandatory)'];
    document.querySelectorAll('input[type="checkbox"][id^="final_advo_"]:checked').forEach(cb => {
        conditions.push(cb.value);
    });
    return conditions.join(', ');
};

const getBailConditions = () => {
    const select = document.getElementById('bailConditions');
    if (!select) return '';
    const selected = Array.from(select.selectedOptions).map(opt => opt.value);

    const additional = document.getElementById('additionalBail')?.value;
    if (additional) selected.push(additional);

    return selected.join(', ');
};
