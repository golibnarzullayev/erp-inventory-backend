# ERP Inventory Backend

This is the backend for an ERP inventory management system, built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: User registration and login with JWT.
- **Product Management**: CRUD operations for products, including variants.
- **Inventory Tracking**: Real-time stock management with support for serialized, lot-tracked, and expirable items.
- **Purchase Receipts**: Create, confirm, and cancel purchase receipts to manage incoming stock.
- **Sales**: Create, confirm, and cancel sales to manage outgoing stock.
- **Dashboard**: Endpoints for sales summaries, daily sales charts, top products, and inventory summaries.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd erp-inventory-backend
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the root of the project and add the following environment variables:
    ```
    PORT=3000
    MONGO_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

The server will be running on `http://localhost:3000`.

## API Documentation

The API documentation is available at `/api-docs` when the server is running. It is generated using Swagger and provides detailed information about all available endpoints.
