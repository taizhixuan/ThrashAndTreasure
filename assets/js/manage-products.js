class ProductManager {
    constructor() {
        this.initializeEventListeners();
        this.loadProducts();
    }

    initializeEventListeners() {
        // Add Product Form Handler
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddProduct();
            });
        }

        // Search functionality
        const searchInput = document.querySelector('input[placeholder="Search products..."]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Add Edit Product Form Handler
        const editProductForm = document.getElementById('editProductForm');
        if (editProductForm) {
            editProductForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleEditProduct();
            });
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('/api/seller/products', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Important for authentication
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch products');
            }

            const products = await response.json();
            console.log('Products loaded:', products); // Debug log
            this.displayProducts(products);
        } catch (error) {
            console.error('Detailed error loading products:', error);
            const tableBody = document.querySelector('.table tbody');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-danger">
                            <p>Error loading products: ${error.message}</p>
                            <small class="text-muted">Please try refreshing the page or contact support if the problem persists.</small>
                        </td>
                    </tr>
                `;
            }
        }
    }

    displayProducts(products) {
        const tableBody = document.querySelector('.table tbody');
        if (!tableBody) {
            console.error('Table body element not found');
            return;
        }

        if (!Array.isArray(products) || products.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <p class="text-muted mb-0">No products found</p>
                        <small>Click "Add New Product" to create one.</small>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = products.map(product => {
            // Handle image path
            const imagePath = product.image_url 
                ? (product.image_url.startsWith('http') ? product.image_url : `../../../${product.image_url}`)
                : '../../../assets/images/default-product.jpg';
            
            return `
                <tr>
                    <td>
                        <div class="d-flex px-2 py-1">
                            <div>
                                <img src="${imagePath}" 
                                     class="avatar avatar-sm me-3" 
                                     alt="${product.name}"
                                     onerror="this.src='../../../assets/images/default-product.jpg'">
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                                <h6 class="mb-0 text-sm">${product.name}</h6>
                                <p class="text-xs text-secondary mb-0">${product.sku}</p>
                            </div>
                        </div>
                    </td>
                    <td class="text-sm">${product.category}</td>
                    <td class="text-sm">RM ${parseFloat(product.price).toFixed(2)}</td>
                    <td class="text-sm">${product.stock_quantity}</td>
                    <td class="text-center">
                        <span class="badge badge-sm bg-${this.getStatusColor(product.status)}">${product.status}</span>
                    </td>
                    <td class="text-sm">
                        <button class="btn btn-link text-primary px-3 mb-0" onclick="productManager.editProduct(${product.product_id})">
                            <i class="bi bi-pencil-square me-2"></i>Edit
                        </button>
                        <button class="btn btn-link text-danger px-3 mb-0" onclick="productManager.deleteProduct(${product.product_id})">
                            <i class="bi bi-trash me-2"></i>Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    getStatusColor(status) {
        switch (status) {
            case 'Active': return 'success';
            case 'Low Stock': return 'warning';
            case 'Out of Stock': return 'danger';
            default: return 'secondary';
        }
    }

    async handleAddProduct() {
        const form = document.getElementById('addProductForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        try {
            const imageInput = document.getElementById('productImage');
            let imageUrl = '';

            // Handle image upload if a file is selected
            if (imageInput.files && imageInput.files[0]) {
                const formData = new FormData();
                formData.append('image', imageInput.files[0]);

                // Upload image first
                const imageUploadResponse = await fetch('/api/seller/upload-image', {
                    method: 'POST',
                    body: formData
                });

                if (!imageUploadResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                const imageData = await imageUploadResponse.json();
                imageUrl = imageData.imageUrl;
            }

            const formData = {
                sku: document.getElementById('sku').value,
                name: document.getElementById('productName').value,
                category: document.getElementById('category').value,
                price: parseFloat(document.getElementById('price').value),
                stock_quantity: parseInt(document.getElementById('stockQuantity').value),
                status: document.getElementById('status').value,
                description: document.getElementById('description').value,
                image_url: imageUrl
            };

            const response = await fetch('/api/seller/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            await this.loadProducts();
            const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
            modal.hide();
            form.reset();
            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert(error.message || 'Error adding product');
        }
    }

    async deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`/api/seller/products/${productId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }

                await this.loadProducts();
                alert('Product deleted successfully!');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product');
            }
        }
    }

    handleSearch(searchTerm) {
        const tableRows = document.querySelectorAll('.table tbody tr');
        searchTerm = searchTerm.toLowerCase();

        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    async editProduct(productId) {
        try {
            const response = await fetch(`/api/seller/products/${productId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }

            const product = await response.json();
            
            // Populate the edit form
            document.getElementById('editProductId').value = product.product_id;
            document.getElementById('editProductName').value = product.name;
            document.getElementById('editSku').value = product.sku;
            document.getElementById('editCategory').value = product.category;
            document.getElementById('editPrice').value = product.price;
            document.getElementById('editStockQuantity').value = product.stock_quantity;
            document.getElementById('editStatus').value = product.status;
            document.getElementById('editDescription').value = product.description;

            // Handle image preview
            const currentProductImage = document.getElementById('currentProductImage');
            if (product.image_url) {
                currentProductImage.src = product.image_url.startsWith('http') 
                    ? product.image_url 
                    : `../../../${product.image_url}`;
                currentProductImage.style.display = 'block';
            } else {
                currentProductImage.style.display = 'none';
            }

            // Show the modal
            const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
            editModal.show();

        } catch (error) {
            console.error('Error fetching product details:', error);
            alert('Error loading product details');
        }
    }

    async handleEditProduct() {
        const form = document.getElementById('editProductForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        try {
            const productId = document.getElementById('editProductId').value;
            const imageInput = document.getElementById('editProductImage');
            let imageUrl = document.getElementById('currentProductImage').src;

            // Convert relative URL to path format if needed
            if (imageUrl.includes(window.location.origin)) {
                imageUrl = imageUrl.split(window.location.origin)[1];
            }

            // Handle image upload if a new file is selected
            if (imageInput.files && imageInput.files[0]) {
                const formData = new FormData();
                formData.append('image', imageInput.files[0]);

                const imageUploadResponse = await fetch('/api/seller/upload-image', {
                    method: 'POST',
                    body: formData
                });

                if (!imageUploadResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                const imageData = await imageUploadResponse.json();
                imageUrl = imageData.imageUrl;
            }

            const formData = {
                name: document.getElementById('editProductName').value,
                category: document.getElementById('editCategory').value,
                price: parseFloat(document.getElementById('editPrice').value),
                stock_quantity: parseInt(document.getElementById('editStockQuantity').value),
                status: document.getElementById('editStatus').value,
                description: document.getElementById('editDescription').value,
                image_url: imageUrl
            };

            console.log('Updating product with data:', formData); // Debug log

            const response = await fetch(`/api/seller/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }

            await this.loadProducts();
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
            modal.hide();
            form.reset();
            alert('Product updated successfully!');
        } catch (error) {
            console.error('Error updating product:', error);
            alert(error.message || 'Error updating product');
        }
    }
}

// Initialize the product manager
const productManager = new ProductManager(); 