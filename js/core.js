// CORE APPLICATION FUNCTIONS
// Consolidate app.js + utils.js into unified core

// ===== GLOBAL STATE =====
let currentModule = 'master';
let currentClient = null;
let courtCalendarData = [];
let currentWeekNumber = null;
const moduleCache = {};

// ===== UTILITY FUNCTIONS =====
const CoreUtils = {
    // Date utilities
    formatDate: (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-AU', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    },

    getTodayDate: () => new Date().toISOString().split('T')[0],

    // Name conversion utility
    convertNameFormat: (name) => {
        if (!name || typeof name !== 'string') return name || '';
        
        name = name.trim();
        if (name.includes(',')) {
            const parts = name.split(',');
            if (parts.length >= 2) {
                const surname = parts[0].trim();
                const firstAndMiddle = parts[1].trim();
                return `${firstAndMiddle} ${surname}`;
            }
        }
        return name;
    },

    // Template filename utility
    getTemplateFileName: (type) => {
        const templates = STATIC_DATA.templates[type];
        return templates ? templates[0] : 'Template.docx';
    },

    // Mobile detection
    isMobile: () => window.innerWidth <= 768,

    // Validation utilities
    isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    isValidDate: (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    },

    // Form utilities
    clearFormFields: (formId) => {
        const form = document.getElementById(formId);
        if (form) form.reset();
    },

    setFormFieldValue: (fieldId, value) => {
        const field = document.getElementById(fieldId);
        if (field) field.value = value;
    },

    getFormFieldValue: (fieldId) => {
        const field = document.getElementById(fieldId);
        return field ? field.value : '';
    },

    // Element utilities
    showElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) element.style.display = 'block';
    },

    hideElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) element.style.display = 'none';
    },

    toggleElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    },

    // Status management
    showStatus: (elementId, message, type = 'info', timeout = 3000) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.style.display = 'block';
        element.className = `status-message status-${type}`;
        element.textContent = message;
        
        if (timeout > 0) {
            setTimeout(() => element.style.display = 'none', timeout);
        }
    },

    // Local storage utilities
    saveToStorage: (key, data) => {
        try {
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            }
        } catch(e) {
            console.log('Storage not available');
        }
        return false;
    },

    loadFromStorage: (key) => {
        try {
            if (typeof(Storage) !== "undefined") {
                const saved = localStorage.getItem(key);
                return saved ? JSON.parse(saved) : null;
            }
        } catch(e) {
            console.log('Storage not available');
        }
        return null;
    },

    // Copy to clipboard
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            return false;
        }
    },

    // Error handling
    handleError: (error, context = '') => {
        console.error(`Error ${context}:`, error);
        const message = error.message || 'An unexpected error occurred';
        alert(`Error: ${message}`);
    }
};

// ===== MODULE LOADING SYSTEM =====
const ModuleLoader = {
    async loadModule(moduleName) {
        if (currentModule === moduleName && moduleName !== 'master') {
            return;
        }
        
        if (moduleName === 'master') {
            document.getElementById('master').style.display = 'block';
            document.getElementById('moduleContainer').style.display = 'none';
            currentModule = 'master';
            return;
        }
        
        document.getElementById('master').style.display = 'none';
        document.getElementById('moduleContainer').style.display = 'block';
        
        const container = document.getElementById('moduleContainer');
        
        try {
            let htmlContent;
            
            if (moduleCache[moduleName]) {
                htmlContent = moduleCache[moduleName];
            } else {
                const response = await fetch(`modules/${moduleName}.html`);
                htmlContent = await response.text();
                moduleCache[moduleName] = htmlContent;
            }
            
            container.innerHTML = htmlContent;
            currentModule = moduleName;
            
            // Initialize module-specific functionality
            this.initializeModule(moduleName);
            
        } catch (error) {
            console.error('Error loading module:', error);
            container.innerHTML = '<p style="color: red;">Error loading module. Please refresh.</p>';
        }
    },

    initializeModule(moduleName) {
        // Re-initialize checkbox handlers for mobile
        if (window.initializeCheckboxHandlers) {
            window.initializeCheckboxHandlers();
        }

        switch(moduleName) {
            case 'letters':
                if (window.loadClientSelect) window.loadClientSelect();
                if (window.pendingClientId) {
                    document.getElementById('clientSelect').value = window.pendingClientId;
                    if (window.loadClientInfo) window.loadClientInfo();
                    window.pendingClientId = null;
                }
                break;
                
            case 'cdr':
                if (window.loadCDRClientSelect) window.loadCDRClientSelect();
                break;
                
            case 'analytics':
                if (window.updateAnalytics) window.updateAnalytics();
                break;
                
            case 'file-note':
                if (window.loadFileNoteClientSelect) window.loadFileNoteClientSelect();
                if (window.toggleFileNoteType) window.toggleFileNoteType();
                break;
                
            case 'subpoena':
                if (window.initializeSubpoenaModule) window.initializeSubpoenaModule();
                if (window.pendingSubpoenaClient) {
                    setTimeout(() => {
                        const clientNameField = document.getElementById('clientName');
                        if (clientNameField) {
                            clientNameField.value = window.pendingSubpoenaClient.name;
                        }
                        window.pendingSubpoenaClient = null;
                    }, 100);
                }
                break;
        }
    }
};

// ===== NAVIGATION FUNCTIONS =====
const Navigation = {
    switchTab(tabName, event) {
        // Update tab styling
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        if (event?.target) event.target.classList.add('active');
        
        // Map tab names to modules
        const moduleMap = {
            'master': 'master',
            'generator': 'letters',
            'cdr': 'cdr',
            'analytics': 'analytics',
            'filenote': 'file-note',
            'calendar': 'calendar'
        };
        
        const moduleName = moduleMap[tabName] || tabName;
        
        if (moduleName === 'calendar') {
            // Calendar stays in main for now
            document.getElementById('master').style.display = 'none';
            document.getElementById('moduleContainer').style.display = 'none';
            document.getElementById('calendar').classList.add('active');
            if (window.updateCourtCalendar) window.updateCourtCalendar();
        } else {
            document.getElementById('calendar').classList.remove('active');
            ModuleLoader.loadModule(moduleName);
        }
    },

    switchTabMobile(tabName, event) {
        this.closeMobileMenu();
        this.switchTab(tabName, event);
    },

    // Mobile menu functions
    toggleMobileMenu() {
        const menu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        const isActive = menu.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu();
        } else {
            menu.classList.add('active');
            overlay.classList.add('active');
            toggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeMobileMenu() {
        const menu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        menu.classList.remove('active');
        overlay.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// ===== CLIENT INTEGRATION FUNCTIONS =====
const ClientIntegration = {
    selectClientForLetter(clientId) {
        window.pendingClientId = clientId;
        document.querySelector('.tab:nth-child(2)')?.click();
    },

    openSubpoenaSystem(clientId = null) {
        if (clientId && window.clients) {
            const client = window.clients.find(c => c.id === clientId);
            if (client) {
                window.pendingSubpoenaClient = client;
                CoreUtils.saveToStorage('selectedClient', client);
            }
        }
        
        // Update tab styling and load subpoena module
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        
        const subpoenaTab = Array.from(document.querySelectorAll('.tab')).find(tab => 
            tab.textContent.includes('Subpoena')
        );
        if (subpoenaTab) {
            subpoenaTab.classList.add('active');
        }
        
        ModuleLoader.loadModule('subpoena');
    },

    openSubpoenaSystemMobile() {
        Navigation.closeMobileMenu();
        this.openSubpoenaSystem();
    },

    selectClientForSubpoena(clientId) {
        this.openSubpoenaSystem(clientId);
    },

    // Client card functions
    toggleClientCard(card) {
        card.classList.toggle('expanded');
    }
};

// ===== MODAL FUNCTIONS =====
const ModalManager = {
    openModal() {
        document.getElementById('addClientModal').style.display = 'block';
    },

    closeModal() {
        document.getElementById('addClientModal').style.display = 'none';
        document.getElementById('addClientForm').reset();
    }
};

// ===== CHECKBOX HANDLERS =====
const CheckboxHandlers = {
    initializeCheckboxHandlers() {
        document.querySelectorAll('.checkbox-item').forEach(item => {
            // Remove any existing listeners
            item.removeEventListener('click', this.handleCheckboxClick);
            item.removeEventListener('touchend', this.handleCheckboxTouch);
            
            // Add new listeners
            item.addEventListener('click', this.handleCheckboxClick.bind(this));
            item.addEventListener('touchend', this.handleCheckboxTouch.bind(this));
            
            // Update visual state based on checkbox
            const checkbox = item.querySelector('input[type="checkbox"], input[type="radio"]');
            if (checkbox && checkbox.checked) {
                item.classList.add('checked');
            }
        });
    },

    handleCheckboxClick(e) {
        if (e.detail > 1) return;
        
        const checkbox = this.querySelector('input[type="checkbox"], input[type="radio"]');
        if (!checkbox || e.target === checkbox) return;
        
        e.preventDefault();
        checkbox.checked = !checkbox.checked;
        
        // Update visual state
        if (checkbox.checked) {
            this.classList.add('checked');
        } else {
            this.classList.remove('checked');
        }
        
        // Trigger change event
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    },

    handleCheckboxTouch(e) {
        e.preventDefault();
        
        const checkbox = this.querySelector('input[type="checkbox"], input[type="radio"]');
        if (!checkbox) return;
        
        checkbox.checked = !checkbox.checked;
        
        // Update visual state
        if (checkbox.checked) {
            this.classList.add('checked');
        } else {
            this.classList.remove('checked');
        }
        
        // Trigger change event
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize data if client database is loaded
    if (window.loadSavedData) window.loadSavedData();
    if (window.updateUI) window.updateUI();
    
    // Initialize checkbox handlers
    CheckboxHandlers.initializeCheckboxHandlers();
    
    // Initialize current week for calendar
    if (currentWeekNumber === null && window.goToCurrentWeek) {
        window.goToCurrentWeek();
    }
    
    // Set up event handlers
    window.onclick = (event) => {
        const modal = document.getElementById('addClientModal');
        if (event.target === modal) ModalManager.closeModal();
    };
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        const menu = document.querySelector('.mobile-menu');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (menu && toggle && menu.classList.contains('active')) {
            if (!menu.contains(event.target) && !toggle.contains(event.target)) {
                Navigation.closeMobileMenu();
            }
        }
    });
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    CoreUtils.handleError(event.error, 'in application');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    CoreUtils.handleError(event.reason, 'in promise');
});

// ===== EXPORT FOR GLOBAL ACCESS =====
// Make all functions globally available
Object.assign(window, {
    // Core utilities
    ...CoreUtils,
    
    // Module and navigation
    loadModule: ModuleLoader.loadModule.bind(ModuleLoader),
    switchTab: Navigation.switchTab.bind(Navigation),
    switchTabMobile: Navigation.switchTabMobile.bind(Navigation),
    toggleMobileMenu: Navigation.toggleMobileMenu.bind(Navigation),
    closeMobileMenu: Navigation.closeMobileMenu.bind(Navigation),
    
    // Client integration
    selectClientForLetter: ClientIntegration.selectClientForLetter,
    openSubpoenaSystem: ClientIntegration.openSubpoenaSystem,
    openSubpoenaSystemMobile: ClientIntegration.openSubpoenaSystemMobile,
    selectClientForSubpoena: ClientIntegration.selectClientForSubpoena,
    toggleClientCard: ClientIntegration.toggleClientCard,
    
    // Modal management
    openModal: ModalManager.openModal,
    closeModal: ModalManager.closeModal,
    
    // Checkbox handling
    initializeCheckboxHandlers: CheckboxHandlers.initializeCheckboxHandlers.bind(CheckboxHandlers),
    
    // Global state
    currentModule,
    currentClient,
    courtCalendarData,
    currentWeekNumber
});