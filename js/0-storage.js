
let clients = [];
let cachedClientOptions = null;
let cachedClientsLength = 0;


/**
 * Save clients array to localStorage
 */
const saveData = () => {
    try {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(CONFIG.storage.clientsKey, JSON.stringify(clients));
            cachedClientOptions = null;
            clearCaches();
        }
    } catch(e) {
        console.error('Failed to save data to localStorage:', e);
    }
};

/**
 * Load clients array from localStorage
 * @returns {boolean} True if data was loaded successfully
 */
const loadSavedData = () => {
    try {
        if (typeof(Storage) !== "undefined") {
            const saved = localStorage.getItem(CONFIG.storage.clientsKey);
            if (saved) {
                clients = JSON.parse(saved);
                return true;
            }
        }
    } catch(e) {
        console.error('Failed to load data from localStorage:', e);
    }
    return false;
};

/**
 * Get all clients
 * @returns {Array} Array of client objects
 */
const getAllClients = () => {
    return clients;
};

/**
 * Get client by ID
 * @param {number} clientId - Client ID
 * @returns {Object|null} Client object or null if not found
 */
const getClient = (clientId) => {
    return clients.find(c => c.id === clientId) || null;
};

/**
 * Add new client
 * @param {Object} client - Client object
 * @returns {Object} Added client with ID
 */
const addClient = (client) => {
    const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    client.id = newId;
    
    clients.push(client);
    saveData();
    
    return client;
};

/**
 * Update existing client
 * @param {number} clientId - Client ID
 * @param {Object} updates - Object with fields to update
 * @returns {boolean} True if updated successfully
 */
const updateClient = (clientId, updates) => {
    const index = clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
        clients[index] = { ...clients[index], ...updates };
        saveData();
        return true;
    }
    return false;
};

/**
 * Delete client
 * @param {number} clientId - Client ID
 * @returns {boolean} True if deleted successfully
 */
const deleteClient = (clientId) => {
    const index = clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
        clients.splice(index, 1);
        saveData();
        return true;
    }
    return false;
};

/**
 * Replace all clients (used for Excel import)
 * @param {Array} newClients - Array of client objects
 */
const replaceAllClients = (newClients) => {
    clients = newClients;
    saveData();
};

/**
 * Store selected client for cross-page communication
 * @param {Object} client - Client object
 */
const storeSelectedClient = (client) => {
    try {
        localStorage.setItem(CONFIG.storage.selectedClientKey, JSON.stringify(client));
    } catch(e) {
        console.error('Failed to store selected client:', e);
    }
};

/**
 * Get stored selected client
 * @returns {Object|null} Client object or null
 */
const getStoredSelectedClient = () => {
    try {
        const stored = localStorage.getItem(CONFIG.storage.selectedClientKey);
        return stored ? JSON.parse(stored) : null;
    } catch(e) {
        console.error('Failed to get stored selected client:', e);
        return null;
    }
};

/**
 * Clear stored selected client
 */
const clearStoredSelectedClient = () => {
    try {
        localStorage.removeItem(CONFIG.storage.selectedClientKey);
    } catch(e) {
        console.error('Failed to clear stored selected client:', e);
    }
};
