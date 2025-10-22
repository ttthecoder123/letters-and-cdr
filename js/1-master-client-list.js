
const updateDatabaseStatus = (connected) => {
    const status = document.getElementById('databaseStatus');
    if (status) {
        status.textContent = connected ?
            `Database: Connected (${clients.length} clients)` :
            'Database: Not Connected';
        status.className = `database-status status-${connected ? 'connected' : 'disconnected'}`;
    }
};

const updateUI = (components = ['all']) => {
    if (components.includes('all') || components.includes('table')) {
        loadClientTable();
    }
    if (components.includes('all') || components.includes('selects')) {
        loadClientSelect();
        loadCDRClientSelect();
        loadFileNoteClientSelect();
    }
    if (components.includes('all') || components.includes('analytics')) {
        updateAnalytics();
    }
};

const loadClientTable = () => {
    const tbody = document.getElementById('clientTableBody');
    const cardsContainer = document.getElementById('clientCardsContainer');

    if (!tbody && !cardsContainer) return;

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

const generateClientOptions = () => {
    if (cachedClientOptions && cachedClientsLength === clients.length) {
        return cachedClientOptions;
    }
    
    cachedClientOptions = clients.map(c => {
        const displayName = c.displayName || getDisplayNameFormat(c.name);
        return `<option value="${c.id}">${displayName} (${c.matterNumber})</option>`;
    }).join('');
    cachedClientsLength = clients.length;
    
    return cachedClientOptions;
};

const loadClientSelect = () => {
    const select = document.getElementById('clientSelect');
    if (!select) return;
    select.innerHTML = '<option value="">-- Select a Client --</option>' +
        '<option value="new">-- New Client (Not in Database) --</option>' +
        generateClientOptions();
};

const loadCDRClientSelect = () => {
    const select = document.getElementById('cdrClientSelect');
    if (!select) return;
    select.innerHTML = '<option value="">-- Manual Entry --</option>' +
        generateClientOptions();
};

const loadFileNoteClientSelect = () => {
    const select = document.getElementById('fileNoteClientSelect');
    if (!select) return;
    select.innerHTML = '<option value="">-- Select a Client --</option>' +
        generateClientOptions();
};

const openModal = () => document.getElementById('addClientModal').style.display = 'block';
const closeModal = () => {
    document.getElementById('addClientModal').style.display = 'none';
    document.getElementById('addClientForm').reset();
};

const addClient = (event) => {
    event.preventDefault();

    const name = convertNameFormat(document.getElementById('newClientName').value);
    const newClient = {
        id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
        name: name,
        displayName: getDisplayNameFormat(name),
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
        taskPriority: null,
        lastStatusUpdate: null,
        priorityNotes: '',
        letterHistory: []
    };

    clients.push(newClient);
    saveData();
    updateUI();
    closeModal();
    alert('Client added successfully!');
};

const selectClientForLetter = (clientId) => {
    document.querySelector('.tab:nth-child(2)')?.click();
    document.getElementById('clientSelect').value = clientId;
    loadClientInfo();
};

const selectClientForSubpoena = (clientId) => {
    openSubpoenaSystem(clientId);
};

const toggleClientCard = (card) => {
    card.classList.toggle('expanded');
};
