// MAIN APPLICATION CONTROLLER
// Handles module loading, navigation, and global state

// ===== GLOBAL STATE =====
let currentModule = 'master';
let currentClient = null;
let currentCDRData = null;
let courtCalendarData = [];
let currentWeekNumber = null;
const moduleCache = {};

// ===== MODULE LOADING SYSTEM =====
async function loadModule(moduleName) {
    // Don't reload if already showing
    if (currentModule === moduleName && moduleName !== 'master') {
        return;
    }
    
    // Show master list directly (it stays in index.html)
    if (moduleName === 'master') {
        document.getElementById('master').style.display = 'block';
        document.getElementById('moduleContainer').style.display = 'none';
        currentModule = 'master';
        return;
    }
    
    // Hide master, show module container
    document.getElementById('master').style.display = 'none';
    document.getElementById('moduleContainer').style.display = 'block';
    
    const container = document.getElementById('moduleContainer');
    
    try {
        let htmlContent;
        
        // Use cache if available
        if (moduleCache[moduleName]) {
            htmlContent = moduleCache[moduleName];
        } else {
            const response = await fetch(`modules/${moduleName}.html`);
            htmlContent = await response.text();
            moduleCache[moduleName] = htmlContent;
        }
        
        container.innerHTML = htmlContent;
        currentModule = moduleName;
        
        // Re-initialize module-specific functions
        switch(moduleName) {
            case 'letters':
                loadClientSelect();
                if (window.pendingClientId) {
                    document.getElementById('clientSelect').value = window.pendingClientId;
                    loadClientInfo();
                    window.pendingClientId = null;
                }
                break;
            case 'cdr':
                loadCDRClientSelect();
                initializeCheckboxHandlers();
                break;
            case 'analytics':
                updateAnalytics();
                break;
            case 'file-note':
                loadFileNoteClientSelect();
                toggleFileNoteType();
                break;
            case 'subpoena':
                initializeSubpoenaModule();
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
        
        // Re-initialize checkbox handlers for mobile
        initializeCheckboxHandlers();
        
    } catch (error) {
        console.error('Error loading module:', error);
        container.innerHTML = '<p style="color: red;">Error loading module. Please refresh.</p>';
    }
}

// ===== NAVIGATION FUNCTIONS =====
function switchTab(tabName, event) {
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
        updateCourtCalendar();
    } else {
        document.getElementById('calendar').classList.remove('active');
        loadModule(moduleName);
    }
}

function switchTabMobile(tabName, event) {
    closeMobileMenu();
    switchTab(tabName, event);
}

// ===== CLIENT INTEGRATION FUNCTIONS =====
function selectClientForLetter(clientId) {
    window.pendingClientId = clientId;
    document.querySelector('.tab:nth-child(2)')?.click();
}

function openSubpoenaSystem(clientId = null) {
    if (clientId) {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            window.pendingSubpoenaClient = client;
            localStorage.setItem('selectedClient', JSON.stringify(client));
        }
    }
    
    // Update tab styling and load subpoena module
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    
    // Find and activate the subpoena tab (if exists) or just load module
    const subpoenaTab = Array.from(document.querySelectorAll('.tab')).find(tab => 
        tab.textContent.includes('Subpoena')
    );
    if (subpoenaTab) {
        subpoenaTab.classList.add('active');
    }
    
    loadModule('subpoena');
}

function openSubpoenaSystemMobile() {
    closeMobileMenu();
    openSubpoenaSystem();
}

function selectClientForSubpoena(clientId) {
    openSubpoenaSystem(clientId);
}

// ===== MOBILE MENU FUNCTIONS =====
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    const isActive = menu.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        menu.classList.add('active');
        overlay.classList.add('active');
        toggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    menu.classList.remove('active');
    overlay.classList.remove('active');
    toggle.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== CLIENT CARD FUNCTIONS =====
function toggleClientCard(card) {
    card.classList.toggle('expanded');
}

// ===== MODAL FUNCTIONS =====
function openModal() {
    document.getElementById('addClientModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addClientModal').style.display = 'none';
    document.getElementById('addClientForm').reset();
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    updateUI();
    initializeCheckboxHandlers();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        const menu = document.querySelector('.mobile-menu');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (menu && toggle && menu.classList.contains('active')) {
            if (!menu.contains(event.target) && !toggle.contains(event.target)) {
                closeMobileMenu();
            }
        }
    });
    
    // Handle modal clicks
    window.onclick = (event) => {
        const modal = document.getElementById('addClientModal');
        if (event.target === modal) closeModal();
    };
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    handleError(event.error, 'in application');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    handleError(event.reason, 'in promise');
});

// ===== EXPORT FOR GLOBAL ACCESS =====
// Make functions globally available
window.loadModule = loadModule;
window.switchTab = switchTab;
window.switchTabMobile = switchTabMobile;
window.selectClientForLetter = selectClientForLetter;
window.openSubpoenaSystem = openSubpoenaSystem;
window.openSubpoenaSystemMobile = openSubpoenaSystemMobile;
window.selectClientForSubpoena = selectClientForSubpoena;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleClientCard = toggleClientCard;
window.openModal = openModal;
window.closeModal = closeModal;
