// Analytics Module
// Handles analytics dashboard and statistics

// Update Analytics Dashboard
const updateAnalytics = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const now = new Date();
    
    // Single pass through clients array to calculate all statistics
    const stats = clients.reduce((acc, client) => {
        // Count active matters
        if (client.status === 'Active') acc.activeMatters++;
        
        // Count pending letters
        if (!client.ccl) acc.pendingLetters++;
        
        // Count upcoming court dates
        if (client.nextCourt) {
            const courtDate = new Date(client.nextCourt);
            if (courtDate <= nextWeek && courtDate >= now) {
                acc.upcomingCourt++;
            }
        }
        
        // Court breakdown
        if (client.court) {
            acc.courtBreakdown[client.court] = (acc.courtBreakdown[client.court] || 0) + 1;
        }
        
        // Letter status
        if (client.ccl) acc.letterStats.ccl++;
        if (client.mention) acc.letterStats.mention++;
        if (client.final) acc.letterStats.final++;
        
        return acc;
    }, {
        activeMatters: 0,
        pendingLetters: 0,
        upcomingCourt: 0,
        courtBreakdown: {},
        letterStats: { ccl: 0, mention: 0, final: 0 }
    });
    
    // Update DOM elements
    const els = {
        totalMatters: document.getElementById('totalMatters'),
        activeMatters: document.getElementById('activeMatters'),
        pendingLetters: document.getElementById('pendingLetters'),
        upcomingCourt: document.getElementById('upcomingCourt')
    };

    if (els.totalMatters) els.totalMatters.textContent = clients.length;
    if (els.activeMatters) els.activeMatters.textContent = stats.activeMatters;
    if (els.pendingLetters) els.pendingLetters.textContent = stats.pendingLetters;
    if (els.upcomingCourt) els.upcomingCourt.textContent = stats.upcomingCourt;

    // Court breakdown
    const courtDiv = document.getElementById('courtBreakdown');
    if (courtDiv) {
        courtDiv.innerHTML = Object.entries(stats.courtBreakdown)
            .sort((a, b) => b[1] - a[1])
            .map(([court, count]) => `
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <span>${court}</span><strong>${count}</strong>
                </div>
            `).join('') || '<p style="color: #6b7280;">No data available</p>';
    }

    // Letter status
    const statusDiv = document.getElementById('letterStatusChart');
    if (statusDiv) {
        statusDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                <div style="text-align: center;">
                    <div style="font-size: 2em; font-weight: bold; color: #3b82f6;">${stats.letterStats.ccl}</div>
                    <div>CCL Sent</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2em; font-weight: bold; color: #16a34a;">${stats.letterStats.mention}</div>
                    <div>Mention Letters</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2em; font-weight: bold; color: #dc2626;">${stats.letterStats.final}</div>
                    <div>Final Letters</div>
                </div>
            </div>`;
    }
};
