// CLIENT DATABASE MODULE
// Handles client data management, Excel import/export, and UI updates

// ===== GLOBAL CLIENT DATA =====
let clients = [];

// ===== DATA PERSISTENCE =====
const saveData = () => {
    try {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem('legalClients', JSON.stringify(clients));
        }
    } catch(e) {
        console.log('Storage not available');
    }
};

const loadSavedData = () => {
    try {
        if (typeof(Storage) !== "undefined") {
            const saved = localStorage.getItem('legalClients');
            if (saved) {
                clients = JSON.parse(saved);
                updateDatabaseStatus(true);
            }
        }
    } catch(e) {
        console.log('Storage not available');
    }
};

// ===== UI UPDATE FUNCTIONS =====
const updateDatabaseStatus = (connected) => {
    const status = document.getElementById('databaseStatus');
    if (status) {
        status.textContent = connected ?
            `Database: Connected (${clients.length} clients)` :
            'Database: Not Connected';
        status.className = `database-status status-${connected ? 'connected' : 'disconnected'}`;
    }
};

const updateUI = () => {
    loadClientTable();
    loadClientSelect();
    loadCDRClientSelect();
    loadFileNoteClientSelect();
    updateAnalytics();
};

const loadClientTable = () => {
    const tbody = document.getElementById('clientTableBody');
    const cardsContainer = document.getElementById('clientCardsContainer');

    if (!tbody && !cardsContainer) return;

    // Desktop table view
    if (tbody) {
        tbody.innerHTML = clients.length === 0 ?
            `<tr><td colspan="10" style="text-align: center; padding: 40px; color: #6b7280;">
                No clients loaded. Please upload an Excel database or add clients manually.
            </td></tr>` :
            clients.map(client => `
                <tr>
                    <td><strong>${client.name}</strong></td>
                    <td>${client.matterNumber}</td>
                    <td>${client.court}</td>
                    <td>${client.charges}</td>
                    <td><span class="status-badge status-${client.status.toLowerCase()}">${client.status}</span></td>
                    <td>${client.ccl ? '✅' : '❌'}</td>
                    <td>${client.mention ? '✅' : '❌'}</td>
                    <td>${client.final ? '✅' : '❌'}</td>
                    <td>${client.nextCourt ? formatDate(client.nextCourt) : 'TBD'}</td>
                    <td>
                        <button class="btn btn-primary" style="padding: 4px 8px; font-size: 11px; margin-right: 4px;"
                            onclick="selectClientForLetter(${client.id})">Letter</button>
                        <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;"
                            onclick="selectClientForSubpoena(${client.id})">Subpoena</button>
                    </td>
                </tr>
            `).join('');
    }

    // Mobile cards view
    if (cardsContainer) {
        if (clients.length === 0) {
            cardsContainer.innerHTML = `<div style="text-align: center; padding: 40px; color: #6b7280;">
                No clients loaded. Please upload an Excel database or add clients manually.
            </div>`;
        } else {
            cardsContainer.innerHTML =
            clients.map(client => `
                <div class="client-card" onclick="toggleClientCard(this)">
                    <div class="client-card-header">
                        <div class="client-card-main">
                            <div class="client-card-name">${client.name}</div>
                            <div class="client-card-matter">${client.matterNumber}</div>
                            <div class="client-card-status-row">
                                <span class="status-badge status-${client.status.toLowerCase()}">${client.status}</span>
                            </div>
                        </div>
                        <div class="client-card-expand">▼</div>
                    </div>
                    <div class="client-card-details">
                        <div class="client-card-row">
                            <span class="client-card-label">Court</span>
                            <span class="client-card-value">${client.court || 'Not specified'}</span>
                        </div>
                        <div class="client-card-charges">
                            <strong>Charges:</strong> ${client.charges || 'No charges listed'}
                        </div>
                        <div class="client-card-letters">
                            <strong>Letter Status:</strong>
                            <div class="client-card-letter-status">
                                <span>CCL ${client.ccl ? '✅' : '❌'}</span>
                                <span>Mention ${client.mention ? '✅' : '❌'}</span>
                                <span>Final ${client.final ? '✅' : '❌'}</span>
                            </div>
                        </div>
                        <div class="client-card-row">
                            <span class="client-card-label">Next Court</span>
                            <span class="client-card-value">${client.nextCourt ? formatDate(client.nextCourt) : 'TBD'}</span>
                        </div>
                        <div class="client-card-actions">
                            <button class="client-card-btn" onclick="event.stopPropagation(); selectClientForLetter(${client.id})" 
                                    style="margin-bottom: 8px;">
                                Generate Letter
                            </button>
                            <button class="client-card-btn" onclick="event.stopPropagation(); selectClientForSubpoena(${client.id})"
                                    style="background: #6b7280;">
                                Generate Subpoena
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
};

const loadClientSelect = () => {
    const select = document.getElementById('clientSelect');
    if (!select) return;
    select.innerHTML = '<option value="">-- Select a Client --</option>' +
        clients.map(c => `<option value="${c.id}">${c.name} (${c.matterNumber})</option>`).join('');
};

const loadCDRClientSelect = () => {
    const select = document.getElementById('cdrClientSelect');
    if (!select) return;
    select.innerHTML = '<option value="">-- Manual Entry --</option>' +
        clients.map(c => `<option value="${c.id}">${c.name} (${c.matterNumber})</option>`).join('');
};

const loadFileNoteClientSelect = () => {
    const select = document.getElementById('fileNoteClientSelect');
    if (!select) return;
    select.innerHTML = '<option value="">-- Select a Client --</option>' +
        clients.map(c => `<option value="${c.id}">${c.name} (${c.matterNumber})</option>`).join('');
};

const updateAnalytics = () => {
    const els = {
        totalMatters: document.getElementById('totalMatters'),
        activeMatters: document.getElementById('activeMatters'),
        pendingLetters: document.getElementById('pendingLetters'),
        upcomingCourt: document.getElementById('upcomingCourt')
    };

    if (els.totalMatters) els.totalMatters.textContent = clients.length;
    if (els.activeMatters) els.activeMatters.textContent = clients.filter(c => c.status === 'Active').length;
    if (els.pendingLetters) els.pendingLetters.textContent = clients.filter(c => !c.ccl).length;

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcoming = clients.filter(c => {
        if (!c.nextCourt) return false;
        const courtDate = new Date(c.nextCourt);
        return courtDate <= nextWeek && courtDate >= new Date();
    }).length;
    if (els.upcomingCourt) els.upcomingCourt.textContent = upcoming;

    // Court breakdown
    const courtBreakdown = {};
    clients.forEach(c => courtBreakdown[c.court] = (courtBreakdown[c.court] || 0) + 1);

    const courtDiv = document.getElementById('courtBreakdown');
    if (courtDiv) {
        courtDiv.innerHTML = Object.entries(courtBreakdown)
            .sort((a, b) => b[1] - a[1])
            .map(([court, count]) => `
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <span>${court}</span><strong>${count}</strong>
                </div>
            `).join('') || '<p style="color: #6b7280;">No data available</p>';
    }

    // Letter status
    const statusDiv = document.getElementById('letterStatusChart');
    if (statusDiv) {
        const stats = {
            ccl: clients.filter(c => c.ccl).length,
            mention: clients.filter(c => c.mention).length,
            final: clients.filter(c => c.final).length
        };

        statusDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                <div style="text-align: center;">
                    <div style="font-size: 2em; font-weight: bold; color: #3b82f6;">${stats.ccl}</div>
                    <div>CCL Sent</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2em; font-weight: bold; color: #16a34a;">${stats.mention}</div>
                    <div>Mention Letters</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2em; font-weight: bold; color: #dc2626;">${stats.final}</div>
                    <div>Final Letters</div>
                </div>
            </div>`;
    }
};

// ===== CLIENT MANAGEMENT =====
const addClient = (event) => {
    event.preventDefault();

    const newClient = {
        id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
        name: convertNameFormat(document.getElementById('newClientName').value),
        address: document.getElementById('newClientAddress').value,
        matterNumber: document.getElementById('newMatterNumber').value,
        court: document.getElementById('newCourt').value,
        matterType: document.getElementById('newMatterType').value,
        charges: document.getElementById('newCharges').value,
        legalAid: document.getElementById('newLegalAid').value === 'Yes',
        nextCourt: document.getElementById('newNextCourt').value,
        status: 'Active',
        ccl: false,
        mention: false,
        final: false,
        letterHistory: []
    };

    clients.push(newClient);
    saveData();
    updateUI();
    closeModal();
    alert('Client added successfully!');
};

// ===== EXCEL FUNCTIONS =====
const loadExcelFile = () => {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            clients = jsonData.map((row, index) => ({
                id: index + 1,
                name: convertNameFormat(row['Client Name'] || ''),
                address: row['Address'] || '',
                matterNumber: row['Matter Reference'] || '',
                court: row['Court'] || '',
                matterType: row['Matter Type'] || '',
                charges: row['Charges'] || '',
                legalAid: row['Legal Aid'] === 'Yes',
                contribution: row['Contribution'] || '',
                status: row['Status'] || 'Active',
                ccl: row['CCL Sent'] === 'Yes' || false,
                mention: row['Mention Sent'] === 'Yes' || false,
                final: row['Final Sent'] === 'Yes' || false,
                nextCourt: row['Next Court Date'] || '',
                letterHistory: []
            }));

            // Try to load CourtCalendar sheet if it exists
            if (workbook.SheetNames.includes('CourtCalendar')) {
                const calendarSheet = workbook.Sheets['CourtCalendar'];
                const calendarData = XLSX.utils.sheet_to_json(calendarSheet);
                courtCalendarData = calendarData.map(row => ({
                    date: row['Date'],
                    endTime: row['End_Time'],
                    clientName: convertNameFormat(row['Client_Name'] || ''),
                    matterType: row['Matter_Type'] || '',
                    matterNumber: row['Matter_Number'] || '',
                    court: row['Court'] || '',
                    durationHours: parseFloat(row['Duration_Hours']) || 0,
                    weekNumber: parseInt(row['Week_Number']) || 0,
                    dayName: row['Day_Name'] || ''
                }));

                // Set current week to the week of today
                const today = new Date();
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                const days = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000));
                currentWeekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
            }

            saveData();
            updateUI();
            updateDatabaseStatus(true);
            alert(`Excel file loaded successfully!\n${clients.length} clients imported.`);

        } catch (error) {
            console.error('Error reading Excel file:', error);
            alert('Error reading Excel file. Please check the format and try again.');
        }
    };

    reader.readAsArrayBuffer(file);
};

// ===== EXPORT FUNCTIONS =====
// Make functions globally available
window.clients = clients;
window.saveData = saveData;
window.loadSavedData = loadSavedData;
window.updateUI = updateUI;
window.loadClientSelect = loadClientSelect;
window.loadCDRClientSelect = loadCDRClientSelect;
window.loadFileNoteClientSelect = loadFileNoteClientSelect;
window.updateAnalytics = updateAnalytics;
window.addClient = addClient;
window.loadExcelFile = loadExcelFile;