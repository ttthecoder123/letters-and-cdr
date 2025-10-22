

/**
 * Format letter payload for Zapier
 * @param {string} letterType - Type of letter (CCL, Mention, Final, etc.)
 * @param {Object} clientData - Client information
 * @param {string} prompt - Generated prompt text
 * @param {boolean} includeCDR - Whether to include CDR
 * @param {Object} cdrData - CDR data if includeCDR is true
 * @returns {Object} Formatted payload
 */
const formatLetterPayload = (letterType, clientData, prompt, includeCDR = false, cdrData = null) => {
    const payload = {
        type: includeCDR ? 'LETTER_AND_CDR' : 'LETTER',
        letterType: letterType,
        clientName: clientData.name,
        matterNumber: clientData.matterNumber,
        prompt: prompt,
        templateFileName: getTemplateFileName(letterType),
        generatedDate: new Date().toISOString()
    };

    if (includeCDR && cdrData) {
        payload.cdr = cdrData;
    }

    return payload;
};

/**
 * Format CDR payload for Zapier
 * @param {Object} cdrData - CDR information
 * @returns {Object} Formatted payload
 */
const formatCDRPayload = (cdrData) => {
    return {
        type: 'CDR_ONLY',
        ...cdrData,
        generatedDate: new Date().toISOString()
    };
};

/**
 * Format file note payload for Zapier
 * @param {Object} fileNoteData - File note information
 * @returns {Object} Formatted payload
 */
const formatFileNotePayload = (fileNoteData) => {
    return {
        type: 'FILE_NOTE',
        ...fileNoteData,
        generatedDate: new Date().toISOString()
    };
};

/**
 * Format subpoena payload for Zapier
 * @param {Object} subpoenaData - Subpoena information
 * @returns {Object} Formatted payload
 */
const formatSubpoenaPayload = (subpoenaData) => {
    return {
        type: 'SUBPOENA',
        subpoenaData: {
            ...subpoenaData,
            formattedReturnDate: formatDateForSubpoena(subpoenaData.returnDate),
            formattedComplianceDate: formatDateForSubpoena(subpoenaData.complianceDate),
            generatedDate: new Date().toISOString(),
            firmDetails: {
                address: CONFIG.firm.fullAddress,
                phone: CONFIG.firm.phone
            }
        }
    };
};


/**
 * Upload clients to Supabase
 * @param {Array} clientsToUpload - Array of client objects
 * @returns {Promise<boolean>} True if successful
 */
const uploadToSupabase = async (clientsToUpload = null) => {
    const clientsData = clientsToUpload || getAllClients();
    
    if (clientsData.length === 0) {
        alert('No clients to upload');
        return false;
    }

    try {
        const clientsPayload = clientsData.map(client => ({
            id: client.id,
            firm_id: CONFIG.supabase.firmId,
            name: client.name,
            address: client.address || '',
            status: client.status || 'Active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));

        const mattersPayload = clientsData.map(client => ({
            client_id: client.id,
            firm_id: CONFIG.supabase.firmId,
            matter_number: client.matterNumber || '',
            court: client.court || '',
            matter_type: client.matterType || '',
            charges: client.charges || '',
            legal_aid: client.legalAid || false,
            next_court_date: client.nextCourt || null,
            ccl_sent: client.ccl || false,
            mention_sent: client.mention || false,
            final_sent: client.final || false,
            task_priority: client.taskPriority || null,
            last_status_update: client.lastStatusUpdate || null,
            priority_notes: client.priorityNotes || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));

        const clientsResponse = await fetch(`${CONFIG.supabase.url}/rest/v1/clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': 'your-supabase-anon-key',
                'Authorization': `Bearer your-supabase-anon-key`,
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(clientsPayload)
        });

        if (!clientsResponse.ok) {
            throw new Error('Failed to upload clients');
        }

        const mattersResponse = await fetch(`${CONFIG.supabase.url}/rest/v1/matters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': 'your-supabase-anon-key',
                'Authorization': `Bearer your-supabase-anon-key`,
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(mattersPayload)
        });

        if (!mattersResponse.ok) {
            throw new Error('Failed to upload matters');
        }

        console.log('Successfully uploaded to Supabase');
        return true;

    } catch (error) {
        console.error('Supabase upload error:', error);
        alert('Failed to upload to Supabase: ' + error.message);
        return false;
    }
};


/**
 * Show status message to user
 * @param {string} message - Message to display
 * @param {string} type - Message type (success, error, info)
 */
const showStatusMessage = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    if (type === 'error') {
        alert(message);
    }
};
