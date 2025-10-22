// CDR (Court Diary Request) Module
// Handles CDR generation, formatting, and submission

// Load CDR Client Info
const loadCDRClientInfo = () => {
    const clientId = parseInt(document.getElementById('cdrClientSelect').value);
    const fields = ['cdrClientName', 'cdrFileNumber', 'cdrCourt', 'cdrOutcomeCourt'];

    if (!clientId) {
        fields.forEach(f => document.getElementById(f).value = '');
        return;
    }

    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    document.getElementById('cdrClientName').value = client.name;
    document.getElementById('cdrFileNumber').value = client.matterNumber;
    document.getElementById('cdrCourt').value = client.court;
    document.getElementById('cdrOutcomeCourt').value = client.court;

    if (client.nextCourt) {
        document.getElementById('cdrCourtDate').value = client.nextCourt;
    }
};

// Get Allocated To (Combined)
const getAllocatedTo = () => {
    const allocated = [];
    // Cache checkbox query if not already cached
    if (!allocateCheckboxes) {
        allocateCheckboxes = document.querySelectorAll('input[id^="allocate_"]');
    }
    // Only get the CC solicitors from checkboxes (not admin)
    allocateCheckboxes.forEach(cb => {
        if (cb.checked) allocated.push(cb.value);
    });
    return allocated.join(', ') || 'TBD';
};

// Get Letter Allocated To
const getLetterAllocatedTo = () => {
    const allocated = [];
    // Only get the CC solicitors from checkboxes (not admin)
    const checkboxes = document.querySelectorAll('input[id^="letter_allocate_"]:checked');
    checkboxes.forEach(cb => {
        allocated.push(cb.value);
    });
    return allocated.join(', ') || 'TBD';
};

// Format CDR as Text
const formatCDRText = (data) => {
    return `** ** ** ** **COURT OUTCOME** ** ** **
COURT: ${data.outcomeCourt}
DATE: ${formatDate(data.outcomeDate)}
CORAM:
CROWN:
START: ${data.startTime}
FINISH: ${data.finishTime}

**COURT DIARY REQUEST**
COURT DATE: ${formatDate(data.courtDate)}
SOLICITOR: ${data.solicitor}
CLIENT: ${data.clientName}
FILE NUMBER: ${data.fileNumber}
REASON: ${data.reason}
COURT: ${data.court}
COURT TIME: ${data.courtTime}
ALLOCATE TO: ${data.allocateTo}
CLIENT EXCUSED: ${data.clientExcused ? 'Yes' : 'No'}
FEE REMINDER: ${data.feeReminder || 'N/A'}${data.additionalDates ? '\n\nADDITIONAL DATES:\n' + data.additionalDates : ''}`;
};

// Format CDR as HTML
const formatCDRHTML = (data) => {
    const row = (label, value) => `
        <tr>
            <td style="width: 30%; padding: 5px 10px; font-weight: bold;">${label}:</td>
            <td style="width: 70%; padding: 5px 10px;">${value || ''}</td>
        </tr>`;

    return `
    <div style="font-family: Arial, sans-serif; font-size: 10pt; color: black;">
        <p style="text-align: center; font-weight: bold; margin: 20px 0;">COURT OUTCOME</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 650px;">
            ${row('COURT', data.outcomeCourt)}
            ${row('DATE', formatDate(data.outcomeDate))}
            ${row('CORAM', '')}
            ${row('CROWN', '')}
            ${row('START', data.startTime)}
            ${row('FINISH', data.finishTime)}
        </table>

        <p style="text-align: center; font-weight: bold; margin: 20px 0;">COURT DIARY REQUEST</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 650px;">
            ${row('COURT DATE', formatDate(data.courtDate))}
            ${row('SOLICITOR', data.solicitor)}
            ${row('CLIENT', data.clientName)}
            ${row('FILE NUMBER', data.fileNumber)}
            ${row('REASON', data.reason)}
            ${row('COURT', data.court)}
            ${row('COURT TIME', data.courtTime)}
            ${row('ALLOCATE TO', data.allocateTo)}
            ${row('CLIENT EXCUSED', data.clientExcused ? 'Yes' : 'No')}
            ${row('FEE REMINDER', data.feeReminder)}
            ${data.additionalDates ? row('ADDITIONAL DATES', data.additionalDates) : ''}
        </table>
    </div>`;
};

// Generate CDR
const generateCDR = () => {
    // Reinitialize checkbox handlers in case they were lost
    initializeCheckboxHandlers();
    
    // Get separate sendToAdmin and ccSolicitors
    const sendToAdmin = document.getElementById('cdrSendToAdmin')?.value || '';
    
    // Validate that admin is selected
    if (!sendToAdmin) {
        alert('Please select an Admin (CB or GB) in the "Send To" field');
        return;
    }
    
    const ccSolicitors = [];
    document.querySelectorAll('input[id^="allocate_"]:checked').forEach(cb => {
        ccSolicitors.push(cb.value);
    });
    
    const cdrData = {
        outcomeCourt: document.getElementById('cdrOutcomeCourt').value,
        outcomeDate: document.getElementById('cdrOutcomeDate').value,
        startTime: document.getElementById('cdrStartTime').value,
        finishTime: document.getElementById('cdrFinishTime').value,
        courtDate: document.getElementById('cdrCourtDate').value,
        solicitor: document.getElementById('cdrSolicitor').value,
        clientName: document.getElementById('cdrClientName').value,
        fileNumber: document.getElementById('cdrFileNumber').value,
        reason: document.getElementById('cdrReason').value,
        court: document.getElementById('cdrCourt').value,
        courtTime: document.getElementById('cdrCourtTime').value,
        allocateTo: getAllocatedTo(), // Combined for display
        sendToAdmin: sendToAdmin, // Separate field for email TO
        ccSolicitors: ccSolicitors.join(', '), // Separate field for email CC
        clientExcused: document.getElementById('cdrClientExcused').checked,
        feeReminder: document.getElementById('cdrFeeReminder').value,
        additionalDates: document.getElementById('cdrAdditionalDates')?.value || ''
    };

    currentCDRData = cdrData;
    const outputDiv = document.getElementById('cdrOutput');
    outputDiv.textContent = formatCDRText(cdrData);
    outputDiv.style.display = 'block';
};

// Send CDR to Zapier
const sendCDRToZapier = () => sendToZapier(true);

// Clear CDR Form
const clearCDRForm = () => {
    if (confirm('Clear all CDR fields?')) {
        const defaults = {
            cdrClientSelect: '',
            cdrOutcomeCourt: '',
            cdrOutcomeDate: '',
            cdrStartTime: '09:30',
            cdrFinishTime: '10:00',
            cdrCourtDate: '',
            cdrSolicitor: 'AAG',
            cdrClientName: '',
            cdrFileNumber: '',
            cdrReason: '',
            cdrCourt: '',
            cdrCourtTime: '09:30',
            cdrSendToAdmin: '', // Reset Send To dropdown
            cdrClientExcused: false,
            cdrFeeReminder: ''
        };

        Object.entries(defaults).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) {
                if (typeof value === 'boolean') el.checked = value;
                else el.value = value;
            }
        });

        // Clear CC to Solicitors checkboxes
        document.querySelectorAll('input[id^="allocate_"]').forEach(cb => cb.checked = false);
        document.getElementById('cdrOutput').style.display = 'none';
        currentCDRData = null;
    }
};
