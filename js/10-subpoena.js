const SubpoenaModule = (() => {
    let currentClientData = null;
    let currentSubpoenaData = null;
    
    const formatDateCache = new Map();
    const validationCache = new Map();

    const formatDate = (dateString) => {
    if (!dateString) return '';
    
    if (formatDateCache.has(dateString)) {
        return formatDateCache.get(dateString);
    }
    
    const formatted = new Date(dateString).toLocaleDateString('en-AU', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    
    formatDateCache.set(dateString, formatted);
    
    if (formatDateCache.size > 50) {
        const firstKey = formatDateCache.keys().next().value;
        formatDateCache.delete(firstKey);
    }
    
    return formatted;
    };

    const formatDateForSubpoena = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
    };

    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
    };

    const loadClientFromMain = () => {
        // Check URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const clientName = urlParams.get('clientName');
        const matterNumber = urlParams.get('matterNumber');
        const court = urlParams.get('court');

        if (clientName) {
            document.getElementById('clientName').value = clientName;
            currentClientData = { name: clientName, matterNumber, court };
            displayClientInfo();
        }

        // Check localStorage as fallback
        if (!clientName) {
            const storedClient = localStorage.getItem('selectedClient');
            if (storedClient) {
                currentClientData = JSON.parse(storedClient);
                document.getElementById('clientName').value = currentClientData.name || '';
                displayClientInfo();
            }
        }
    };

    const displayClientInfo = () => {
        const infoDiv = document.getElementById('clientInfo');
        if (currentClientData && currentClientData.name) {
            infoDiv.style.display = 'block';
            infoDiv.innerHTML = `
                <h3>Client Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Client Name</span>
                        <span class="info-value">${currentClientData.name}</span>
                    </div>
                    ${currentClientData.matterNumber ? `
                    <div class="info-item">
                        <span class="info-label">Matter Number</span>
                        <span class="info-value">${currentClientData.matterNumber}</span>
                    </div>` : ''}
                    ${currentClientData.court ? `
                    <div class="info-item">
                        <span class="info-label">Court</span>
                        <span class="info-value">${currentClientData.court}</span>
                    </div>` : ''}
                </div>
            `;
        }
    };

    // ===== DATE VALIDATION =====
    const validateSubpoenaDates = () => {
        const returnDate = document.getElementById('returnDate').value;
        const complianceDate = document.getElementById('complianceDate').value;
        const warningDiv = document.getElementById('dateWarning');

        if (!returnDate || !complianceDate) {
            warningDiv.style.display = 'none';
            return true;
        }
        
        // Check cache first
        const cacheKey = `${returnDate}_${complianceDate}_${new Date().toDateString()}`;
        if (validationCache.has(cacheKey)) {
            const cachedResult = validationCache.get(cacheKey);
            warningDiv.style.display = cachedResult.warnings.length > 0 ? 'block' : 'none';
            if (cachedResult.warnings.length > 0) {
                warningDiv.innerHTML = cachedResult.warnings.join('<br>');
            }
            return cachedResult.isValid;
        }

        const today = new Date();
        const returnDateObj = new Date(returnDate);
        const complianceDateObj = new Date(complianceDate);

        let warnings = [];

        // Check if dates are in the future
        if (returnDateObj <= today) {
            warnings.push('Return date must be in the future');
        }

        if (complianceDateObj <= today) {
            warnings.push('Compliance date must be in the future');
        }

        // Check if compliance date is before return date
        if (complianceDateObj > returnDateObj) {
            warnings.push('Compliance date must be before or on the return date');
        }

        // Check if less than 7 days notice
        const daysNotice = Math.ceil((complianceDateObj - today) / (1000 * 60 * 60 * 24));
        if (daysNotice < 7 && daysNotice > 0) {
            warnings.push(`Warning: Only ${daysNotice} days notice given (minimum 7 days recommended)`);
        }

        const isValid = warnings.length === 0 || (warnings.length === 1 && warnings[0].includes('Warning:'));
        
        // Cache the result
        validationCache.set(cacheKey, { warnings, isValid });
        
        // Limit cache size
        if (validationCache.size > 50) {
            const firstKey = validationCache.keys().next().value;
            validationCache.delete(firstKey);
        }

        if (warnings.length > 0) {
            warningDiv.style.display = 'block';
            warningDiv.innerHTML = warnings.join('<br>');
            return isValid;
        }

        warningDiv.style.display = 'none';
        return true;
    };

    // ===== SUBPOENA GENERATION =====
    const generateSubpoenaPrompt = () => {
        if (!validateSubpoenaDates()) {
            alert('Please correct the date issues before generating the subpoena');
            return;
        }

        const formData = {
            recipientName: document.getElementById('recipientName').value,
            recipientAddress: document.getElementById('recipientAddress').value,
            courtLevel: document.getElementById('courtLevel').value,
            courtLocation: document.getElementById('courtLocation').value,
            returnDate: document.getElementById('returnDate').value,
            complianceDate: document.getElementById('complianceDate').value,
            partyType: document.getElementById('partyType').value,
            clientName: document.getElementById('clientName').value,
            proceedingsNumber: document.getElementById('proceedingsNumber').value,
            issuedFor: document.querySelector('input[name="issuedFor"]:checked')?.value,
            documentsSought: document.getElementById('documentsSought').value,
            solicitor: document.getElementById('solicitor').value
        };

        // Validate required fields
        const requiredFields = ['recipientName', 'recipientAddress', 'courtLevel', 'courtLocation',
                               'returnDate', 'complianceDate', 'clientName', 'proceedingsNumber', 'issuedFor',
                               'documentsSought', 'solicitor'];

        for (const field of requiredFields) {
            if (!formData[field]) {
                alert(`Please fill in all required fields. Missing: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return;
            }
        }

        currentSubpoenaData = formData;

        const prompt = formatSubpoenaPrompt(formData);
        const outputDiv = document.getElementById('subpoenaOutput');
        outputDiv.textContent = prompt;
        outputDiv.style.display = 'block';

        // Enable action buttons
        document.getElementById('copyBtn').disabled = false;
        document.getElementById('zapierBtn').disabled = false;
    };

    const formatSubpoenaPrompt = (data) => {
        const solicitorNames = {
            'AAG': 'Alexander Georgieff',
            'RHH': 'Rylie Hahn-Hamilton',
            'BJB': 'Benjamin Brown',
            'SRS': 'Sophia Seton',
            'NKM': 'Natalie McDonald'
        };

        return `SUBPOENA GENERATION REQUEST

COURT DETAILS:
Court: ${data.courtLevel} of New South Wales at ${data.courtLocation}
Matter: ${data.partyType} ${data.clientName}
Proceedings Number: ${data.proceedingsNumber}
Issued on behalf of: ${data.issuedFor}

SUBPOENA TO:
${data.recipientName}
${data.recipientAddress}

DATES:
Return Date: ${formatDateForSubpoena(data.returnDate)}
Compliance Date: ${formatDateForSubpoena(data.complianceDate)}

DOCUMENTS REQUIRED FOR PRODUCTION:
${data.documentsSought}

SOLICITOR DETAILS:
${solicitorNames[data.solicitor] || data.solicitor}
49 Dumaresq Street
Campbelltown NSW 2560
Phone: 02 4626 5077

Please generate a formal subpoena document that:
1. Complies with NSW court rules and practice notes
2. Includes all statutory warnings and notices
3. Clearly specifies the documents to be produced
4. States the consequences of non-compliance
5. Includes proper service instructions
6. Formats appropriately for filing with the court

The subpoena should be ready for review and filing with the appropriate NSW court.`;
    };

    // ===== ZAPIER INTEGRATION =====
    const sendSubpoenaToZapier = () => {
        if (!currentSubpoenaData) {
            alert('Please generate a subpoena first');
            return;
        }

        const statusDiv = document.getElementById('zapierStatus');
        statusDiv.style.display = 'block';
        statusDiv.className = 'status-message status-sending';
        statusDiv.textContent = 'Sending to Zapier...';

        const payload = {
            type: 'SUBPOENA',
            subpoenaData: {
                ...currentSubpoenaData,
                formattedReturnDate: formatDateForSubpoena(currentSubpoenaData.returnDate),
                formattedComplianceDate: formatDateForSubpoena(currentSubpoenaData.complianceDate),
                prompt: formatSubpoenaPrompt(currentSubpoenaData),
                generatedDate: new Date().toISOString(),
                firmDetails: {
                    address: '49 Dumaresq Street, Campbelltown NSW 2560',
                    phone: '02 4626 5077'
                }
            }
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(payload));

        fetch('https://hooks.zapier.com/hooks/catch/19713185/u47xnci/', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                statusDiv.className = 'status-message status-success';
                statusDiv.textContent = '✓ Successfully sent to Zapier!';
                setTimeout(() => statusDiv.style.display = 'none', 3000);
            } else {
                throw new Error('Failed to send');
            }
        })
        .catch(error => {
            statusDiv.className = 'status-message status-error';
            statusDiv.textContent = '✗ Failed to send to Zapier. Please try again.';
            console.error('Zapier error:', error);
        });
    };

    // ===== CLIPBOARD FUNCTIONS =====
    const copyToClipboard = () => {
        const outputText = document.getElementById('subpoenaOutput').textContent;
        if (!outputText) {
            alert('Please generate a subpoena first');
            return;
        }

        navigator.clipboard.writeText(outputText).then(() => {
            const btn = document.getElementById('copyBtn');
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            btn.style.background = '#10b981';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }).catch(err => {
            alert('Failed to copy to clipboard');
            console.error('Copy error:', err);
        });
    };

    // ===== FORM HELPERS =====
    const clearForm = () => {
        if (confirm('Are you sure you want to clear all form data?')) {
            document.getElementById('subpoenaForm').reset();
            document.getElementById('subpoenaOutput').style.display = 'none';
            document.getElementById('dateWarning').style.display = 'none';
            document.getElementById('zapierStatus').style.display = 'none';
            document.getElementById('copyBtn').disabled = true;
            document.getElementById('zapierBtn').disabled = true;
            currentSubpoenaData = null;

            // Reset organization fields to manual entry state
            const recipientName = document.getElementById('recipientName');
            const recipientAddress = document.getElementById('recipientAddress');
            recipientName.readOnly = false;
            recipientAddress.readOnly = false;
            recipientName.style.backgroundColor = '';
            recipientAddress.style.backgroundColor = '';

            // Reload client data if available
            loadClientFromMain();
        }
    };

    const populateCommonCourts = () => {
        const courtLocation = document.getElementById('courtLocation');
        const courtLevel = document.getElementById('courtLevel').value;

        const commonCourts = {
            'Local Court': ['Campbelltown', 'Sydney Downing Centre', 'Parramatta', 'Liverpool', 'Penrith', 'Camden', 'Picton', 'Moss Vale'],
            'District Court': ['Sydney Downing Centre', 'Parramatta', 'Campbelltown', 'Penrith'],
            'Supreme Court': ['Sydney', 'Parramatta']
        };

        if (courtLevel && commonCourts[courtLevel]) {
            const datalist = document.getElementById('courtLocations');
            datalist.innerHTML = commonCourts[courtLevel].map(court =>
                `<option value="${court}">`
            ).join('');
        }
    };

    const handleOrganizationChange = () => {
        const organizationType = document.getElementById('organizationType').value;
        const recipientName = document.getElementById('recipientName');
        const recipientAddress = document.getElementById('recipientAddress');

        if (organizationType === 'NSW Police') {
            recipientName.value = 'Commissioner of NSW Police';
            recipientAddress.value = 'NSW Police Force, Infolink Unit\nLocked Bag 5102\nParramatta, NSW 2124';

            // Make fields read-only when NSW Police is selected
            recipientName.readOnly = true;
            recipientAddress.readOnly = true;

            // Add visual indication
            recipientName.style.backgroundColor = '#f9fafb';
            recipientAddress.style.backgroundColor = '#f9fafb';
        } else {
            // Clear fields and make them editable for manual entry
            recipientName.value = '';
            recipientAddress.value = '';
            recipientName.readOnly = false;
            recipientAddress.readOnly = false;

            // Remove visual indication
            recipientName.style.backgroundColor = '';
            recipientAddress.style.backgroundColor = '';
        }
    };

    const init = () => {
    loadClientFromMain();

    const today = getTodayDate();
    document.getElementById('returnDate').min = today;
    document.getElementById('complianceDate').min = today;

    document.getElementById('returnDate').value = addDays(today, 14);
    document.getElementById('complianceDate').value = addDays(today, 7);

    document.getElementById('returnDate').addEventListener('change', validateSubpoenaDates);
    document.getElementById('complianceDate').addEventListener('change', validateSubpoenaDates);
    document.getElementById('courtLevel').addEventListener('change', populateCommonCourts);
    };

    return {
    init,
    generateSubpoenaPrompt,
    sendSubpoenaToZapier,
    copyToClipboard,
    clearForm,
    handleOrganizationChange
    };
})();
