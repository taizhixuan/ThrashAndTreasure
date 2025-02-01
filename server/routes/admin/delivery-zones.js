// Server-side code (for Node/Express)
if (typeof module !== 'undefined' && module.exports) {
  const express = require('express');
  const router = express.Router();
  const db = require('../../config/database');

  // Get all delivery zones
  router.get('/delivery-zones', async (req, res) => {
      try {
          const [zones] = await db.execute('SELECT * FROM Delivery_Zones');
          res.json(zones);
      } catch (error) {
          console.error('Error fetching delivery zones:', error);
          res.status(500).json({ message: 'Error fetching delivery zones' });
      }
  });

  // Add new delivery zone
  router.post('/delivery-zones', async (req, res) => {
      try {
          const { zone_id, zone_name, manager, deliveries } = req.body;
          
          // Validate input
          if (!zone_id || !zone_name || !manager || deliveries === undefined) {
              return res.status(400).json({ message: 'All fields are required' });
          }

          // Check if zone_id already exists
          const [existingZones] = await db.execute(
              'SELECT zone_id FROM Delivery_Zones WHERE zone_id = ?',
              [zone_id]
          );

          if (existingZones.length > 0) {
              return res.status(400).json({ message: 'Zone ID already exists' });
          }

          // Insert new zone
          await db.execute(
              'INSERT INTO Delivery_Zones (zone_id, zone_name, manager, deliveries) VALUES (?, ?, ?, ?)',
              [zone_id, zone_name, manager, deliveries]
          );

          res.status(201).json({ message: 'Delivery zone added successfully' });
      } catch (error) {
          console.error('Error adding delivery zone:', error);
          res.status(500).json({ message: 'Error adding delivery zone' });
      }
  });

  // Update delivery zone
  router.put('/delivery-zones/:id', async (req, res) => {
      try {
          const { zone_name, manager, deliveries } = req.body;
          const zone_id = req.params.id;

          // Validate input
          if (!zone_name || !manager || deliveries === undefined) {
              return res.status(400).json({ message: 'All fields are required' });
          }

          // Check if zone exists
          const [existingZone] = await db.execute(
              'SELECT zone_id FROM Delivery_Zones WHERE zone_id = ?',
              [zone_id]
          );

          if (existingZone.length === 0) {
              return res.status(404).json({ message: 'Zone not found' });
          }

          // Update zone
          await db.execute(
              'UPDATE Delivery_Zones SET zone_name = ?, manager = ?, deliveries = ? WHERE zone_id = ?',
              [zone_name, manager, deliveries, zone_id]
          );

          res.json({ message: 'Delivery zone updated successfully' });
      } catch (error) {
          console.error('Error updating delivery zone:', error);
          res.status(500).json({ message: 'Error updating delivery zone' });
      }
  });

  // Delete delivery zone
  router.delete('/delivery-zones/:id', async (req, res) => {
      try {
          const zone_id = req.params.id;
          await db.execute('DELETE FROM Delivery_Zones WHERE zone_id = ?', [zone_id]);
          res.json({ message: 'Delivery zone deleted successfully' });
      } catch (error) {
          console.error('Error deleting delivery zone:', error);
          res.status(500).json({ message: 'Error deleting delivery zone' });
      }
  });

  module.exports = router;
} else {
  // Client-side code: define DeliveryZonesManager so that your HTML can instantiate it.
  class DeliveryZonesManager {
    constructor() {
      console.log('Client-side DeliveryZonesManager initialized');
      // Optionally, add code to load data or initialize the map
    }
    // Example method for editing a zone (called when you press "Edit")
    editZone(zoneId) {
      // For demonstration, simply show the edit modal.
      const modalElem = document.getElementById('editZoneModal');
      if (modalElem) {
        const modal = new bootstrap.Modal(modalElem);
        // You could also populate the modal fields here
        modal.show();
      } else {
        console.error('Edit modal element not found');
      }
    }
    // You can add further client-side methods as needed.
  }
  window.DeliveryZonesManager = DeliveryZonesManager;
}
