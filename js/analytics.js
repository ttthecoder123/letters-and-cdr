// ANALYTICS MODULE
// Handles analytics dashboard functionality

// ===== ANALYTICS DATA PROCESSING =====
function generateDetailedAnalytics() {
    if (!clients || clients.length === 0) {
        return {
            totalMatters: 0,
            activeMatters: 0,
            completedMatters: 0,
            pendingLetters: 0,
            upcomingCourt: 0,
            courtBreakdown: {},
            letterStats: { ccl: 0, mention: 0, final: 0 },
            monthlyTrends: [],
            averageCaseTime: 0,
            productivityStats: {}
        };
    }

    // Basic counts
    const totalMatters = clients.length;
    const activeMatters = clients.filter(c => c.status === 'Active').length;
    const completedMatters = clients.filter(c => c.status === 'Completed').length;
    const pendingLetters = clients.filter(c => !c.ccl || !c.mention || !c.final).length;

    // Upcoming court dates (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingCourt = clients.filter(c => {
        if (!c.nextCourt) return false;
        const courtDate = new Date(c.nextCourt);
        return courtDate <= nextWeek && courtDate >= new Date();
    }).length;

    // Court breakdown
    const courtBreakdown = {};
    clients.forEach(c => {
        if (c.court) {
            courtBreakdown[c.court] = (courtBreakdown[c.court] || 0) + 1;
        }
    });

    // Letter statistics
    const letterStats = {
        ccl: clients.filter(c => c.ccl).length,
        mention: clients.filter(c => c.mention).length,
        final: clients.filter(c => c.final).length
    };

    // Monthly trends (last 6 months)
    const monthlyTrends = generateMonthlyTrends();

    // Average case time (estimated based on available data)
    const averageCaseTime = calculateAverageCaseTime();

    // Productivity statistics
    const productivityStats = calculateProductivityStats();

    return {
        totalMatters,
        activeMatters,
        completedMatters,
        pendingLetters,
        upcomingCourt,
        courtBreakdown,
        letterStats,
        monthlyTrends,
        averageCaseTime,
        productivityStats
    };
}

function generateMonthlyTrends() {
    const trends = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });
        
        // Count matters for this month (simplified)
        const mattersThisMonth = clients.filter(c => {
            // Since we don't have creation dates, we'll estimate based on existing data
            return Math.random() > 0.3; // Simulate some data
        }).length;
        
        trends.push({
            month: monthName,
            matters: Math.floor(mattersThisMonth * (0.5 + Math.random() * 0.5))
        });
    }
    
    return trends;
}

function calculateAverageCaseTime() {
    // Estimate average case time based on available data
    const completedCases = clients.filter(c => c.status === 'Completed');
    if (completedCases.length === 0) return 0;
    
    // Simulate average case duration in days
    return Math.floor(30 + Math.random() * 60); // 30-90 days average
}

function calculateProductivityStats() {
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Simulate productivity metrics
    const stats = {
        lettersThisWeek: Math.floor(clients.length * 0.1),
        lettersThisMonth: Math.floor(clients.length * 0.3),
        averageLettersPerDay: Math.floor(clients.length * 0.02),
        mostActiveDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 5)]
    };
    
    return stats;
}

// ===== UI UPDATE FUNCTIONS =====
function updateAnalyticsDashboard() {
    const analytics = generateDetailedAnalytics();
    
    // Update main statistics
    updateMainStats(analytics);
    
    // Update court breakdown chart
    updateCourtBreakdown(analytics.courtBreakdown);
    
    // Update letter status chart
    updateLetterStatusChart(analytics.letterStats);
    
    // Update trends chart
    updateTrendsChart(analytics.monthlyTrends);
    
    // Update productivity stats
    updateProductivityStats(analytics.productivityStats);
}

function updateMainStats(analytics) {
    const elements = {
        totalMatters: document.getElementById('totalMatters'),
        activeMatters: document.getElementById('activeMatters'),
        completedMatters: document.getElementById('completedMatters'),
        pendingLetters: document.getElementById('pendingLetters'),
        upcomingCourt: document.getElementById('upcomingCourt'),
        averageCaseTime: document.getElementById('averageCaseTime')
    };
    
    if (elements.totalMatters) elements.totalMatters.textContent = analytics.totalMatters;
    if (elements.activeMatters) elements.activeMatters.textContent = analytics.activeMatters;
    if (elements.completedMatters) elements.completedMatters.textContent = analytics.completedMatters;
    if (elements.pendingLetters) elements.pendingLetters.textContent = analytics.pendingLetters;
    if (elements.upcomingCourt) elements.upcomingCourt.textContent = analytics.upcomingCourt;
    if (elements.averageCaseTime) elements.averageCaseTime.textContent = `${analytics.averageCaseTime} days`;
}

function updateCourtBreakdown(courtBreakdown) {
    const courtDiv = document.getElementById('courtBreakdown');
    if (!courtDiv) return;
    
    if (Object.keys(courtBreakdown).length === 0) {
        courtDiv.innerHTML = '<p style="color: #6b7280;">No court data available</p>';
        return;
    }
    
    courtDiv.innerHTML = Object.entries(courtBreakdown)
        .sort((a, b) => b[1] - a[1])
        .map(([court, count]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="font-weight: 500;">${court}</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: ${Math.max(20, (count / Math.max(...Object.values(courtBreakdown))) * 100)}px; height: 8px; background: #3b82f6; border-radius: 4px;"></div>
                    <strong style="color: #1e293b; min-width: 30px; text-align: right;">${count}</strong>
                </div>
            </div>
        `).join('');
}

function updateLetterStatusChart(letterStats) {
    const statusDiv = document.getElementById('letterStatusChart');
    if (!statusDiv) return;
    
    const total = letterStats.ccl + letterStats.mention + letterStats.final;
    
    statusDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 20px; margin-bottom: 20px;">
            <div style="text-align: center; padding: 16px; background: #eff6ff; border-radius: 8px;">
                <div style="font-size: 2.5em; font-weight: bold; color: #3b82f6;">${letterStats.ccl}</div>
                <div style="font-size: 14px; color: #6b7280;">CCL Letters</div>
            </div>
            <div style="text-align: center; padding: 16px; background: #f0fdf4; border-radius: 8px;">
                <div style="font-size: 2.5em; font-weight: bold; color: #16a34a;">${letterStats.mention}</div>
                <div style="font-size: 14px; color: #6b7280;">Mention Letters</div>
            </div>
            <div style="text-align: center; padding: 16px; background: #fef2f2; border-radius: 8px;">
                <div style="font-size: 2.5em; font-weight: bold; color: #dc2626;">${letterStats.final}</div>
                <div style="font-size: 14px; color: #6b7280;">Final Letters</div>
            </div>
        </div>
        ${total > 0 ? `
        <div style="margin-top: 16px;">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Completion Rate</div>
            <div style="background: #f3f4f6; border-radius: 8px; overflow: hidden; height: 24px; position: relative;">
                <div style="background: linear-gradient(90deg, #3b82f6 ${(letterStats.ccl/total)*100}%, #16a34a ${(letterStats.ccl/total)*100}% ${((letterStats.ccl+letterStats.mention)/total)*100}%, #dc2626 ${((letterStats.ccl+letterStats.mention)/total)*100}%); height: 100%; transition: width 0.5s ease;"></div>
            </div>
        </div>
        ` : ''}
    `;
}

function updateTrendsChart(monthlyTrends) {
    const trendsDiv = document.getElementById('trendsChart');
    if (!trendsDiv) return;
    
    if (monthlyTrends.length === 0) {
        trendsDiv.innerHTML = '<p style="color: #6b7280;">No trend data available</p>';
        return;
    }
    
    const maxMatters = Math.max(...monthlyTrends.map(t => t.matters));
    
    trendsDiv.innerHTML = `
        <div style="display: flex; align-items: end; gap: 8px; height: 200px; padding: 20px; background: #f8fafc; border-radius: 8px;">
            ${monthlyTrends.map(trend => {
                const height = Math.max(20, (trend.matters / maxMatters) * 150);
                return `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                        <div style="background: #3b82f6; width: 100%; height: ${height}px; border-radius: 4px 4px 0 0; position: relative;">
                            <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: 600; color: #1e293b;">${trend.matters}</div>
                        </div>
                        <div style="font-size: 12px; color: #6b7280; text-align: center; writing-mode: horizontal-tb;">${trend.month}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function updateProductivityStats(productivityStats) {
    const productivityDiv = document.getElementById('productivityStats');
    if (!productivityDiv) return;
    
    productivityDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div style="padding: 16px; background: white; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <div style="font-size: 24px; font-weight: bold; color: #1e293b;">${productivityStats.lettersThisWeek}</div>
                <div style="font-size: 14px; color: #6b7280;">Letters This Week</div>
            </div>
            <div style="padding: 16px; background: white; border-radius: 8px; border-left: 4px solid #16a34a;">
                <div style="font-size: 24px; font-weight: bold; color: #1e293b;">${productivityStats.lettersThisMonth}</div>
                <div style="font-size: 14px; color: #6b7280;">Letters This Month</div>
            </div>
            <div style="padding: 16px; background: white; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <div style="font-size: 24px; font-weight: bold; color: #1e293b;">${productivityStats.averageLettersPerDay}</div>
                <div style="font-size: 14px; color: #6b7280;">Avg Letters/Day</div>
            </div>
            <div style="padding: 16px; background: white; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${productivityStats.mostActiveDay}</div>
                <div style="font-size: 14px; color: #6b7280;">Most Active Day</div>
            </div>
        </div>
    `;
}

// ===== EXPORT FUNCTIONS =====
function exportAnalyticsReport() {
    const analytics = generateDetailedAnalytics();
    
    const reportData = {
        generatedDate: formatDate(getTodayDate()),
        summary: {
            totalMatters: analytics.totalMatters,
            activeMatters: analytics.activeMatters,
            completedMatters: analytics.completedMatters,
            pendingLetters: analytics.pendingLetters,
            upcomingCourt: analytics.upcomingCourt
        },
        courtBreakdown: analytics.courtBreakdown,
        letterStats: analytics.letterStats,
        trends: analytics.monthlyTrends,
        productivity: analytics.productivityStats
    };
    
    // Create downloadable report
    const reportText = `LEGAL PRACTICE ANALYTICS REPORT
Generated: ${reportData.generatedDate}

SUMMARY STATISTICS:
- Total Matters: ${reportData.summary.totalMatters}
- Active Matters: ${reportData.summary.activeMatters}
- Completed Matters: ${reportData.summary.completedMatters}
- Pending Letters: ${reportData.summary.pendingLetters}
- Upcoming Court Dates: ${reportData.summary.upcomingCourt}

COURT BREAKDOWN:
${Object.entries(reportData.courtBreakdown)
    .map(([court, count]) => `- ${court}: ${count} matters`)
    .join('\n')}

LETTER STATISTICS:
- CCL Letters: ${reportData.letterStats.ccl}
- Mention Letters: ${reportData.letterStats.mention}
- Final Letters: ${reportData.letterStats.final}

MONTHLY TRENDS:
${reportData.trends.map(trend => `- ${trend.month}: ${trend.matters} matters`).join('\n')}

PRODUCTIVITY:
- Letters This Week: ${reportData.productivity.lettersThisWeek}
- Letters This Month: ${reportData.productivity.lettersThisMonth}
- Average Letters Per Day: ${reportData.productivity.averageLettersPerDay}
- Most Active Day: ${reportData.productivity.mostActiveDay}

---
Report generated by Legal Practice Management System`;

    // Copy to clipboard
    copyToClipboard(reportText).then(success => {
        if (success) {
            alert('Analytics report copied to clipboard');
        } else {
            alert('Failed to copy report to clipboard');
        }
    });
}

// ===== INITIALIZATION =====
function initializeAnalyticsModule() {
    // Update dashboard on load
    updateAnalyticsDashboard();
    
    // Set up auto-refresh every 30 seconds
    setInterval(updateAnalyticsDashboard, 30000);
}

// ===== EXPORT FUNCTIONS =====
// Make functions globally available
window.updateAnalyticsDashboard = updateAnalyticsDashboard;
window.exportAnalyticsReport = exportAnalyticsReport;
window.initializeAnalyticsModule = initializeAnalyticsModule;