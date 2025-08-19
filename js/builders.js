// UI BUILDER FUNCTIONS
// Eliminate ALL HTML repetition through dynamic generation

const UIBuilder = {
    // Generate any form field from configuration
    createFormField(config) {
        const { type, id, label, required, placeholder, options, value, min, max, step, rows, onchange, name } = config;
        const requiredStar = required ? '<span style="color: #dc2626;">*</span>' : '';
        const onchangeAttr = onchange ? `onchange="${onchange}"` : '';
        
        let fieldHTML = '';
        switch(type) {
            case 'select':
                const optionsList = typeof options === 'string' ? STATIC_DATA[options] : options;
                fieldHTML = `
                    <select id="${id}" ${required ? 'required' : ''} ${onchangeAttr}>
                        <option value="">-- Select --</option>
                        ${this.createOptions(optionsList, config.optionKey, config.labelKey)}
                    </select>`;
                break;
                
            case 'text':
            case 'date':
            case 'time':
            case 'number':
            case 'tel':
            case 'email':
                const defaultValue = this.getDefaultValue(type, value);
                fieldHTML = `<input type="${type}" id="${id}" 
                    ${placeholder ? `placeholder="${placeholder}"` : ''}
                    ${required ? 'required' : ''}
                    ${defaultValue ? `value="${defaultValue}"` : ''}
                    ${min !== undefined ? `min="${min}"` : ''}
                    ${max !== undefined ? `max="${max}"` : ''}
                    ${step ? `step="${step}"` : ''}
                    ${onchangeAttr}>`;
                break;
                
            case 'textarea':
                fieldHTML = `<textarea id="${id}" 
                    ${placeholder ? `placeholder="${placeholder}"` : ''}
                    ${required ? 'required' : ''}
                    ${rows ? `rows="${rows}"` : 'rows="3"'}
                    ${onchangeAttr}>${value || ''}</textarea>`;
                break;
                
            case 'checkbox':
                fieldHTML = `
                    <div class="checkbox-item">
                        <input type="checkbox" id="${id}" ${onchangeAttr}>
                        <label for="${id}">${label}</label>
                    </div>`;
                return fieldHTML; // Skip wrapper for checkbox
                
            case 'radio-group':
                return this.createRadioGroup(config);
                
            case 'checkbox-group':
                return this.createCheckboxGroup(config);
                
            case 'checkbox-conditional':
                return this.createConditionalCheckbox(config);
        }
        
        return `
            <div class="form-group">
                <label for="${id}">${label} ${requiredStar}</label>
                ${fieldHTML}
                ${config.helper ? `<span class="helper-text">${config.helper}</span>` : ''}
            </div>`;
    },
    
    // Get default values for fields
    getDefaultValue(type, configValue) {
        if (configValue) {
            if (configValue === 'today') {
                return new Date().toISOString().split('T')[0];
            } else if (configValue === 'now') {
                return new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
            }
            return configValue;
        }
        return '';
    },
    
    // Generate radio button groups
    createRadioGroup(config) {
        const { name, label, options, optionKey, labelKey, onchange, id } = config;
        const optionsList = typeof options === 'string' ? STATIC_DATA[options] : options;
        const onchangeAttr = onchange ? `onchange="${onchange}"` : '';
        
        let html = `
            <div class="form-group">
                <label>${label}</label>
                <div class="radio-group ${id ? `${id}` : ''}">`;
        
        optionsList.forEach(option => {
            const value = optionKey ? option[optionKey] : (option.value || option);
            const text = labelKey ? option[labelKey] : (option.label || option.text || value);
            const optionId = option.id || `${name}_${value.replace(/\s+/g, '_').toLowerCase()}`;
            
            html += `
                <div class="radio-item">
                    <input type="radio" id="${optionId}" name="${name}" value="${value}" ${onchangeAttr}>
                    <label for="${optionId}">${text}</label>
                </div>`;
        });
        
        html += `</div></div>`;
        return html;
    },
    
    // Generate checkbox groups without repetition
    createCheckboxGroup(config) {
        const { label, options, prefix, id, optionKey, displayFull } = config;
        const optionsList = typeof options === 'string' ? STATIC_DATA[options] : options;
        
        let html = `
            <div class="form-group">
                <label>${label}</label>
                <div class="checkbox-group ${id || ''}">`;
        
        optionsList.forEach(item => {
            const value = optionKey ? item[optionKey] : (item.value || item);
            const text = displayFull ? item.text : (item.name || item.text || value);
            const checkboxId = item.id || `${prefix}${value.replace(/\s+/g, '_').toLowerCase()}`;
            
            html += `
                <div class="checkbox-item" ${item.mandatory ? 'style="opacity: 0.6;"' : ''}>
                    <input type="checkbox" id="${checkboxId}" value="${value}" 
                           ${item.mandatory ? 'checked disabled' : ''}>
                    <label for="${checkboxId}">${text}</label>
                </div>`;
        });
        
        html += `</div></div>`;
        return html;
    },
    
    // Create conditional checkbox with hidden content
    createConditionalCheckbox(config) {
        const { id, label, onchange, conditionalId, conditionalType, conditionalOptions } = config;
        
        let html = `
            <div class="form-group">
                <div class="checkbox-item">
                    <input type="checkbox" id="${id}" ${onchange ? `onchange="${onchange}"` : ''}>
                    <label for="${id}">${label}</label>
                </div>
                <div id="${conditionalId}" style="display: none; margin-top: 15px;">`;
        
        if (conditionalType === 'checkbox-group') {
            const options = typeof conditionalOptions === 'string' ? STATIC_DATA[conditionalOptions] : conditionalOptions;
            html += this.createCheckboxGroup({
                label: '',
                options: options,
                prefix: `${conditionalId}_`
            }).replace(/<div class="form-group">.*?<label><\/label>/, '').replace(/<\/div>$/, '');
        }
        
        html += `</div></div>`;
        return html;
    },
    
    // Generate options for select elements
    createOptions(options, optionKey, labelKey) {
        if (!options || !Array.isArray(options)) return '';
        
        return options.map(opt => {
            if (typeof opt === 'object') {
                const value = optionKey ? opt[optionKey] : (opt.code || opt.value || opt);
                const label = labelKey ? opt[labelKey] : (opt.name || opt.text || opt.label || value);
                return `<option value="${value}">${label}</option>`;
            }
            return `<option value="${opt}">${opt}</option>`;
        }).join('');
    },
    
    // Generate entire sections from config
    createSection(sectionConfig) {
        let html = `<div class="section">`;
        html += `<div class="section-title">${sectionConfig.title}</div>`;
        
        if (sectionConfig.type === 'charges-selector') {
            html += this.createChargesSection(sectionConfig);
        } else if (sectionConfig.type === 'conditional-section') {
            html += this.createConditionalSection(sectionConfig);
        } else if (sectionConfig.fields) {
            sectionConfig.fields.forEach(field => {
                html += this.createFormField(field);
                if (field.conditional) {
                    html += this.createConditionalFields(field);
                }
            });
        }
        
        html += `</div>`;
        return html;
    },
    
    // Special builders for complex sections
    createChargesSection(config) {
        let html = '';
        
        // Include database charges if specified
        if (config.includeDatabase && window.currentClient && window.currentClient.charges) {
            html += `
                <div class="form-group" style="background: #f0f9ff; padding: 10px; border-radius: 6px; margin-bottom: 15px;">
                    <label style="font-weight: 600; color: #0284c7;">Charges from Database:</label>
                    <div style="padding: 8px; background: white; border-radius: 4px; margin-top: 5px;">
                        ${window.currentClient.charges}
                    </div>
                </div>`;
        }
        
        html += '<div class="charges-section">';
        Object.entries(STATIC_DATA.charges).forEach(([category, charges]) => {
            const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
            html += `
                <div class="charges-category">
                    <h4>${categoryTitle} Offences</h4>
                    ${this.createCheckboxGroup({
                        label: '',
                        options: charges.map(c => ({
                            id: `charge_${c.id}`,
                            value: c.value,
                            text: c.value
                        })),
                        prefix: 'charge_'
                    }).replace(/<div class="form-group">.*?<label><\/label>/, '').replace(/<\/div>$/, '')}
                </div>`;
        });
        html += '</div>';
        
        // Add additional fields if specified
        if (config.additionalFields) {
            config.additionalFields.forEach(field => {
                html += this.createFormField(field);
            });
        }
        
        return html;
    },
    
    // Create conditional sections
    createConditionalSection(config) {
        let html = this.createFormField(config.triggerField);
        
        if (config.conditionalContent) {
            Object.entries(config.conditionalContent).forEach(([triggerValue, contentType]) => {
                const contentId = `${config.triggerField.id}_${triggerValue.replace(/\s+/g, '_').toLowerCase()}`;
                html += `<div id="${contentId}" style="display: none; margin-top: 15px;">`;
                
                if (SPECIAL_SECTIONS[contentType]) {
                    SPECIAL_SECTIONS[contentType].fields.forEach(field => {
                        html += this.createFormField(field);
                    });
                }
                
                html += `</div>`;
            });
        }
        
        return html;
    },
    
    // Create conditional fields for form elements
    createConditionalFields(fieldConfig) {
        if (!fieldConfig.conditional) return '';
        
        let html = '';
        Object.entries(fieldConfig.conditional).forEach(([triggerValue, fields]) => {
            const conditionalId = `${fieldConfig.id}_${triggerValue.replace(/\s+/g, '_').toLowerCase()}`;
            html += `<div id="${conditionalId}" class="conditional" style="display: none; margin-top: 15px;">`;
            
            fields.forEach(conditionalField => {
                html += this.createFormField(conditionalField);
            });
            
            html += `</div>`;
        });
        
        return html;
    },
    
    // Build complete form from definition
    buildForm(formType, containerId) {
        const definition = FORM_DEFINITIONS[formType];
        if (!definition) return;
        
        const container = document.getElementById(containerId);
        if (!container) return;
        
        let html = '';
        definition.sections.forEach(section => {
            html += this.createSection(section);
        });
        
        container.innerHTML = html;
        
        // Initialize any dynamic behavior
        this.initializeFormBehavior(formType);
    },
    
    // Initialize form-specific behavior
    initializeFormBehavior(formType) {
        // Re-initialize checkbox handlers for mobile
        if (window.initializeCheckboxHandlers) {
            window.initializeCheckboxHandlers();
        }
        
        // Set default values
        const now = new Date();
        const todayDate = now.toISOString().split('T')[0];
        const currentTime = now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        // Set today's date where specified
        document.querySelectorAll('input[type="date"]').forEach(input => {
            if (!input.value && input.getAttribute('data-default') === 'today') {
                input.value = todayDate;
            }
        });
        
        // Set current time where specified
        document.querySelectorAll('input[type="time"]').forEach(input => {
            if (!input.value && input.getAttribute('data-default') === 'now') {
                input.value = currentTime;
            }
        });
    }
};

// Export for global use
window.UIBuilder = UIBuilder;