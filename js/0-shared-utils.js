
const formatDateCache = new Map();


/**
 * Format date string to Australian format with caching
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "22 October 2025")
 */
const formatDate = (dateString) => {
    if (!dateString) return '';
    
    if (formatDateCache.has(dateString)) {
        return formatDateCache.get(dateString);
    }
    
    const formatted = new Date(dateString).toLocaleDateString('en-AU', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    
    formatDateCache.set(dateString, formatted);
    
    if (formatDateCache.size > 100) {
        const firstKey = formatDateCache.keys().next().value;
        formatDateCache.delete(firstKey);
    }
    
    return formatted;
};

/**
 * Get today's date in ISO format
 * @returns {string} Today's date (YYYY-MM-DD)
 */
const getTodayDate = () => new Date().toISOString().split('T')[0];

/**
 * Add days to a date
 * @param {string} date - ISO date string
 * @param {number} days - Number of days to add
 * @returns {string} New date in ISO format
 */
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
};

/**
 * Format date for subpoena documents
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "22 October 2025")
 */
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


/**
 * Convert "Surname, First Name Middle Name" to "First Name Middle Name Surname"
 * @param {string} name - Name in Excel format
 * @returns {string} Name in display format
 */
const convertNameFormat = (name) => {
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
};

/**
 * Convert "First Name Middle Name Surname" back to "Surname, First Name Middle Name" for display
 * @param {string} name - Name in standard format
 * @returns {string} Name in display format
 */
const getDisplayNameFormat = (name) => {
    if (!name || typeof name !== 'string') return name || '';
    
    name = name.trim();
    
    if (name.includes(',')) {
        return name;
    }
    
    const parts = name.split(' ');
    if (parts.length >= 2) {
        const surname = parts[parts.length - 1];
        const firstAndMiddle = parts.slice(0, -1).join(' ');
        
        return `${surname}, ${firstAndMiddle}`;
    }
    
    return name;
};


/**
 * Get template file name by letter type
 * @param {string} type - Letter type (CCL, Mention, Final, FeeReestimate)
 * @returns {string} Template file name
 */
const getTemplateFileName = (type) => {
    return CONFIG.templates[type] || 'Template.docx';
};


/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid
 */
const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Validate phone number (Australian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
const isValidPhone = (phone) => {
    const re = /^(\+?61|0)[2-478]( ?\d){8}$/;
    return re.test(phone.replace(/\s/g, ''));
};


/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if successful
 */
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
    }
};


/**
 * Clear all caches
 */
const clearCaches = () => {
    formatDateCache.clear();
};
