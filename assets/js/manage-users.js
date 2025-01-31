class UserManager {
    constructor() {
        this.initializeEventListeners();
        this.loadUsers();
    }

    initializeEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Add Edit User Form Handler
        const updateUserBtn = document.getElementById('updateUserBtn');
        if (updateUserBtn) {
            updateUserBtn.addEventListener('click', () => {
                this.handleEditUser();
            });
        }
    }

    async handleEditUser() {
        const form = document.getElementById('editUserForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        try {
            const userId = document.getElementById('editUserId').value;
            const formData = {
                fullName: document.getElementById('editUserName').value,
                email: document.getElementById('editUserEmail').value,
                role: document.getElementById('editUserRole').value.toUpperCase(),
                isVerified: document.getElementById('editUserVerified').checked
            };

            console.log('Updating user with data:', formData); // Debug log

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user');
            }

            await this.loadUsers(); // Refresh the user list
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            if (modal) {
                modal.hide();
            }
            form.reset();
            this.showNotification('User updated successfully', 'success');
        } catch (error) {
            console.error('Error updating user:', error);
            this.showNotification(error.message || 'Error updating user', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    }

    async editUser(userId) {
        try {
            const response = await fetch(`/api/admin/users/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            const user = await response.json();
            
            // Populate the edit form with correct field mappings
            document.getElementById('editUserId').value = user.id || user.user_id;
            document.getElementById('editUserName').value = user.fullName || user.name;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserRole').value = (user.role || '').toLowerCase();
            document.getElementById('editUserVerified').checked = user.isVerified || user.is_verified;

            // Show the modal
            const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editModal.show();
        } catch (error) {
            console.error('Error fetching user details:', error);
            this.showNotification('Error loading user details', 'error');
        }
    }
}

// Initialize the user manager
const userManager = new UserManager(); 