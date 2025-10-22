// Excel Functions Module
// Handles Excel file import and export

// Load Excel File
const loadExcelFile = () => {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            clients = jsonData.map((row, index) => {
                const name = convertNameFormat(row['Client Name'] || '');
                return {
                    id: index + 1,
                    name: name,
                    displayName: getDisplayNameFormat(name),
                    address: row['Address'] || '',
                    matterNumber: row['Matter Reference'] || '',
                    court: row['Court'] || '',
                    matterType: row['Matter Type'] || '',
                    charges: row['Charges'] || '',
                    legalAid: row['Legal Aid'] === 'Yes',
                    contribution: row['Contribution'] || '',
                    status: row['Status'] || 'Active',
                    ccl: row['CCL Sent'] === 'Yes' || false,
                    mention: row['Mention Sent'] === 'Yes' || false,
                    final: row['Final Sent'] === 'Yes' || false,
                    nextCourt: row['Next Court Date'] || '',
                    taskPriority: row['Task Priority'] || null,
                    lastStatusUpdate: row['Last Status Update'] || null,
                    priorityNotes: row['Priority Notes'] || '',
                    letterHistory: []
                };
            });

            // Try to load CourtCalendar sheet if it exists
            if (workbook.SheetNames.includes('CourtCalendar')) {
                const calendarSheet = workbook.Sheets['CourtCalendar'];
                const calendarData = XLSX.utils.sheet_to_json(calendarSheet);
                courtCalendarData = calendarData.map(row => ({
                    date: row['Date'],
                    endTime: row['End_Time'],
                    clientName: convertNameFormat(row['Client_Name'] || ''),
                    matterType: row['Matter_Type'] || '',
                    matterNumber: row['Matter_Number'] || '',
                    court: row['Court'] || '',
                    durationHours: parseFloat(row['Duration_Hours']) || 0,
                    weekNumber: parseInt(row['Week_Number']) || 0,
                    dayName: row['Day_Name'] || ''
                }));

                // Set current week to the week of today
                const today = new Date();
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                const days = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000));
                currentWeekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
            }

            saveData();
            updateUI();
            updateDatabaseStatus(true);
            if (courtCalendarData.length > 0) {
                updateCourtCalendar();
            }
            alert(`Successfully loaded ${clients.length} clients${courtCalendarData.length > 0 ? ` and ${courtCalendarData.length} calendar entries` : ''} from Excel`);
        } catch (error) {
            alert('Error loading Excel file: ' + error.message);
            console.error('Excel loading error:', error);
        }
    };
    reader.readAsArrayBuffer(file);
};

// Export to Excel
const exportToExcel = () => {
    if (clients.length === 0) {
        alert('No data to export');
        return;
    }

    const exportData = clients.map(client => ({
        'Client Name': client.name,
        'Address': client.address,
        'Matter Reference': client.matterNumber,
        'Court': client.court,
        'Matter Type': client.matterType,
        'Charges': client.charges,
        'Legal Aid': client.legalAid ? 'Yes' : 'No',
        'Contribution': client.contribution || '',
        'Status': client.status,
        'CCL Sent': client.ccl ? 'Yes' : 'No',
        'Mention Sent': client.mention ? 'Yes' : 'No',
        'Final Sent': client.final ? 'Yes' : 'No',
        'Next Court Date': client.nextCourt,
        'Task Priority': client.taskPriority || '',
        'Last Status Update': client.lastStatusUpdate || '',
        'Priority Notes': client.priorityNotes || '',
        'Last Updated': new Date().toLocaleDateString('en-AU')
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, 'Clients');
    XLSX.writeFile(wb, `legal_clients_${new Date().toISOString().slice(0,10)}.xlsx`);
};
