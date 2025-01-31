class AdminDashboard {
    constructor() {
        this.initializeEventListeners();
        Promise.all([
            this.loadUsers(),
            this.loadPendingListings()
        ]).catch(error => {
            console.error('Error initializing dashboard:', error);
        });
    }

    initializeEventListeners() {
        // Search functionality
        document.getElementById('searchUsers').addEventListener('input', (e) => {
            this.filterUsers(e.target.value);
        });

        // Role filter
        document.getElementById('roleFilter').addEventListener('change', (e) => {
            this.filterUsers(document.getElementById('searchUsers').value);
        });

        // Status filter
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filterUsers(document.getElementById('searchUsers').value);
        });

        // Select all users checkbox
        document.getElementById('selectAllUsers').addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('table input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
        });
    }

    async loadUsers() {
        try {
            const tbody = document.getElementById('userTableBody');
            if (!tbody) {
                console.error('User table body not found');
                return;
            }

            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Loading users...</td></tr>';

            const response = await fetch('/api/admin/users', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const users = await response.json();
            console.log('Received users data:', users);

            if (!Array.isArray(users)) {
                throw new Error('Invalid data format received from server');
            }

            // Clear loading message
            tbody.innerHTML = '';

            // Populate table with user data
            users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="d-flex px-2 py-1">
                            <div class="d-flex flex-column justify-content-center">
                                <h6 class="mb-0 text-sm">${user.fullName}</h6>
                                <p class="text-xs text-secondary mb-0">${user.email}</p>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p class="text-xs font-weight-bold mb-0">${user.role}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <span class="badge badge-sm ${user.isVerified ? 'bg-gradient-success' : 'bg-gradient-secondary'}">
                            ${user.isVerified ? 'Verified' : 'Pending'}
                        </span>
                    </td>
                    <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">${user.createdAt}</span>
                    </td>
                    <td class="align-middle">
                        <button class="btn btn-link text-secondary mb-0" onclick="adminDashboard.editUser(${user.id})">
                            <i class="fa fa-edit text-xs"></i>
                        </button>
                        <button class="btn btn-link text-secondary mb-0" onclick="adminDashboard.deleteUser(${user.id})">
                            <i class="fa fa-trash text-xs"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error('Error loading users:', error);
            const tbody = document.getElementById('userTableBody');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-danger">
                            Failed to load users: ${error.message}
                        </td>
                    </tr>
                `;
            }
        }
    }

    renderUsers(users) {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td class="text-center">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${user.id}">
                    </div>
                </td>
                <td>
                    <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">${user.fullName}</h6>
                            <p class="text-xs text-secondary mb-0">${user.email}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-${this.getRoleBadgeColor(user.role)} text-dark">${user.role}</span>
                </td>
                <td class="text-center">
                    <span class="badge bg-${user.isVerified ? 'success' : 'warning'} text-dark">
                        ${user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                </td>
                <td class="text-center">
                    <span class="text-secondary text-xs font-weight-bold">
                        ${new Date(user.createdAt).toLocaleDateString()}
                    </span>
                </td>
                <td class="text-center">
                    <button class="btn btn-link text-dark px-3 mb-0" onclick="adminDashboard.viewUser(${user.id})">
                        <i class="fas fa-eye text-dark me-2"></i>View
                    </button>
                    <button class="btn btn-link text-primary px-3 mb-0" onclick="adminDashboard.editUser(${user.id})">
                        <i class="fas fa-pencil-alt text-primary me-2"></i>Edit
                    </button>
                    <button class="btn btn-link text-danger px-3 mb-0" onclick="adminDashboard.deleteUser(${user.id})">
                        <i class="far fa-trash-alt text-danger me-2"></i>Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getRoleBadgeColor(role) {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'primary';
            case 'seller':
                return 'success';
            case 'buyer':
                return 'info';
            case 'logistics_manager':
                return 'warning';
            default:
                return 'secondary';
        }
    }

    async addUser() {
        const formData = {
            fullName: document.getElementById('newUserName').value,
            email: document.getElementById('newUserEmail').value,
            password: document.getElementById('newUserPassword').value,
            role: document.getElementById('newUserRole').value
        };

        try {
            const response = await fetch('/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add user');
            }

            this.showNotification('User added successfully', 'success');
            this.loadUsers();
            bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
        } catch (error) {
            console.error('Error adding user:', error);
            this.showNotification(error.message || 'Error adding user', 'error');
        }
    }

    async editUser(userId) {
        try {
            const response = await fetch(`/admin/users/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            const user = await response.json();

            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUserName').value = user.fullName;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserRole').value = user.role;
            document.getElementById('editUserVerified').checked = user.isVerified;

            new bootstrap.Modal(document.getElementById('editUserModal')).show();
        } catch (error) {
            console.error('Error loading user details:', error);
            this.showNotification('Error loading user details', 'error');
        }
    }

    async updateUser() {
        try {
            const userId = document.getElementById('editUserId').value;
            const formData = {
                fullName: document.getElementById('editUserName').value,
                email: document.getElementById('editUserEmail').value,
                role: document.getElementById('editUserRole').value,
                isVerified: document.getElementById('editUserVerified').checked
            };

            console.log('Updating user:', userId, formData); // Debug log

            const response = await fetch(`/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update user');
            }

            this.showNotification('User updated successfully', 'success');
            await this.loadUsers(); // Refresh the user list
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            if (modalInstance) {
                modalInstance.hide();
            }
        } catch (error) {
            console.error('Error updating user:', error);
            this.showNotification(error.message || 'Error updating user', 'error');
        }
    }

    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete user');
            }

            this.showNotification('User deleted successfully', 'success');
            this.loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showNotification(error.message || 'Error deleting user', 'error');
        }
    }

    async bulkAction(action) {
        const selectedUsers = Array.from(document.querySelectorAll('table input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value)
            .filter(id => id);

        if (selectedUsers.length === 0) {
            this.showNotification('Please select users first', 'warning');
            return;
        }

        if (!confirm(`Are you sure you want to ${action} the selected users?`)) return;

        try {
            const response = await fetch('/api/admin/users/bulk', {
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

            this.showNotification(`Users ${action}d successfully`, 'success');
            this.loadUsers();
        } catch (error) {
            console.error(`Error ${action}ing users:`, error);
            this.showNotification(`Error ${action}ing users`, 'error');
        }
    }

    filterUsers(searchTerm) {
        const roleFilter = document.getElementById('roleFilter').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value.toLowerCase();
        const rows = document.querySelectorAll('#usersTable tbody tr');

        rows.forEach(row => {
            const name = row.querySelector('h6').textContent.toLowerCase();
            const email = row.querySelector('p').textContent.toLowerCase();
            const role = row.querySelector('.badge').textContent.toLowerCase();
            const status = row.querySelectorAll('.badge')[1].textContent.toLowerCase();

            const matchesSearch = searchTerm === '' || 
                name.includes(searchTerm.toLowerCase()) || 
                email.includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === '' || role === roleFilter;
            const matchesStatus = statusFilter === '' || status.includes(statusFilter);

            row.style.display = matchesSearch && matchesRole && matchesStatus ? '' : 'none';
        });
    }

    showNotification(message, type = 'info') {
        // Create a Bootstrap alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        alertDiv.style.zIndex = '1050';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Remove the alert after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    async loadPendingListings() {
        try {
            const response = await fetch('/api/admin/pending-listings', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const listings = await response.json();
            this.displayPendingListings(listings);
        } catch (error) {
            console.error('Error loading listings:', error);
            // Handle error display
        }
    }

    displayPendingListings(listings) {
        const container = document.getElementById('pendingListingsContainer');
        if (!container) return;

        if (listings.length === 0) {
            container.innerHTML = '<p>No pending listings found.</p>';
            return;
        }

        // Your existing code to display listings...
    }
} 