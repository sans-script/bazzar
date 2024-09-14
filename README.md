# Bazzar - E-commerce Full-Stack Application

**Bazzar** is a full-stack e-commerce application built to explore React using **Next.js** for the frontend and **Express.js** for the backend. This project features a product catalog that users can interact with and a shopping cart for managing their selected items. The application is entirely custom-built, with its name and design conceived by me. Bazzar represents an idea I had for an e-commerce platform, and it’s now a reality.

## Features
- **Product Catalog**: Browse and add various products to your shopping cart.
- **User Authentication**: Secure login and session management using **JWT (JSON Web Tokens)**.
- **Shopping Cart**: Add, remove, and update product quantities in your cart.
- **PostgreSQL Integration**: Utilizes advanced SQL concepts for managing user data, product details, and cart operations.

## Authentication with JWT
JWTs are essential for managing authentication securely. Unlike traditional session storage, JWTs allow us to generate a token upon successful login. This token is sent to the client and stored locally (in localStorage or cookies). It is then used to authenticate future requests, ensuring that sensitive user information is securely transmitted between the client and the server. This method enhances the scalability and security of the application, especially in multi-device environments.

## Exploring Advanced SQL Concepts
During the development of this project, I explored advanced SQL techniques to ensure efficient data management. Key concepts implemented include:
- **Join Queries**: To fetch user-specific cart data by combining the products and cart tables.
- **Transactions and Concurrency**: To ensure data updates (e.g., cart modifications) are handled atomically and without conflicts.
- **Parameterized Queries**: To protect against SQL injection attacks and maintain database security.

Here is an example of an advanced SQL query used to retrieve a user's cart items:

```sql
SELECT c.id, c.product_id, p.name, p.description, p.price, c.quantity, p.image_url
FROM cart c
JOIN products p ON c.product_id = p.id
WHERE c.user_id = $1;
```

## Product Management
The product catalog is managed by inserting products directly into the PostgreSQL database. Below is an example SQL command used to insert products:

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

**Please note:** Since the backend is hosted on a platform with a free plan, occasional issues or downtime may occur. I will do my best to keep the project online and address any problems promptly.
