// Support both browser and Node.js environments
(function(global) {
    class DeliveryZonesManager {
        constructor() {
            this.modals = {};
            this.initializeModals();
            this.initializeMap();
            this.attachEventListeners();
            this.loadDeliveryZones();
        }

        initializeModals() {
            // Initialize all Bootstrap modals and store their instances
            const modalElements = document.querySelectorAll('.modal');
            modalElements.forEach(modalElement => {
                const modalId = modalElement.id;
                // Remove any existing event listeners
                modalElement.replaceWith(modalElement.cloneNode(true));
                
                const newModal = document.getElementById(modalId);
                this.modals[modalId] = new bootstrap.Modal(newModal, {
                    backdrop: true,
                    keyboard: true
                });

                // Add hidden.bs.modal event listener
                newModal.addEventListener('hidden.bs.modal', () => {
                    // Clean up backdrop and body classes
                    const backdrops = document.querySelectorAll('.modal-backdrop');
                    backdrops.forEach(backdrop => backdrop.remove());
                    document.body.classList.remove('modal-open');
                    
                    // Reset form if exists
                    const form = newModal.querySelector('form');
                    if (form) form.reset();
                });
            });
        }

        initializeMap() {
            const mapElement = document.getElementById('deliveryZonesMap');
            if (mapElement) {
                this.map = L.map('deliveryZonesMap').setView([3.1390, 101.6869], 12);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(this.map);
            }
        }

        attachEventListeners() {
            // Add Zone Form Handler
            const saveZoneBtn = document.getElementById('saveZoneBtn');
            if (saveZoneBtn) {
                saveZoneBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleSaveZone();
                });
            }

            // Edit Zone Form Handler
            const updateZoneBtn = document.getElementById('updateZoneBtn');
            if (updateZoneBtn) {
                updateZoneBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleUpdateZone();
                });
            }

            // Delete Zone Buttons
            document.querySelectorAll('.btn-link.text-danger').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleDeleteZone(e);
                });
            });

            // Modal trigger buttons
            document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetModalId = button.getAttribute('data-bs-target').replace('#', '');
                    if (this.modals[targetModalId]) {
                        // Clean up any existing backdrops first
                        const existingBackdrops = document.querySelectorAll('.modal-backdrop');
                        existingBackdrops.forEach(backdrop => backdrop.remove());
                        document.body.classList.remove('modal-open');
                        
                        // Show the modal
                        this.modals[targetModalId].show();
                    }
                });
            });
        }

        async loadDeliveryZones() {
            try {
                const response = await fetch('/api/admin/delivery-zones', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch delivery zones');
                }

                const zones = await response.json();
                this.displayDeliveryZones(zones);
            } catch (error) {
                console.error('Error loading delivery zones:', error);
                alert('Error loading delivery zones');
            }
        }

        displayDeliveryZones(zones) {
            const tbody = document.querySelector('table tbody');
            if (!zones || zones.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center py-4">
                            <p class="text-secondary mb-0">No delivery zones found. Click "Add New Zone" to create one.</p>
                        </td>
                    </tr>`;
                return;
            }

            tbody.innerHTML = zones.map(zone => `
                <tr data-zone-id="${zone.zone_id}">
                    <td class="text-xs font-weight-bold">${zone.zone_id}</td>
                    <td class="text-xs font-weight-bold" data-zone-name>${zone.zone_name}</td>
                    <td class="text-xs font-weight-bold" data-manager>${zone.manager}</td>
                    <td class="text-center text-xs font-weight-bold" data-deliveries>${zone.deliveries}</td>
                    <td class="text-center">
                        <button class="btn btn-link text-danger px-3 mb-0" onclick="deliveryZonesManager.deleteZone('${zone.zone_id}')">
                            <i class="far fa-trash-alt me-2"></i>Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        async handleSaveZone() {
            const form = document.getElementById('addZoneForm');
            if (form && form.checkValidity()) {
                try {
                    const formData = {
                        zone_id: document.getElementById('zoneId').value,
                        zone_name: document.getElementById('zoneName').value,
                        manager: document.getElementById('logisticsManager').value,
                        deliveries: parseInt(document.getElementById('deliveries').value) || 0
                    };

                    const response = await fetch('/api/admin/delivery-zones', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify(formData)
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.message || 'Failed to add zone');
                    }

                    await this.loadDeliveryZones(); // Reload the zones
                    this.modals.addZoneModal.hide();
                    form.reset();
                    alert('Zone added successfully!');
                } catch (error) {
                    console.error('Error adding zone:', error);
                    alert(error.message || 'Error adding zone');
                }
            } else {
                form.reportValidity();
            }
        }

        async handleUpdateZone() {
            const form = document.getElementById('editZoneForm');
            if (form && form.checkValidity()) {
                try {
                    const zoneId = document.getElementById('editZoneId').value;
                    const formData = {
                        zone_name: document.getElementById('editZoneName').value,
                        manager: document.getElementById('editLogisticsManager').value,
                        deliveries: parseInt(document.getElementById('editDeliveriesOnly').value) || 0
                    };

                    const response = await fetch(`/api/admin/delivery-zones/${zoneId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify(formData)
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.message || 'Failed to update zone');
                    }

                    await this.loadDeliveryZones(); // Reload the zones
                    this.modals.editZoneModal.hide();
                    form.reset();
                    alert('Zone updated successfully!');
                } catch (error) {
                    console.error('Error updating zone:', error);
                    alert(error.message || 'Error updating zone');
                }
            } else {
                form.reportValidity();
            }
        }

        editZone(zoneId) {
            // Find the zone data from the table
            const row = document.querySelector(`tr[data-zone-id="${zoneId}"]`);
            if (!row) return;

            // Populate the edit form
            document.getElementById('editZoneId').value = zoneId;
            document.getElementById('editZoneName').value = row.querySelector('[data-zone-name]').textContent;
            document.getElementById('editLogisticsManager').value = row.querySelector('[data-manager]').textContent;
            document.getElementById('editDeliveriesOnly').value = row.querySelector('[data-deliveries]').textContent;

            // Show the modal
            this.modals.editZoneModal.show();
        }

        async deleteZone(zoneId) {
            if (confirm('Are you sure you want to delete this zone?')) {
                try {
                    const response = await fetch(`/api/admin/delivery-zones/${zoneId}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete zone');
                    }

                    await this.loadDeliveryZones(); // Reload the zones
                    alert('Zone deleted successfully!');
                } catch (error) {
                    console.error('Error deleting zone:', error);
                    alert('Error deleting zone');
                }
            }
        }
    }

    // Make DeliveryZonesManager available in both browser and Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = DeliveryZonesManager;
    } else {
        global.DeliveryZonesManager = DeliveryZonesManager;
    }
})(typeof window !== 'undefined' ? window : global); 