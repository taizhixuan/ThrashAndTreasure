const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('delivery_zones', {
            zone_id: {
                type: DataTypes.STRING(10),
                primaryKey: true,
                allowNull: false
            },
            zone_name: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            manager: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            deliveries: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        });

        // Insert initial data
        await queryInterface.bulkInsert('delivery_zones', [
            {
                zone_id: 'ZE001',
                zone_name: 'East Region',
                manager: 'Mike Johnson',
                deliveries: 180
            },
            {
                zone_id: 'ZN001',
                zone_name: 'North Region',
                manager: 'John Smith',
                deliveries: 150
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('delivery_zones');
    }
}; 