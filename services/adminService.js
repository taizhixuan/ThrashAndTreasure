const User = require('../models/User');
const { Op } = require('sequelize');
const Notification = require('../models/Notification');
const Listing = require('../models/Listing');
const Dispute = require('../models/Dispute');

class AdminService {
    // Get all users with pagination and filtering
    async getUsers(page = 1, limit = 10, filter = {}) {
        try {
            const offset = (page - 1) * limit;
            const where = {};

            // Apply filters if provided
            if (filter.role) where.role = filter.role;
            if (filter.isVerified !== undefined) where.isVerified = filter.isVerified;
            if (filter.search) {
                where[Op.or] = [
                    { fullName: { [Op.like]: `%${filter.search}%` } },
                    { email: { [Op.like]: `%${filter.search}%` } }
                ];
            }

            const users = await User.findAndCountAll({
                where,
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                attributes: { exclude: ['password'] }
            });

            return {
                users: users.rows,
                total: users.count,
                pages: Math.ceil(users.count / limit)
            };
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    }

    // Get user statistics
    async getUserStats() {
        try {
            const totalUsers = await User.count();
            const verifiedUsers = await User.count({ where: { isVerified: true } });
            const roleDistribution = await User.count({
                group: ['role']
            });

            return {
                totalUsers,
                verifiedUsers,
                roleDistribution
            };
        } catch (error) {
            throw new Error('Error fetching user statistics: ' + error.message);
        }
    }

    // Update user status
    async updateUserStatus(userId, status) {
        try {
            const user = await User.findByPk(userId);
            if (!user) throw new Error('User not found');

            user.isVerified = status;
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Error updating user status: ' + error.message);
        }
    }

    // Delete user
    async deleteUser(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) throw new Error('User not found');

            await user.destroy();
            return true;
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    }

    // Get admin profile
    async getAdminProfile(adminId) {
        try {
            const admin = await User.findByPk(adminId, {
                attributes: { exclude: ['password'] }
            });
            if (!admin) throw new Error('Admin profile not found');
            return admin;
        } catch (error) {
            throw new Error('Error fetching admin profile: ' + error.message);
        }
    }

    // Get dashboard stats
    async getDashboardStats() {
        try {
            const totalUsers = await User.count();
            const newUsersToday = await User.count({
                where: {
                    createdAt: {
                        [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            });

            const verifiedUsers = await User.count({ where: { isVerified: true } });
            const pendingUsers = await User.count({ where: { isVerified: false } });

            return {
                totalUsers,
                newUsersToday,
                verifiedUsers,
                pendingUsers,
                userStats: {
                    labels: ['Verified', 'Pending'],
                    data: [verifiedUsers, pendingUsers]
                }
            };
        } catch (error) {
            throw new Error('Error fetching dashboard stats: ' + error.message);
        }
    }

    // Get notifications
    async getNotifications() {
        try {
            const notifications = await Notification.findAll({
                order: [['createdAt', 'DESC']],
                limit: 10
            });
            return notifications;
        } catch (error) {
            throw new Error('Error fetching notifications: ' + error.message);
        }
    }

    // Update notification
    async updateNotification(notificationId, data) {
        try {
            const notification = await Notification.findByPk(notificationId);
            if (!notification) throw new Error('Notification not found');
            
            await notification.update(data);
            return notification;
        } catch (error) {
            throw new Error('Error updating notification: ' + error.message);
        }
    }

    // Add this method to AdminService class
    async searchAll(query) {
        try {
            // Search across multiple entities
            const [users, listings, disputes] = await Promise.all([
                User.findAll({
                    where: {
                        [Op.or]: [
                            { fullName: { [Op.like]: `%${query}%` } },
                            { email: { [Op.like]: `%${query}%` } }
                        ]
                    },
                    limit: 5
                }),
                Listing.findAll({
                    where: {
                        title: { [Op.like]: `%${query}%` }
                    },
                    limit: 5
                }),
                Dispute.findAll({
                    where: {
                        title: { [Op.like]: `%${query}%` }
                    },
                    limit: 5
                })
            ]);

            // Format results
            return [
                ...users.map(user => ({
                    title: user.fullName,
                    description: user.email,
                    link: `/admin/user-profile.html?id=${user.id}`,
                    icon: 'fas fa-user text-primary'
                })),
                ...listings.map(listing => ({
                    title: listing.title,
                    description: `$${listing.price}`,
                    link: `/admin/listing-details.html?id=${listing.id}`,
                    icon: 'fas fa-tag text-success'
                })),
                ...disputes.map(dispute => ({
                    title: dispute.title,
                    description: `Status: ${dispute.status}`,
                    link: `/admin/resolve-disputes.html?id=${dispute.id}`,
                    icon: 'fas fa-exclamation-circle text-warning'
                }))
            ];
        } catch (error) {
            throw new Error('Search failed: ' + error.message);
        }
    }
}

module.exports = new AdminService(); 