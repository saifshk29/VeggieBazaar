# 🥦 FreshBulk - Bulk Vegetable & Fruit Ordering Platform

FreshBulk is a full-stack web application that allows customers to order fresh vegetables and fruits in bulk directly from farms. The platform is designed for restaurants, grocery stores, and large families to easily place and track bulk produce orders.

![FreshBulk Screenshot](screenshot.png)

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse through a variety of fresh vegetables and fruits
- **Category Filtering**: Filter products by category (All, Vegetables, Fruits)
- **Search Functionality**: Search for specific products by name or category
- **Shopping Cart**: Add products to cart and manage quantities
- **Order Placement**: Place bulk orders with delivery details
- **Order Tracking**: Track order status through a unique order ID

### Admin Features
- **Secure Admin Login**: Protected admin dashboard with authentication
- **Order Management**: View all orders with customer details
- **Order Status Updates**: Update order status from Pending → In Progress → Delivered
- **Inventory Management**: Add, edit, and remove products from the catalog
- **Product Analytics**: View product performance and sales metrics (coming soon)

## 🛠️ Technology Stack

### Frontend
- **React**: UI library for building the user interface
- **TypeScript/JavaScript**: Programming language
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: High-quality UI components
- **TanStack Query**: Data fetching and state management
- **Wouter**: Lightweight routing solution
- **Zod**: Schema validation

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **In-memory Storage**: Fast data storage (upgradable to PostgreSQL)
- **Session Management**: Express-session with MemoryStore
- **API**: RESTful API design

## 📋 Getting Started

### Prerequisites
- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/freshbulk.git
   cd freshbulk
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## 🔒 Admin Access

To access the admin dashboard, use the following credentials:

- **Username**: admin
- **Password**: admin123

## 🌟 Project Structure

```
/
├── client/              # Frontend code
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and APIs
│   │   ├── pages/       # Main page components
│   │   └── App.jsx      # Main application component
│   └── index.html       # HTML entry point
├── server/              # Backend code
│   ├── index.js         # Server entry point
│   ├── routes.js        # API routes
│   ├── storage.js       # Data storage implementation
│   └── vite.js          # Vite server integration
└── shared/              # Shared code between frontend and backend
    └── schema.js        # Data schemas and validations
```

## 🔄 API Endpoints

### Products API
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Orders API
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:orderId` - Get a specific order
- `POST /api/orders` - Place a new order
- `PUT /api/orders/:orderId/status` - Update order status (admin only)

### Admin API
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/session` - Check admin session status

## 🚀 Deployment Guide

### Vercel Deployment

FreshBulk is configured for seamless deployment on Vercel. Follow these steps to deploy your application:

1. **Fork or Clone the Repository**
   - Ensure you have a copy of the project in your GitHub account

2. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com) if you don't have an account
   - Connect your GitHub account to Vercel

3. **Import Your Repository**
   - Click "Add New" → "Project" in your Vercel dashboard
   - Select the FreshBulk repository
   - Vercel will automatically detect the project configuration

4. **Configure Environment Variables**
   - Set `NODE_ENV` to `production`
   - Add any other required environment variables

5. **Deploy Settings**
   - Build Command: Vercel will use the `vercel-build` script
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Deploy**
   - Click "Deploy" and wait for the build to complete
   - Vercel will provide you with a deployment URL

7. **Custom Domain (Optional)**
   - Configure a custom domain in the Vercel project settings
   - Follow Vercel's instructions to set up DNS records

### Important Deployment Files

The project includes several files specifically for deployment:

- **`vercel.json`**: Configures build settings and routing for Vercel
- **`vercel-package.json`**: Contains optimized build scripts for Vercel deployment
- **`tsconfig.server.json`**: TypeScript configuration for server compilation

## 📝 Future Improvements

- User authentication for customers
- Order history for registered customers
- Email notifications for order updates
- Payment integration
- Analytics dashboard for admins
- Mobile application

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed as part of a Full-Stack Developer Internship Assignment