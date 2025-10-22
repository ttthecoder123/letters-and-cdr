const TaskPriorityModule = (() => {
    let filteredClients = [];
    let currentEditingClientId = null;
    let currentFilter = 'all';
    
    let searchDebounceTimer = null;
    const dateCalculationCache = new Map();
    const lowercaseCache = new Map();

    const updateStats = () => {
        const stats = {
            tasksNow: 0,
            tasksPending: 0,
            adminClose: 0,
            unassigned: 0
        };

        clients.forEach(client => {
            switch (client.taskPriority) {
                case 'Tasks Now':
                    stats.tasksNow++;
                    break;
                case 'Tasks Pending':
                    stats.tasksPending++;
                    break;
                case 'Admin/Close':
                    stats.adminClose++;
                    break;
                default:
                    stats.unassigned++;
                    break;
            }
        });

        document.getElementById('statsTasksNow').textContent = stats.tasksNow;
        document.getElementById('statsTasksPending').textContent = stats.tasksPending;
        document.getElementById('statsAdminClose').textContent = stats.adminClose;
        document.getElementById('statsUnassigned').textContent = stats.unassigned;
    };

    const filterBy = (priority) => {
        currentFilter = priority;
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        if (priority === 'all') {
            document.querySelector('.filter-btn.show-all').classList.add('active');
            filteredClients = [...clients];
        } else {
            if (priority === null) {
                document.querySelector('.filter-btn.unassigned').classList.add('active');
                filteredClients = clients.filter(c => !c.taskPriority);
            } else {
                const btnClass = priority.toLowerCase().replace(/[^a-z]/g, '-');
                document.querySelector(`.filter-btn.${btnClass.replace('--', '-')}`).classList.add('active');
                filteredClients = clients.filter(c => c.taskPriority === priority);
            }
        }

        renderMatters();
    };

    const searchMatters = (query) => {
        if (searchDebounceTimer) {
            clearTimeout(searchDebounceTimer);
        }
        
        searchDebounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300);
    };
    
    const getCachedLowercase = (str, clientId, field) => {
        if (!str) return '';
        const cacheKey = `${clientId}_${field}`;
        if (lowercaseCache.has(cacheKey)) {
            return lowercaseCache.get(cacheKey);
        }
        const lower = str.toLowerCase();
        lowercaseCache.set(cacheKey, lower);
        
        if (lowercaseCache.size > 500) {
            const firstKey = lowercaseCache.keys().next().value;
            lowercaseCache.delete(firstKey);
        }
        return lower;
    };
    
    const performSearch = (query) => {
        if (!query.trim()) {
            filterBy(currentFilter);
            return;
        }

        const searchQuery = query.toLowerCase();
        let baseClients = currentFilter === 'all' ? clients : 
                        currentFilter === null ? clients.filter(c => !c.taskPriority) :
                        clients.filter(c => c.taskPriority === currentFilter);

        filteredClients = baseClients.filter(client => 
            getCachedLowercase(client.name, client.id, 'name').includes(searchQuery) ||
            getCachedLowercase(client.matterNumber, client.id, 'matterNumber').includes(searchQuery) ||
            getCachedLowercase(client.court, client.id, 'court').includes(searchQuery) ||
            getCachedLowercase(client.charges, client.id, 'charges').includes(searchQuery)
        );

        renderMatters();
    };

    const sortMatters = () => {
        const sortBy = document.getElementById('sortSelect').value;
        
        filteredClients.sort((a, b) => {
            switch (sortBy) {
                case 'priority':
                    const priorityOrder = {'Tasks Now': 1, 'Tasks Pending': 2, 'Admin/Close': 3, '': 4, null: 4, undefined: 4};
                    return (priorityOrder[a.taskPriority] || 4) - (priorityOrder[b.taskPriority] || 4);
                
                case 'name':
                    return (a.name || '').localeCompare(b.name || '');
                
                case 'updated':
                    const aDate = new Date(a.lastStatusUpdate || 0);
                    const bDate = new Date(b.lastStatusUpdate || 0);
                    return bDate - aDate;
                
                case 'matter':
                    return (a.matterNumber || '').localeCompare(b.matterNumber || '');
                
                default:
                    return 0;
            }
        });

        renderMatters();
    };

    const renderMatters = () => {
        const container = document.getElementById('mattersContainer');
        
        if (filteredClients.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No matters found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredClients.map(client => {
            const priorityClass = getPriorityClass(client.taskPriority);
            const priorityDisplay = client.taskPriority || 'Unassigned';
            const lastUpdated = client.lastStatusUpdate ? 
                formatDateRelative(client.lastStatusUpdate) : 'Never';
            
            const isUrgent = isTaskUrgent(client);
            const isStale = isTaskStale(client);
            const rowClasses = ['matter-row'];
            if (isUrgent) rowClasses.push('priority-urgent');
            if (isStale) rowClasses.push('priority-stale');

            return `
                <div class="${rowClasses.join(' ')}" onclick="TaskPriorityModule.openEditModal(${client.id})">
                    <div class="matter-mobile-layout">
                        <div class="matter-mobile-top">
                            <div class="matter-info">
                                <h3>${client.name || 'Unknown Client'}</h3>
                                <p>Matter: ${client.matterNumber || 'No matter number'}</p>
                                ${client.court ? `<p>Court: ${client.court}</p>` : ''}
                            </div>
                            <div class="priority-badge ${priorityClass}">
                                ${priorityDisplay}
                            </div>
                        </div>
                        <div class="matter-mobile-bottom">
                            <div class="last-updated">
                                Last updated: ${lastUpdated}
                                ${isStale ? ' ⏰' : ''}
                            </div>
                            <button class="action-btn btn-edit" onclick="event.stopPropagation(); TaskPriorityModule.openEditModal(${client.id})">
                                Edit Priority
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'Tasks Now': return 'tasks-now';
            case 'Tasks Pending': return 'tasks-pending';
            case 'Admin/Close': return 'admin-close';
            default: return 'unassigned';
        }
    };

    const getCachedDaysDiff = (dateString) => {
        if (!dateString) return null;
        
        const cacheKey = `${dateString}_${new Date().toDateString()}`;
        if (dateCalculationCache.has(cacheKey)) {
            return dateCalculationCache.get(cacheKey);
        }
        
        const daysDiff = (Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24);
        dateCalculationCache.set(cacheKey, daysDiff);
        
        if (dateCalculationCache.size > 100) {
            const firstKey = dateCalculationCache.keys().next().value;
            dateCalculationCache.delete(firstKey);
        }
        
        return daysDiff;
    };
    
    const isTaskUrgent = (client) => {
        if (client.taskPriority !== 'Tasks Now' || !client.lastStatusUpdate) {
            return false;
        }
        const daysDiff = getCachedDaysDiff(client.lastStatusUpdate);
        return daysDiff > 3;
    };

    const isTaskStale = (client) => {
        if (!client.lastStatusUpdate) return true;
        const daysDiff = getCachedDaysDiff(client.lastStatusUpdate);
        return daysDiff > 30;
    };

    const formatDateRelative = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return date.toLocaleDateString();
    };

    const openEditModal = (clientId) => {
        const client = clients.find(c => c.id === clientId);
        if (!client) return;

        currentEditingClientId = clientId;
        
        document.getElementById('modalClientName').textContent = client.name || 'Unknown Client';
        document.getElementById('modalMatterNumber').textContent = `Matter: ${client.matterNumber || 'No matter number'}`;
        document.getElementById('modalPriority').value = client.taskPriority || '';
        document.getElementById('modalNotes').value = client.priorityNotes || '';
        document.getElementById('modalLastUpdated').textContent = 
            client.lastStatusUpdate ? formatDateRelative(client.lastStatusUpdate) : 'Never';

        document.getElementById('editModal').classList.add('active');
    };

    const closeModal = () => {
        document.getElementById('editModal').classList.remove('active');
        currentEditingClientId = null;
    };

    const savePriority = () => {
        if (!currentEditingClientId) return;

        const client = clients.find(c => c.id === currentEditingClientId);
        if (!client) return;

        const priority = document.getElementById('modalPriority').value || null;
        const notes = document.getElementById('modalNotes').value.trim();

        client.taskPriority = priority;
        client.priorityNotes = notes;
        client.lastStatusUpdate = new Date().toISOString();

        saveData();
        showSuccessMessage();
        updateStats();
        renderMatters();
        closeModal();
    };

    const showSuccessMessage = () => {
        const msg = document.getElementById('successMessage');
        msg.classList.add('show');
        setTimeout(() => {
            msg.classList.remove('show');
        }, 3000);
    };

    const init = () => {
        filteredClients = [...clients];
        updateStats();
        renderMatters();
        
        const editModal = document.getElementById('editModal');
        if (editModal) {
            editModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });
        }
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.getElementById('editModal').classList.contains('active')) {
                closeModal();
            }
        });
    };

    return {
        init,
        updateStats,
        filterBy,
        searchMatters,
        sortMatters,
        openEditModal,
        closeModal,
        savePriority
    };
})();
