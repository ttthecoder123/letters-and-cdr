// UTILITIES MODULE
// Shared utility functions used across the application

// ===== DATE UTILITIES =====
const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-AU', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

// Convert "Surname, First Name Middle Name" to "First Name Middle Name Surname"
const convertNameFormat = (name) => {
    if (!name || typeof name !== 'string') return name || '';
    
    // Trim whitespace
    name = name.trim();
    
    // Check if name contains a comma (Excel format)
    if (name.includes(',')) {
        const parts = name.split(',');
        if (parts.length >= 2) {
            const surname = parts[0].trim();
            const firstAndMiddle = parts[1].trim();
            
            // Return in "First Middle Surname" format
            return `${firstAndMiddle} ${surname}`;
        }
    }
    
    // If no comma, assume it's already in correct format
    return name;
};

const getTemplateFileName = (type) => ({
    'CCL': 'CCL_Template.docx',
    'Mention': 'Mention_Template.docx',
    'Final': 'Final_Template.docx',
    'FeeReestimate': 'FeeReestimate_Template.docx'
}[type] || 'Template.docx');

// ===== MOBILE DETECTION =====
const isMobile = () => window.innerWidth <= 768;

// ===== VALIDATION UTILITIES =====
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

// ===== FORM UTILITIES =====
const clearFormFields = (formId) => {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
};

const setFormFieldValue = (fieldId, value) => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.value = value;
    }
};

const getFormFieldValue = (fieldId) => {
    const field = document.getElementById(fieldId);
    return field ? field.value : '';
};

// ===== STATUS MANAGEMENT =====
const showStatus = (elementId, message, type = 'info', timeout = 3000) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.style.display = 'block';
    element.className = `status-message status-${type}`;
    element.textContent = message;
    
    if (timeout > 0) {
        setTimeout(() => {
            element.style.display = 'none';
        }, timeout);
    }
};

const hideStatus = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
};

// ===== ELEMENT UTILITIES =====
const showElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
};

const hideElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
};

const toggleElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
};

// ===== LOCAL STORAGE UTILITIES =====
const saveToStorage = (key, data) => {
    try {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        }
    } catch(e) {
        console.log('Storage not available');
    }
    return false;
};

const loadFromStorage = (key) => {
    try {
        if (typeof(Storage) !== "undefined") {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : null;
        }
    } catch(e) {
        console.log('Storage not available');
    }
    return null;
};

// ===== CHECKBOX UTILITIES =====
const initializeCheckboxHandlers = () => {
    // Add click handlers to checkbox containers for better mobile support
    document.querySelectorAll('.checkbox-item').forEach(item => {
        // Remove any existing listeners
        item.removeEventListener('click', handleCheckboxClick);
        item.removeEventListener('touchend', handleCheckboxTouch);
        
        // Add new listeners
        item.addEventListener('click', handleCheckboxClick);
        item.addEventListener('touchend', handleCheckboxTouch);
        
        // Update visual state based on checkbox
        const checkbox = item.querySelector('input[type="checkbox"], input[type="radio"]');
        if (checkbox && checkbox.checked) {
            item.classList.add('checked');
        }
    });
};

const handleCheckboxClick = function(e) {
    // Prevent double triggering
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
};

const handleCheckboxTouch = function(e) {
    // Prevent click event from also firing
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
};

// ===== COPY TO CLIPBOARD UTILITY =====
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
    }
};

// ===== ERROR HANDLING =====
const handleError = (error, context = '') => {
    console.error(`Error ${context}:`, error);
    
    // Show user-friendly error message
    const message = error.message || 'An unexpected error occurred';
    alert(`Error: ${message}`);
};

// ===== EXPORT UTILITIES =====
// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        getTodayDate,
        convertNameFormat,
        getTemplateFileName,
        isMobile,
        isValidEmail,
        isValidDate,
        clearFormFields,
        setFormFieldValue,
        getFormFieldValue,
        showStatus,
        hideStatus,
        showElement,
        hideElement,
        toggleElement,
        saveToStorage,
        loadFromStorage,
        initializeCheckboxHandlers,
        copyToClipboard,
        handleError
    };
}