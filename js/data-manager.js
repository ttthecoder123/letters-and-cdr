// CLIENT DATA MANAGEMENT
// Consolidate ALL client data operations to eliminate repetition

const DataManager = {
    // Client data operations
    loadClientSelects() {
        if (!window.clients || !Array.isArray(window.clients)) return;
        
        // Update all client select elements
        const clientSelects = [
            'clientSelect',
            'cdrClientSelect', 
            'fileNoteClientSelect',
            'subpoenaClientSelect'
        ];
        
        clientSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                this.populateClientSelect(select);
            }
        });
    },
    
    // Populate a specific client select element
    populateClientSelect(selectElement) {
        if (!selectElement || !window.clients) return;
        
        // Clear existing options except the first one
        while (selectElement.children.length > 1) {
            selectElement.removeChild(selectElement.lastChild);
        }
        
        // Add client options
        window.clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            selectElement.appendChild(option);
        });
    },
    
    // Client CRUD operations
    addClient(clientData) {
        if (!window.clients) window.clients = [];
        
        // Generate ID
        const newId = this.generateClientId();
        const client = {
            id: newId,
            ...clientData,
            dateAdded: CoreUtils.getTodayDate()
        };
        
        window.clients.push(client);
        this.saveClients();
        this.updateUI();
        
        return client;
    },
    
    updateClient(clientId, updatedData) {
        if (!window.clients) return false;
        
        const clientIndex = window.clients.findIndex(c => c.id === clientId);
        if (clientIndex === -1) return false;
        
        window.clients[clientIndex] = {
            ...window.clients[clientIndex],
            ...updatedData,
            lastModified: CoreUtils.getTodayDate()
        };
        
        this.saveClients();
        this.updateUI();
        return true;
    },
    
    deleteClient(clientId) {
        if (!window.clients) return false;
        
        const initialLength = window.clients.length;
        window.clients = window.clients.filter(c => c.id !== clientId);
        
        if (window.clients.length < initialLength) {
            this.saveClients();
            this.updateUI();
            return true;
        }
        return false;
    },
    
    getClient(clientId) {
        if (!window.clients) return null;
        return window.clients.find(c => c.id === clientId) || null;
    },
    
    // Generate unique client ID
    generateClientId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `client_${timestamp}_${random}`;
    },
    
    // Save clients to localStorage
    saveClients() {
        return CoreUtils.saveToStorage('clients', window.clients || []);
    },
    
    // Load clients from localStorage
    loadClients() {
        const savedClients = CoreUtils.loadFromStorage('clients');
        window.clients = savedClients || [];
        return window.clients;
    },
    
    // Court calendar data operations
    loadCourtCalendar() {
        const savedCalendar = CoreUtils.loadFromStorage('courtCalendar');
        window.courtCalendarData = savedCalendar || [];
        return window.courtCalendarData;
    },
    
    saveCourtCalendar() {
        return CoreUtils.saveToStorage('courtCalendar', window.courtCalendarData || []);
    },
    
    addCourtEntry(entryData) {
        if (!window.courtCalendarData) window.courtCalendarData = [];
        
        const entry = {
            id: this.generateEntryId(),
            ...entryData,
            dateAdded: CoreUtils.getTodayDate()
        };
        
        window.courtCalendarData.push(entry);
        this.saveCourtCalendar();
        
        return entry;
    },
    
    updateCourtEntry(entryId, updatedData) {
        if (!window.courtCalendarData) return false;
        
        const entryIndex = window.courtCalendarData.findIndex(e => e.id === entryId);
        if (entryIndex === -1) return false;
        
        window.courtCalendarData[entryIndex] = {
            ...window.courtCalendarData[entryIndex],
            ...updatedData,
            lastModified: CoreUtils.getTodayDate()
        };
        
        this.saveCourtCalendar();
        return true;
    },
    
    deleteCourtEntry(entryId) {
        if (!window.courtCalendarData) return false;
        
        const initialLength = window.courtCalendarData.length;
        window.courtCalendarData = window.courtCalendarData.filter(e => e.id !== entryId);
        
        if (window.courtCalendarData.length < initialLength) {
            this.saveCourtCalendar();
            return true;
        }
        return false;
    },
    
    generateEntryId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `entry_${timestamp}_${random}`;
    },
    
    // Excel import/export functionality
    async importFromExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    
                    // Process and validate data
                    const processedClients = this.processImportedData(jsonData);
                    
                    // Add to existing clients
                    if (!window.clients) window.clients = [];
                    window.clients.push(...processedClients);
                    
                    this.saveClients();
                    this.updateUI();
                    
                    resolve(processedClients.length);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    },
    
    processImportedData(jsonData) {
        return jsonData.map(row => {
            // Map Excel columns to client structure
            const client = {
                id: this.generateClientId(),
                name: row['Name'] || row['Client Name'] || '',
                phone: row['Phone'] || row['Phone Number'] || '',
                email: row['Email'] || row['Email Address'] || '',
                address: row['Address'] || '',
                matterNumber: row['Matter Number'] || row['Matter'] || '',
                matterType: row['Matter Type'] || row['Type'] || '',
                charges: row['Charges'] || '',
                dateAdded: CoreUtils.getTodayDate()
            };
            
            // Remove empty properties
            Object.keys(client).forEach(key => {
                if (!client[key] && key !== 'id' && key !== 'dateAdded') {
                    delete client[key];
                }
            });
            
            return client;
        }).filter(client => client.name); // Only include clients with names
    },
    
    exportToExcel() {
        if (!window.clients || window.clients.length === 0) {
            alert('No client data to export');
            return;
        }
        
        // Prepare data for export
        const exportData = window.clients.map(client => ({
            'Name': client.name || '',
            'Phone': client.phone || '',
            'Email': client.email || '',
            'Address': client.address || '',
            'Matter Number': client.matterNumber || '',
            'Matter Type': client.matterType || '',
            'Charges': client.charges || '',
            'Date Added': client.dateAdded || ''
        }));
        
        // Create workbook
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');
        
        // Generate filename
        const today = CoreUtils.getTodayDate();
        const filename = `clients_export_${today.replace(/-/g, '')}.xlsx`;
        
        // Download file
        XLSX.writeFile(workbook, filename);
    },
    
    // Search and filter functionality
    searchClients(query) {
        if (!window.clients || !query) return window.clients || [];
        
        const lowercaseQuery = query.toLowerCase();
        
        return window.clients.filter(client => {
            return (
                (client.name && client.name.toLowerCase().includes(lowercaseQuery)) ||
                (client.phone && client.phone.includes(query)) ||
                (client.email && client.email.toLowerCase().includes(lowercaseQuery)) ||
                (client.matterNumber && client.matterNumber.toLowerCase().includes(lowercaseQuery)) ||
                (client.charges && client.charges.toLowerCase().includes(lowercaseQuery))
            );
        });
    },
    
    filterClientsByMatterType(matterType) {
        if (!window.clients) return [];
        if (!matterType) return window.clients;
        
        return window.clients.filter(client => 
            client.matterType && client.matterType.toLowerCase() === matterType.toLowerCase()
        );
    },
    
    // UI update functions
    updateUI() {
        this.loadClientSelects();
        this.updateClientCount();
        this.refreshClientDisplay();
    },
    
    updateClientCount() {
        const countElement = document.getElementById('clientCount');
        if (countElement && window.clients) {
            countElement.textContent = window.clients.length;
        }
    },
    
    refreshClientDisplay() {
        // Update client list display
        const clientList = document.getElementById('clientList');
        if (clientList && window.clients) {
            this.renderClientList(clientList);
        }
        
        // Update any other client displays
        this.updateRecentClients();
    },
    
    renderClientList(container) {
        if (!container || !window.clients) return;
        
        if (window.clients.length === 0) {
            container.innerHTML = '<p>No clients found. Add a client to get started.</p>';
            return;
        }
        
        const clientCards = window.clients.map(client => `
            <div class="client-card" onclick="toggleClientCard(this)">
                <div class="client-header">
                    <h3>${client.name}</h3>
                    <span class="matter-number">${client.matterNumber || 'No matter number'}</span>
                </div>
                <div class="client-details" style="display: none;">
                    ${client.phone ? `<p><strong>Phone:</strong> ${client.phone}</p>` : ''}
                    ${client.email ? `<p><strong>Email:</strong> ${client.email}</p>` : ''}
                    ${client.address ? `<p><strong>Address:</strong> ${client.address}</p>` : ''}
                    ${client.matterType ? `<p><strong>Matter Type:</strong> ${client.matterType}</p>` : ''}
                    ${client.charges ? `<p><strong>Charges:</strong> ${client.charges}</p>` : ''}
                    <div class="client-actions">
                        <button onclick="event.stopPropagation(); selectClientForLetter('${client.id}')">Generate Letter</button>
                        <button onclick="event.stopPropagation(); selectClientForSubpoena('${client.id}')">Subpoena</button>
                        <button onclick="event.stopPropagation(); editClient('${client.id}')">Edit</button>
                        <button onclick="event.stopPropagation(); deleteClientConfirm('${client.id}')" class="delete-btn">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = clientCards;
    },
    
    updateRecentClients() {
        const recentContainer = document.getElementById('recentClients');
        if (!recentContainer || !window.clients) return;
        
        // Get 5 most recent clients
        const recentClients = window.clients
            .sort((a, b) => new Date(b.dateAdded || '1970-01-01') - new Date(a.dateAdded || '1970-01-01'))
            .slice(0, 5);
        
        if (recentClients.length === 0) {
            recentContainer.innerHTML = '<p>No recent clients</p>';
            return;
        }
        
        const recentList = recentClients.map(client => `
            <div class="recent-client">
                <span class="client-name">${client.name}</span>
                <span class="matter-number">${client.matterNumber || ''}</span>
                <button onclick="selectClientForLetter('${client.id}')">Select</button>
            </div>
        `).join('');
        
        recentContainer.innerHTML = recentList;
    },
    
    // Analytics data
    getAnalyticsData() {
        if (!window.clients) return {};
        
        const totalClients = window.clients.length;
        
        // Matter type breakdown
        const matterTypes = {};
        window.clients.forEach(client => {
            const type = client.matterType || 'Unspecified';
            matterTypes[type] = (matterTypes[type] || 0) + 1;
        });
        
        // Clients by month
        const clientsByMonth = {};
        window.clients.forEach(client => {
            const date = new Date(client.dateAdded || '1970-01-01');
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            clientsByMonth[monthKey] = (clientsByMonth[monthKey] || 0) + 1;
        });
        
        return {
            totalClients,
            matterTypes,
            clientsByMonth,
            recentGrowth: this.calculateGrowthRate()
        };
    },
    
    calculateGrowthRate() {
        if (!window.clients || window.clients.length < 2) return 0;
        
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const lastMonthCount = window.clients.filter(client => {
            const clientDate = new Date(client.dateAdded || '1970-01-01');
            return clientDate >= lastMonth && clientDate < thisMonth;
        }).length;
        
        const thisMonthCount = window.clients.filter(client => {
            const clientDate = new Date(client.dateAdded || '1970-01-01');
            return clientDate >= thisMonth;
        }).length;
        
        if (lastMonthCount === 0) return thisMonthCount > 0 ? 100 : 0;
        return Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);
    },
    
    // Initialize data
    initialize() {
        this.loadClients();
        this.loadCourtCalendar();
        this.updateUI();
    }
};

// Form handling functions
const FormHandler = {
    // Handle client form submission
    handleClientForm(formData) {
        try {
            const client = DataManager.addClient(formData);
            CoreUtils.showStatus('clientStatus', 'Client added successfully', 'success');
            return client;
        } catch (error) {
            CoreUtils.handleError(error, 'adding client');
            return null;
        }
    },
    
    // Validate client form
    validateClientForm(formData) {
        const errors = [];
        
        if (!formData.name || formData.name.trim() === '') {
            errors.push('Client name is required');
        }
        
        if (formData.email && !CoreUtils.isValidEmail(formData.email)) {
            errors.push('Invalid email address');
        }
        
        if (formData.phone && formData.phone.length < 10) {
            errors.push('Phone number must be at least 10 digits');
        }
        
        return errors;
    }
};

// Initialize data manager
document.addEventListener('DOMContentLoaded', () => {
    DataManager.initialize();
});

// Make functions globally available
Object.assign(window, {
    // Client operations
    addClient: DataManager.addClient.bind(DataManager),
    updateClient: DataManager.updateClient.bind(DataManager),
    deleteClient: DataManager.deleteClient.bind(DataManager),
    getClient: DataManager.getClient.bind(DataManager),
    searchClients: DataManager.searchClients.bind(DataManager),
    
    // Data operations
    loadSavedData: DataManager.loadClients.bind(DataManager),
    saveData: DataManager.saveClients.bind(DataManager),
    
    // Select loading
    loadClientSelect: DataManager.loadClientSelects.bind(DataManager),
    loadCDRClientSelect: DataManager.loadClientSelects.bind(DataManager),
    loadFileNoteClientSelect: DataManager.loadClientSelects.bind(DataManager),
    
    // UI updates
    updateUI: DataManager.updateUI.bind(DataManager),
    updateAnalytics: DataManager.getAnalyticsData.bind(DataManager),
    
    // Excel operations
    importFromExcel: DataManager.importFromExcel.bind(DataManager),
    exportToExcel: DataManager.exportToExcel.bind(DataManager)
});

// Export for module use
window.DataManager = DataManager;
window.FormHandler = FormHandler;
