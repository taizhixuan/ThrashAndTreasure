const adminService = require('../services/adminService');

class AdminController {
    // Get users with pagination and filtering
    async getUsers(req, res) {
        try {
            const { page, limit, role, isVerified, search } = req.query;
            const users = await adminService.getUsers(
                parseInt(page), 
                parseInt(limit), 
                { role, isVerified, search }
            );
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get user statistics
    async getUserStats(req, res) {
        try {
            const stats = await adminService.getUserStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update user status
    async updateUserStatus(req, res) {
        try {
            const { userId } = req.params;
            const { status } = req.body;
            const user = await adminService.updateUserStatus(userId, status);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete user
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            await adminService.deleteUser(userId);
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Perform bulk action
    async bulkAction(req, res) {
        try {
            const { action, userIds } = req.body;
            await adminService.performBulkAction(action, userIds);
            res.json({ message: 'Bulk action completed successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get user profile
    async getUserProfile(req, res) {
        try {
            const { userId } = req.params;
            const user = await adminService.getUserProfile(userId);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update user profile
    async updateUserProfile(req, res) {
        try {
            const { userId } = req.params;
            const userData = req.body;
            const user = await adminService.updateUserProfile(userId, userData);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get dashboard statistics
    async getDashboardStats(req, res) {
        try {
            const stats = await adminService.getDashboardStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get admin profile
    async getAdminProfile(req, res) {
        try {
            const adminId = req.user.id; // From auth middleware
            const profile = await adminService.getAdminProfile(adminId);
            res.json(profile);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get notifications
    async getNotifications(req, res) {
        try {
            const notifications = await adminService.getNotifications();
            res.json(notifications);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update notification
    async updateNotification(req, res) {
        try {
            const { notificationId } = req.params;
            const notification = await adminService.updateNotification(notificationId, req.body);
            res.json(notification);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Search all
    async search(req, res) {
        try {
            const query = req.query.q;
            if (!query || query.length < 2) {
                return res.status(400).json({ error: 'Search query too short' });
            }

            const results = await adminService.searchAll(query);
            res.json(results);
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({ error: 'Search failed' });
        }
    }
}

module.exports = new AdminController(); 