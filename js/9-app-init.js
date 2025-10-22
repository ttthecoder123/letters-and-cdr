
let currentClient = null;
let currentCDRData = null;
let courtCalendarData = [];
let currentWeekNumber = null;
let allocateCheckboxes = null;


const updateNewClientData = (field, value) => {
    if (currentClient && currentClient.isNew) {
        currentClient[field] = value;
    }
};


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

const generateClientOptions = () => {
    return clients.map(c => {
        const displayName = c.displayName || getDisplayNameFormat(c.name);
        return `<option value="${c.id}">${displayName} (${c.matterNumber})</option>`;
    }).join('');
};

const switchTab = (tabName, event) => {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

    const tabElement = document.getElementById(tabName);
    if (tabElement) tabElement.classList.add('active');
    if (event?.target) event.target.classList.add('active');

    if (tabName === 'analytics') updateAnalytics();
    if (tabName === 'calendar') updateCourtCalendar();
    if (tabName === 'subpoena') SubpoenaModule.init();
};

const openModal = () => document.getElementById('addClientModal').style.display = 'block';
const closeModal = () => {
    document.getElementById('addClientModal').style.display = 'none';
    document.getElementById('addClientForm').reset();
};

const addClientFromForm = (event) => {
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

const openSubpoenaSystem = (clientId = null) => {
    let url = 'subpoena.html';

    if (clientId) {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            const params = new URLSearchParams({
                clientName: client.name,
                matterNumber: client.matterNumber || '',
                court: client.court || ''
            });
            url += '?' + params.toString();

            localStorage.setItem('selectedClient', JSON.stringify(client));
        }
    }

    window.open(url, '_blank');
};

const openSubpoenaSystemMobile = () => {
    closeMobileMenu();
    openSubpoenaSystem();
};

const selectClientForSubpoena = (clientId) => {
    openSubpoenaSystem(clientId);
};

const openTaskPrioritySystem = () => {
    window.open('task-priority.html', '_blank');
};

const openTaskPrioritySystemMobile = () => {
    closeMobileMenu();
    openTaskPrioritySystem();
};

const toggleMobileMenu = () => {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const menu = document.querySelector('.mobile-menu');

    if (toggle) toggle.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    if (menu) menu.classList.toggle('active');

    if (menu && menu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
};

const closeMobileMenu = () => {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const menu = document.querySelector('.mobile-menu');

    if (toggle) toggle.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (menu) menu.classList.remove('active');
    document.body.style.overflow = '';
};

const switchTabMobile = (tabName, event) => {
    document.querySelectorAll('.mobile-menu-tab').forEach(t => t.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    switchTab(tabName, null);

    closeMobileMenu();
};

const toggleClientCard = (cardElement) => {
    cardElement.classList.toggle('expanded');
};

document.addEventListener('DOMContentLoaded', () => {
    const loaded = loadSavedData();
    updateDatabaseStatus(loaded);
    updateUI();
    initializeCheckboxHandlers();
});

const initializeCheckboxHandlers = () => {
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.removeEventListener('click', handleCheckboxClick);
        item.removeEventListener('touchend', handleCheckboxTouch);

        item.addEventListener('click', handleCheckboxClick);
        item.addEventListener('touchend', handleCheckboxTouch);

        const checkbox = item.querySelector('input[type="checkbox"], input[type="radio"]');
        if (checkbox && checkbox.checked) {
            item.classList.add('checked');
        }
    });
};

const handleCheckboxClick = function(e) {
    if (e.detail > 1) return;

    const checkbox = this.querySelector('input[type="checkbox"], input[type="radio"]');
    if (!checkbox || e.target === checkbox) return;

    e.preventDefault();
    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
        this.classList.add('checked');
    } else {
        this.classList.remove('checked');
    }

    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
};

const handleCheckboxTouch = function(e) {
    e.preventDefault();

    const checkbox = this.querySelector('input[type="checkbox"], input[type="radio"]');
    if (!checkbox) return;

    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
        this.classList.add('checked');
    } else {
        this.classList.remove('checked');
    }

    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
};

window.onclick = (event) => {
    const modal = document.getElementById('addClientModal');
    if (event.target === modal) closeModal();
};

document.addEventListener('click', (event) => {
    const menu = document.querySelector('.mobile-menu');
    const toggle = document.querySelector('.mobile-menu-toggle');

    if (menu && menu.classList.contains('active') &&
        !menu.contains(event.target) &&
        !toggle.contains(event.target)) {
        closeMobileMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});
