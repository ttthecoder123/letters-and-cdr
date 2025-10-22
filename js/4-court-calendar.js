// Court Calendar Module
// Handles court calendar display and navigation

// Update Court Calendar
const updateCourtCalendar = () => {
    if (!courtCalendarData || courtCalendarData.length === 0) {
        document.getElementById('calendarWeekView').innerHTML = 
            '<p style="text-align: center; padding: 40px; color: #6b7280;">No court calendar data loaded. Please upload an Excel file with a CourtCalendar sheet.</p>';
        return;
    }

    // Filter data for current week
    const weekData = courtCalendarData.filter(entry => entry.weekNumber === currentWeekNumber);
    
    // Update week display
    document.getElementById('currentWeekDisplay').textContent = `Week ${currentWeekNumber}`;
    
    // Group by day
    const dayGroups = {
        'Monday': [],
        'Tuesday': [],
        'Wednesday': [],
        'Thursday': [],
        'Friday': []
    };
    
    weekData.forEach(entry => {
        if (dayGroups[entry.dayName]) {
            dayGroups[entry.dayName].push(entry);
        }
    });
    
    // Calculate daily totals
    const dayTotals = {};
    Object.keys(dayGroups).forEach(day => {
        dayTotals[day] = dayGroups[day].reduce((sum, entry) => sum + entry.durationHours, 0);
    });
    
    // Render week view
    const weekView = document.getElementById('calendarWeekView');
    weekView.innerHTML = `
        <div class="week-header">
            ${Object.keys(dayGroups).map(day => `
                <div class="day-header-cell">${day}</div>
            `).join('')}
        </div>
        <div class="week-grid-container">
            ${Object.entries(dayGroups).map(([day, entries]) => {
                const total = dayTotals[day];
                const loadClass = total > 6 ? 'high-load' : total > 4 ? 'medium-load' : 'low-load';
                
                return `
                    <div class="day-card ${loadClass}">
                        <div class="day-header">
                            <strong>${day}</strong>
                            <span class="day-count">${entries.length} matters</span>
                        </div>
                        <div class="day-stats">
                            <div class="stat-row">
                                <span>Total Hours:</span>
                                <strong>${total.toFixed(1)}h</strong>
                            </div>
                        </div>
                        ${entries.length > 0 ? `
                            <div class="day-details">
                                <div class="matters-list">
                                    ${entries.map(entry => `
                                        <div class="matter-item">
                                            <div class="matter-time">${entry.date ? new Date(entry.date).toLocaleTimeString('en-AU', {hour: '2-digit', minute: '2-digit'}) : 'TBD'}</div>
                                            <div class="matter-info">
                                                <div class="matter-client">${entry.clientName}</div>
                                                <div class="matter-details">${entry.court} - ${entry.matterType}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : '<p style="color: #6b7280; padding: 10px;">No matters scheduled</p>'}
                    </div>
                `;
            }).join('')}
        </div>
        <div class="week-summary">
            <h4>Week ${currentWeekNumber} Summary</h4>
            <div class="summary-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Matters:</span>
                    <span class="stat-value">${weekData.length}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Hours:</span>
                    <span class="stat-value">${Object.values(dayTotals).reduce((a, b) => a + b, 0).toFixed(1)}h</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Busiest Day:</span>
                    <span class="stat-value">${Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}</span>
                </div>
            </div>
        </div>
    `;
};

// Navigate Week
const navigateWeek = (direction) => {
    if (direction === 'prev') {
        currentWeekNumber = Math.max(1, currentWeekNumber - 1);
    } else if (direction === 'next') {
        currentWeekNumber = Math.min(52, currentWeekNumber + 1);
    } else if (direction === 'current') {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const days = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000));
        currentWeekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    }
    
    updateCourtCalendar();
};
