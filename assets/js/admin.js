// Custom JavaScript for admin functionality

class AdminDashboard {
    constructor() {
        this.currentPage = 1;
        this.limit = 10;
        
        // Add static searchable items
        this.searchableItems = [
            { title: 'Dashboard Overview', link: 'admin-dashboard.html', type: 'dashboard' },
            { title: 'Manage Users', link: 'manage-users.html', type: 'user' },
            { title: 'User Reports', link: 'user-reports.html', type: 'report' },
            { title: 'Seller Listings', link: 'approve-seller-listings.html', type: 'listing' },
            { title: 'Active Disputes', link: 'resolve-disputes.html', type: 'notification' },
            { title: 'System Settings', link: 'settings.html', type: 'settings' },
            { title: 'Performance Metrics', link: 'monitor-performance.html', type: 'report' }
        ];

        // Add icon mapping
        this.iconMap = {
            dashboard: 'fas fa-th-large text-primary',
            user: 'fas fa-users text-success',
            listing: 'fas fa-tag text-warning',
            report: 'fas fa-chart-line text-info',
            notification: 'fas fa-bell text-danger',
            settings: 'fas fa-cog text-dark'
        };

        // Initialize search for all pages
        this.initializeSearch();

        // Only initialize user-specific features on users page
        if (document.body.dataset.page === 'users') {
            this.initializeEventListeners();
            this.loadUsers();
            this.loadStats();
        }
    }

    initializeEventListeners() {
        // Search functionality with debounce
        const searchInput = document.getElementById('searchUsers');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.currentPage = 1;
                this.loadUsers();
            }, 300));
        }

        // Role filter functionality
        const roleFilter = document.getElementById('roleFilter');
        if (roleFilter) {
            roleFilter.addEventListener('change', () => {
                this.currentPage = 1;
                this.loadUsers();
            });
        }

        // User Profile
        const profileImageInput = document.getElementById('profileImageInput');
        if (profileImageInput) {
            profileImageInput.addEventListener('change', (e) => this.updateProfileImage(e.target.files[0]));
        }

        // User Management
        const deactivateBtn = document.querySelector('.btn-deactivate');
        if (deactivateBtn) {
            deactivateBtn.addEventListener('click', () => this.deactivateAccount(deactivateBtn.dataset.userId));
        }

        // Dispute Resolution
        const resolveButtons = document.querySelectorAll('.resolve-dispute-btn');
        resolveButtons.forEach(btn => {
            btn.addEventListener('click', () => this.resolveDispute(btn.dataset.disputeId, btn.dataset.action));
        });

        // Report Generation
        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => {
                const reportType = document.getElementById('reportType').value;
                const filters = {
                    startDate: document.getElementById('startDate').value,
                    endDate: document.getElementById('endDate').value
                };
                this.generateReport(reportType, filters);
            });
        }

        // Delivery Zone Management
        const saveZoneBtn = document.getElementById('saveZoneBtn');
        if (saveZoneBtn) {
            saveZoneBtn.addEventListener('click', () => {
                const zoneData = {
                    name: document.getElementById('zoneName').value,
                    coordinates: this.getMapCoordinates()
                };
                this.saveDeliveryZone(zoneData);
            });
        }

        // Add User Button
        const addUserBtn = document.querySelector('[data-bs-target="#addUserModal"]');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                document.getElementById('addUserForm').reset();
            });
        }

        // Get Admin Token Button
        const getTokenBtn = document.createElement('button');
        getTokenBtn.textContent = 'Get Admin Token';
        getTokenBtn.style.display = 'none'; // Hide in production
        getTokenBtn.onclick = async () => {
            const token = await this.getAdminToken();
            if (token) {
                console.log('Admin Token:', token);
                navigator.clipboard.writeText(token)
                    .then(() => alert('Token copied to clipboard!'))
                    .catch(err => console.error('Failed to copy token:', err));
            }
        };
        document.body.appendChild(getTokenBtn);
    }

    async loadUsers() {
        try {
            const searchQuery = document.getElementById('searchUsers')?.value || '';
            const roleFilter = document.getElementById('roleFilter')?.value || '';

            const response = await fetch(`/api/admin/users?page=${this.currentPage}&limit=${this.limit}&search=${encodeURIComponent(searchQuery)}&role=${encodeURIComponent(roleFilter)}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            this.renderUsers(data.users);
            this.renderPagination(data.totalPages);
        } catch (error) {
            console.error('Error loading users:', error);
            this.showError('Failed to load users');
        }
    }

    async loadStats() {
        try {
            const response = await fetch('/api/admin/users/stats');
            const stats = await response.json();

            if (!response.ok) throw new Error(stats.error);

            this.updateDashboardStats(stats);
        } catch (error) {
            console.error('Error loading stats:', error);
            this.showError('Failed to load statistics');
        }
    }

    renderUsers(users) {
        const tbody = document.querySelector('#usersTable tbody');
        if (!tbody) return;

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="form-check">
                            <input class="form-check-input user-select" type="checkbox" value="${user.id}">
                        </div>
                    </div>
                </td>
                <td>${this.escapeHtml(user.full_name)}</td>
                <td>${this.escapeHtml(user.email)}</td>
                <td>${this.escapeHtml(user.role)}</td>
                <td>${user.is_verified ? 'Verified' : 'Pending'}</td>
                <td>
                    <button class="btn btn-link text-dark px-3 mb-0" onclick="adminDashboard.editUser(${user.id})">
                        <i class="fas fa-pencil-alt text-dark me-2"></i>Edit
                    </button>
                    <button class="btn btn-link text-danger text-gradient px-3 mb-0" onclick="adminDashboard.deleteUser(${user.id})">
                        <i class="far fa-trash-alt me-2"></i>Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderPagination(totalPages) {
        const paginationEl = document.querySelector('.pagination');
        if (!paginationEl) return;

        let paginationHTML = `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="adminDashboard.changePage(${this.currentPage - 1})">Previous</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${this.currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="adminDashboard.changePage(${i})">${i}</a>
                </li>
            `;
        }

        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="adminDashboard.changePage(${this.currentPage + 1})">Next</a>
            </li>
        `;

        paginationEl.innerHTML = paginationHTML;
    }

    changePage(page) {
        this.currentPage = page;
        this.loadUsers();
    }

    async deleteUser(userId) {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete user');

            this.showSuccess('User deleted successfully');
            this.loadUsers(); // Refresh the user list
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showError('Failed to delete user');
        }
    }

    async deactivateAccount(userId) {
        if (!confirm('Are you sure you want to deactivate this account?')) return;

        try {
            const response = await fetch(`/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: false })
            });

            if (!response.ok) throw new Error('Failed to deactivate account');

            this.showSuccess('Account deactivated successfully');
            this.loadUsers();
        } catch (error) {
            this.showError('Failed to deactivate account');
        }
    }

    async resolveDispute(disputeId, action) {
        if (!confirm(`Are you sure you want to ${action} this dispute?`)) return;

        try {
            const response = await fetch(`/api/admin/disputes/${disputeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });

            if (!response.ok) throw new Error(`Failed to ${action} dispute`);

            this.showSuccess(`Dispute ${action}d successfully`);
            this.loadDisputes();
        } catch (error) {
            this.showError(`Failed to ${action} dispute`);
        }
    }

    async markNotificationAsRead(notificationId) {
        try {
            const response = await fetch(`/api/admin/notifications/${notificationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true })
            });

            if (!response.ok) throw new Error('Failed to mark notification as read');

            this.loadNotifications();
        } catch (error) {
            this.showError('Failed to update notification');
        }
    }

    async loadUserProfile(userId) {
        try {
            const response = await fetch(`/api/admin/users/${userId}`);
            if (!response.ok) throw new Error('Failed to load user profile');
            const userData = await response.json();
            
            // Update profile information
            document.getElementById('userName').textContent = userData.fullName;
            document.getElementById('userRole').textContent = userData.role;
            document.getElementById('userEmail').textContent = userData.email;
            document.getElementById('userStatus').textContent = userData.isVerified ? 'Active' : 'Pending';
            
            // Update profile image
            const profileImage = document.getElementById('userProfileImage');
            if (profileImage) {
                profileImage.src = userData.profileImage || '/assets/images/avatars/default-avatar.png';
            }
        } catch (error) {
            this.showError('Failed to load user profile');
        }
    }

    async updateUserProfile(userId, userData) {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) throw new Error('Failed to update user profile');

            this.showSuccess('Profile updated successfully');
            this.loadUserProfile(userId);
        } catch (error) {
            console.error('Error updating user profile:', error);
            this.showError('Failed to update user profile');
        }
    }

    showSuccess(message) {
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-white bg-success border-0';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    showError(message) {
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-white bg-danger border-0';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(container);
        return container;
    }

    // Helper methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    updateDashboardStats(stats) {
        // Update dashboard statistics
        document.getElementById('totalUsers')?.textContent = stats.totalUsers;
        document.getElementById('verifiedUsers')?.textContent = stats.verifiedUsers;
        // Update other stats as needed
    }

    async performBulkAction(action) {
        const selectedUsers = Array.from(document.querySelectorAll('.user-select:checked')).map(cb => cb.value);
        
        if (selectedUsers.length === 0) {
            this.showError('Please select users to perform this action');
            return;
        }

        if (!confirm(`Are you sure you want to ${action} the selected users?`)) return;

        try {
            const response = await fetch('/api/admin/users/bulk-action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action,
                    userIds: selectedUsers
                })
            });

            if (!response.ok) throw new Error(`Failed to ${action} users`);

            this.loadUsers();
            this.showSuccess(`Bulk ${action} completed successfully`);
        } catch (error) {
            console.error(`Error performing bulk ${action}:`, error);
            this.showError(`Failed to ${action} users`);
        }
    }

    async loadPerformanceData() {
        try {
            const response = await fetch('/api/admin/performance');
            if (!response.ok) throw new Error('Failed to load performance data');
            const data = await response.json();
            
            // Update charts
            this.updateSalesChart(data.sales);
            this.updateUserDistributionChart(data.userDistribution);
        } catch (error) {
            this.showError('Failed to load performance data');
        }
    }

    async saveDeliveryZone(zoneData) {
        try {
            const response = await fetch('/api/admin/delivery-zones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(zoneData)
            });
            if (!response.ok) throw new Error('Failed to save delivery zone');
            
            this.showSuccess('Delivery zone saved successfully');
            this.loadDeliveryZones();
        } catch (error) {
            this.showError('Failed to save delivery zone');
        }
    }

    async generateReport(reportType, filters) {
        try {
            const response = await fetch('/api/admin/reports/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportType, filters })
            });
            if (!response.ok) throw new Error('Failed to generate report');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportType}-report.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            this.showError('Failed to generate report');
        }
    }

    updateSalesChart(data) {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;
        
        if (this.salesChart) {
            this.salesChart.destroy();
        }
        
        this.salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Sales',
                    data: data.values,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }
        });
    }

    updateUserDistributionChart(data) {
        const ctx = document.getElementById('userDistributionChart');
        if (!ctx) return;
        
        if (this.userDistChart) {
            this.userDistChart.destroy();
        }
        
        this.userDistChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ]
                }]
            }
        });
    }

    // Profile Management
    async loadAdminProfile() {
        try {
            const response = await fetch('/api/admin/profile');
            if (!response.ok) throw new Error('Failed to load admin profile');
            const profileData = await response.json();
            
            // Update profile elements
            document.getElementById('adminName')?.textContent = profileData.fullName;
            document.getElementById('adminEmail')?.textContent = profileData.email;
            document.getElementById('adminProfileImage')?.setAttribute('src', 
                profileData.profileImage || '/assets/images/avatars/default-avatar.png'
            );
        } catch (error) {
            this.showError('Failed to load admin profile');
        }
    }

    // Notifications Management
    async loadNotifications() {
        try {
            const response = await fetch('/api/admin/notifications');
            if (!response.ok) throw new Error('Failed to load notifications');
            const notifications = await response.json();
            
            // Update notification count badge
            const notificationBadge = document.querySelector('.notification-badge');
            if (notificationBadge) {
                const unreadCount = notifications.filter(n => !n.read).length;
                notificationBadge.textContent = unreadCount;
                notificationBadge.style.display = unreadCount > 0 ? 'block' : 'none';
            }

            // Update notification dropdown
            const notificationsList = document.getElementById('notificationsList');
            if (notificationsList) {
                notificationsList.innerHTML = notifications.map(notification => `
                    <li class="mb-2">
                        <a class="dropdown-item border-radius-md ${notification.read ? 'bg-light' : ''}" 
                           href="javascript:;" 
                           onclick="adminDashboard.handleNotification('${notification.id}', '${notification.type}')">
                            <div class="d-flex py-1">
                                <div class="d-flex flex-column justify-content-center">
                                    <h6 class="text-sm font-weight-normal mb-1">
                                        <span class="font-weight-bold">${notification.title}</span>
                                    </h6>
                                    <p class="text-xs text-secondary mb-0">
                                        <i class="fa fa-clock me-1"></i>
                                        ${this.formatTimeAgo(notification.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </a>
                    </li>
                `).join('');
            }
        } catch (error) {
            this.showError('Failed to load notifications');
        }
    }

    // Handle notification clicks
    async handleNotification(notificationId, type) {
        try {
            // Mark notification as read
            await fetch(`/api/admin/notifications/${notificationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true })
            });

            // Handle different notification types
            switch (type) {
                case 'USER_REGISTRATION':
                    window.location.href = '/admin/manage-users.html';
                    break;
                case 'DISPUTE':
                    window.location.href = '/admin/resolve-disputes.html';
                    break;
                case 'LISTING':
                    window.location.href = '/admin/approve-seller-listings.html';
                    break;
                default:
                    this.loadNotifications();
            }
        } catch (error) {
            this.showError('Failed to handle notification');
        }
    }

    // Settings Management
    async updateSettings(settings) {
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (!response.ok) throw new Error('Failed to update settings');
            this.showSuccess('Settings updated successfully');
        } catch (error) {
            this.showError('Failed to update settings');
        }
    }

    // Search Functionality
    initializeSearch() {
        // Add debug logging
        console.log('Initializing search...');

        const searchInput = document.querySelector('.navbar-search-input');
        const searchButton = document.querySelector('.search-button');
        const searchDropdown = document.querySelector('.search-dropdown');
        const searchResults = document.querySelector('.search-results');
        const defaultState = document.getElementById('defaultState');
        const loadingEl = document.getElementById('searchLoading');
        const noResultsEl = document.getElementById('noResults');
        const searchErrorEl = document.getElementById('searchError');
        const resultsContainer = document.querySelector('.search-results-container');

        // Debug log elements
        console.log('Search elements:', {
            input: !!searchInput,
            button: !!searchButton,
            dropdown: !!searchDropdown,
            results: !!searchResults,
            defaultState: !!defaultState,
            loadingEl: !!loadingEl,
            noResultsEl: !!noResultsEl,
            searchErrorEl: !!searchErrorEl,
            resultsContainer: !!resultsContainer
        });

        if (!searchInput || !searchDropdown || !searchResults) {
            console.error('Search elements not found');
            return;
        }

        // Show dropdown on focus
        searchInput.addEventListener('focus', () => {
            console.log('Search input focused');
            searchDropdown.classList.add('show');
            if (searchInput.value.trim().length === 0) {
                defaultState.classList.remove('d-none');
            }
        });

        // Perform search on input
        searchInput.addEventListener('input', () => {
            console.log('Search input changed:', searchInput.value);
            this.performSearch(
                searchInput.value,
                searchDropdown,
                defaultState,
                loadingEl,
                noResultsEl,
                searchErrorEl,
                resultsContainer
            );
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && 
                !searchButton?.contains(e.target) && 
                !searchDropdown.contains(e.target)) {
                searchDropdown.classList.remove('show');
            }
        });
    }

    // Logout
    async logout() {
        try {
            const response = await fetch('/api/admin/logout', {
                method: 'POST'
            });

            if (!response.ok) throw new Error('Logout failed');
            
            // Clear any stored data
            localStorage.removeItem('adminToken');
            
            // Redirect to login page
            window.location.href = '/admin/login.html';
        } catch (error) {
            this.showError('Logout failed');
        }
    }

    // Utility function for time formatting
    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    initializeDashboard() {
        // Load initial data
        this.loadDashboardStats();
        this.loadAdminProfile();
        this.loadNotifications();

        // Set up real-time updates (if needed)
        setInterval(() => {
            this.loadDashboardStats();
            this.loadNotifications();
        }, 300000); // Update every 5 minutes

        // Add event listeners
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.openSettings());
        document.getElementById('refreshStats')?.addEventListener('click', () => this.loadDashboardStats());
    }

    async loadDashboardStats() {
        try {
            const response = await fetch('/api/admin/dashboard/stats');
            if (!response.ok) throw new Error('Failed to load dashboard stats');
            const stats = await response.json();

            // Update dashboard cards
            document.getElementById('totalUsers').textContent = stats.totalUsers;
            document.getElementById('newUsersToday').textContent = stats.newUsersToday;
            document.getElementById('verifiedUsers').textContent = stats.verifiedUsers;
            document.getElementById('pendingUsers').textContent = stats.pendingUsers;

            // Update charts if they exist
            if (stats.userStats) {
                this.updateUserChart(stats.userStats);
            }
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            this.showError('Failed to load dashboard statistics');
        }
    }

    updateUserChart(data) {
        const ctx = document.getElementById('userStatsChart');
        if (!ctx) return;

        if (this.userChart) {
            this.userChart.destroy();
        }

        this.userChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: ['#2dce89', '#fb6340']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    async addUser() {
        try {
            const userData = {
                fullName: document.getElementById('newUserName').value,
                email: document.getElementById('newUserEmail').value,
                password: document.getElementById('newUserPassword').value,
                role: document.getElementById('newUserRole').value
            };

            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add user');
            }

            this.showSuccess('User added successfully');
            document.getElementById('addUserForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
            this.loadUsers(); // Refresh the user list
        } catch (error) {
            console.error('Error adding user:', error);
            this.showError(error.message);
        }
    }

    async editUser(userId) {
        try {
            const response = await fetch(`/api/admin/users/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user details');
            
            const user = await response.json();
            
            // Populate the edit form
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUserName').value = user.fullName;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserRole').value = user.role;
            document.getElementById('editUserVerified').checked = user.isVerified;

            // Show the modal
            new bootstrap.Modal(document.getElementById('editUserModal')).show();
        } catch (error) {
            console.error('Error fetching user details:', error);
            this.showError('Failed to load user details');
        }
    }

    async updateUser() {
        try {
            const userId = document.getElementById('editUserId').value;
            const userData = {
                fullName: document.getElementById('editUserName').value,
                email: document.getElementById('editUserEmail').value,
                role: document.getElementById('editUserRole').value,
                isVerified: document.getElementById('editUserVerified').checked
            };

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) throw new Error('Failed to update user');

            this.showSuccess('User updated successfully');
            bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
            this.loadUsers(); // Refresh the user list
        } catch (error) {
            console.error('Error updating user:', error);
            this.showError('Failed to update user');
        }
    }

    // Helper method to prevent XSS
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    async getAdminToken() {
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'admin@example.com',    // Replace with your admin email
                    password: 'your_admin_password' // Replace with your admin password
                })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const token = data.token;
            
            // Store token in localStorage
            localStorage.setItem('adminToken', token);
            
            console.log('Admin Token:', token);
            return token;
        } catch (error) {
            console.error('Error getting admin token:', error);
            return null;
        }
    }

    performSearch(query, dropdown, defaultState, loadingEl, noResultsEl, errorEl, resultsContainer) {
        console.log('Performing search with query:', query);
        
        // Reset states
        defaultState.classList.add('d-none');
        loadingEl.classList.add('d-none');
        noResultsEl.classList.add('d-none');
        errorEl.classList.add('d-none');
        resultsContainer.innerHTML = '';

        query = query.toLowerCase().trim();
        
        if (query.length === 0) {
            dropdown.classList.remove('show');
            defaultState.classList.remove('d-none');
            return;
        }

        // Show loading state
        loadingEl.classList.remove('d-none');
        dropdown.classList.add('show');

        // Simulate API delay
        setTimeout(() => {
            // Filter items
            const filteredItems = this.searchableItems.filter(item =>
                item.title.toLowerCase().includes(query)
            );

            console.log('Filtered items:', filteredItems);

            // Hide loading state
            loadingEl.classList.add('d-none');

            if (filteredItems.length === 0) {
                noResultsEl.classList.remove('d-none');
                return;
            }

            // Render results
            resultsContainer.innerHTML = filteredItems.map(item => `
                <a class="dropdown-item py-2" href="${item.link}">
                    <div class="d-flex align-items-center">
                        <div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                            <i class="${this.iconMap[item.type] || 'fas fa-search'}"></i>
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">${item.title}</h6>
                            <p class="text-xs text-secondary mb-0">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
                        </div>
                    </div>
                </a>
            `).join('');
        }, 300); // Simulate network delay
    }
}

// Initialize admin dashboard when document is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'users') {
        window.adminDashboard = new AdminDashboard();
    }
}); 