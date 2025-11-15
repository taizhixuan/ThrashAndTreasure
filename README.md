# Thrash and Treasure

A comprehensive full-stack e-commerce platform for vintage and antique items, connecting sellers with buyers through a secure and feature-rich marketplace.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [User Roles](#user-roles)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

Thrash and Treasure is a modern marketplace platform designed specifically for vintage and antique items. The platform provides a complete ecosystem for sellers to list their products, buyers to discover unique items, logistics providers to manage deliveries, and administrators to oversee operations.

## Features

### For Buyers
- Browse and search vintage products
- Advanced filtering and categorization
- Shopping cart and wishlist functionality
- Secure checkout process with multiple payment options
- Real-time order tracking
- Product reviews and ratings
- Issue reporting and dispute resolution

### For Sellers
- Product listing and management
- Inventory tracking
- Order processing and fulfillment
- Sales analytics and performance metrics
- Customer messaging system
- Promotion and discount management
- Returns and refunds handling

### For Logistics
- Delivery task assignment and management
- Real-time delivery tracking
- Route optimization for delivery zones
- Issue resolution and status updates
- Performance monitoring
- Communication with buyers and sellers

### For Administrators
- User management across all roles
- Product approval and moderation
- Delivery zone configuration
- Dispute resolution
- System-wide analytics and reporting
- Performance monitoring
- Notification management

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL / MySQL (via Sequelize ORM)
- **Authentication:** JWT (JSON Web Tokens) + bcrypt
- **Session Management:** express-session
- **Email Service:** Nodemailer
- **File Uploads:** Multer

### Frontend
- **HTML5** for structure
- **CSS3** for styling (including Material Dashboard)
- **Vanilla JavaScript** for interactivity
- **AJAX** for asynchronous API calls

### DevOps & Tools
- **Database Migrations:** Sequelize CLI
- **Development:** Nodemon for auto-restart
- **Security:** CORS, cookie-parser
- **Environment Management:** dotenv

## Project Structure

```
ThrashAndTreasure/
├── assets/                    # Static assets
│   ├── css/                   # Stylesheets
│   ├── js/                    # Client-side JavaScript
│   └── images/                # Images and media files
├── config/                    # Configuration files
│   ├── database.js            # Database configuration
│   ├── config.js              # Sequelize config
│   └── migrations/            # Database migrations
├── controllers/               # Business logic controllers
│   ├── authController.js      # Authentication logic
│   └── adminController.js     # Admin operations
├── middleware/                # Express middleware
│   ├── auth.js                # Authentication middleware
│   └── adminMiddleware.js     # Admin authorization
├── models/                    # Sequelize models
│   └── User.js                # User model
├── pages/                     # HTML pages
│   ├── admin/                 # Admin dashboard pages
│   ├── buyer/                 # Buyer interface pages
│   ├── seller/                # Seller dashboard pages
│   ├── logistics/             # Logistics dashboard pages
│   └── common/                # Shared pages (login, register, etc.)
├── server/                    # Server-side code
│   ├── routes/                # API routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── admin/             # Admin routes
│   │   ├── seller/            # Seller routes
│   │   ├── buyer/             # Buyer routes
│   │   └── logistics/         # Logistics routes
│   └── config/                # Server configuration
├── utils/                     # Utility functions
│   └── emailService.js        # Email service utilities
├── templates/                 # Email templates
├── server.js                  # Main server entry point
├── app.js                     # Express app configuration
└── package.json               # Project dependencies
```

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **PostgreSQL** (v12 or higher) or **MySQL** (v8 or higher)
- **Git**

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ThrashAndTreasure.git
cd ThrashAndTreasure
```

2. Install dependencies:
```bash
npm install
```

### Database Setup

1. Create a new database:
```sql
CREATE DATABASE thrash_and_treasure;
```

2. Initialize the database:
```bash
npm run db:init
```

3. Run migrations:
```bash
npm run db:migrate
```

To rollback the last migration:
```bash
npm run db:migrate:undo
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=thrash_and_treasure
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DIALECT=postgres

# Session Configuration
SESSION_SECRET=your_session_secret_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./assets/images/products
```

## Usage

### Development Mode

Start the server with auto-restart on file changes:
```bash
npm run dev
```

### Production Mode

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Default Routes

- **Home/Login:** `http://localhost:3000`
- **Register:** `http://localhost:3000/register`
- **Admin Dashboard:** `http://localhost:3000/pages/admin/admin-dashboard.html`
- **Seller Dashboard:** `http://localhost:3000/pages/seller/seller-dashboard.html`
- **Buyer Dashboard:** `http://localhost:3000/pages/buyer/buyer-dashboard.html`
- **Logistics Dashboard:** `http://localhost:3000/pages/logistics/logistics-dashboard.html`

## User Roles

The platform supports four distinct user roles:

1. **Admin** - Full system access, user management, and oversight
2. **Seller** - Product management, order processing, inventory control
3. **Buyer** - Product browsing, purchasing, order tracking
4. **Logistics** - Delivery management, route optimization, task handling

## API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
GET    /api/auth/verify-email      # Email verification
POST   /api/auth/forgot-password   # Password reset request
```

### Admin Endpoints

```
GET    /api/admin/users            # Get all users
PUT    /api/admin/users/:id        # Update user
DELETE /api/admin/users/:id        # Delete user
GET    /api/admin/delivery-zones   # Get delivery zones
POST   /api/admin/delivery-zones   # Create delivery zone
PUT    /api/admin/delivery-zones/:id # Update delivery zone
DELETE /api/admin/delivery-zones/:id # Delete delivery zone
```

### Seller Endpoints

```
GET    /api/seller/products        # Get seller's products
POST   /api/seller/products        # Create new product
PUT    /api/seller/products/:id    # Update product
DELETE /api/seller/products/:id    # Delete product
GET    /api/seller/orders          # Get seller's orders
PUT    /api/seller/orders/:id      # Update order status
```

### Buyer Endpoints

```
GET    /api/buyer/products         # Browse products
GET    /api/buyer/products/:id     # Get product details
POST   /api/buyer/orders           # Create order
GET    /api/buyer/orders           # Get buyer's orders
GET    /api/buyer/orders/:id       # Get order details
```

### Logistics Endpoints

```
GET    /api/logistics/deliveries   # Get assigned deliveries
PUT    /api/logistics/deliveries/:id # Update delivery status
POST   /api/logistics/issues       # Report delivery issue
```

## Contributing

We welcome contributions to improve Thrash and Treasure! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines

- Use ES6+ JavaScript features
- Follow consistent indentation (2 spaces)
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting

## License

This project is licensed under the ISC License.

---

**Thrash and Treasure** - Connecting the past with the present, one treasure at a time.
