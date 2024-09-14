# Bazzar - E-commerce Full-Stack Application

**Bazzar** is a full-stack e-commerce application designed to explore React using **Next.js** for the frontend and **Express.js** for the backend. This project features a product catalog for browsing and managing selected items through a shopping cart. The application is entirely custom-built, with its name and design created by me. Bazzar was an idea I had for an e-commerce platform some time ago, and now it’s coming to life.

## Features
- **Product Catalog**: Browse and add some products to your shopping cart.
- **User Authentication**: Secure login and session management using **JWT (JSON Web Tokens)**.
- **Shopping Cart**: Add, remove, and update product quantities in your cart.
- **PostgreSQL Integration**: Utilizes advanced SQL concepts to manage user data, product details, and cart operations.

## Authentication with JWT
JWTs are essential for secure authentication. Unlike traditional session storage, JWTs generate a token upon successful login. This token is sent to the client and stored locally (in localStorage or cookies). It is then used to authenticate future requests, ensuring sensitive user information is securely transmitted between the client and the server. This method enhances scalability and security, particularly in multi-device environments.

## Exploring Advanced SQL Concepts
Throughout this project, advanced SQL techniques were employed to ensure efficient data management. Key concepts include:
- **Join Queries**: Retrieve user-specific cart data by combining the products and cart tables.
- **Transactions and Concurrency**: Ensure data updates (e.g., cart modifications) are handled atomically and without conflicts.
- **Parameterized Queries**: Protect against SQL injection attacks and maintain database security.

Example SQL query to retrieve a user's cart items:

```sql
SELECT c.id, c.product_id, p.name, p.description, p.price, c.quantity, p.image_url
FROM cart c
JOIN products p ON c.product_id = p.id
WHERE c.user_id = $1;
```

## Product Management
The product catalog is managed by inserting products directly into the PostgreSQL database. Example SQL command for inserting products:

```sql
INSERT INTO products (name, description, price, stock, image_url)
VALUES 
    ('Men''s Backpack Material Elegant', 'A durable and elegant men''s backpack, perfect for everyday use.', 20.00, 150, 'images/backpack.png'),
    ('Headset Gamer RGB', 'High-quality RGB gaming headset with surround sound.', 50.00, 200, 'images/headset.png'),
    ('RGB Gaming Keyboard', 'Mechanical RGB gaming keyboard with customizable backlighting.', 100.00, 120, 'images/keyboard-gamer.png'),
    ('Apple iPhone 14, 128GB, Midnight', 'Apple iPhone 14 with 128GB of storage in Midnight color.', 880.00, 50, 'images/iphone.png'),
    ('Samsung Galaxy S24 Ultra, 512GB, Titanium Gray, 12GB RAM', 'The latest Samsung Galaxy S24 Ultra with 512GB storage and 12GB RAM, in Titanium Gray.', 1200.00, 30, 'images/sansungs24.png');
```

## API Endpoints

- `POST /api/register` – Register a new user.
- `POST /api/login` – Log in as an existing user.
- `POST /api/cart` – Add an item to the cart.
- `GET /api/products` – Retrieve the list of products.
- `GET /api/cart` – Manage the shopping cart.

For testing requests and exploring API endpoints, refer to the [requests.http](./requests.http) file for more details.

## Quick Login
For quick testing, use the following credentials:
- **Email**: alex@test.com
- **Password**: alex@test.com

**Please note:** Since the backend is hosted on a platform with a free plan, occasional issues or downtime may occur. I will do my best to keep the project online and address any problems promptly.