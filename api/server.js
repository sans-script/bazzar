const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;
const saltRounds = 10;

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error("JWT_SECRET is missing on .env");
  process.exit(1);
}

const corsOptions = {
  origin: "https://bazzar-sigma.vercel.app/:3000",
};
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: true
});

app.use(cors(corsOptions));

app.use(express.json());


app.use("/images", express.static(path.join(__dirname, "images")));


const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
    expiresIn: "1h",
  });
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Gera o hash da senha
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insere o usuário no banco de dados
    await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)",
      [username, email, passwordHash]
    );

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca o usuário pelo email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const user = result.rows[0];

    // Compara a senha fornecida com o hash armazenado
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Gera o token JWT
    const token = generateToken(user);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.get("/api/cart", authenticateToken, async (req, res) => {
  const { id: user_id } = req.user; // Extrai user_id do token JWT

  try {
    const result = await pool.query(
      `
      SELECT c.id, c.product_id, p.name, p.description, p.price, c.quantity, p.image_url
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.post("/api/cart", authenticateToken, async (req, res) => {
  const { product_id, quantity } = req.body;
  const { id: user_id } = req.user; // Extrai user_id do token JWT

  if (!product_id || !quantity) {
    return res
      .status(400)
      .json({ message: "Produto e quantidade são necessários" });
  }

  try {
    // Verifica se o item já está no carrinho
    const existingItem = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Atualiza a quantidade se o item já estiver no carrinho
      await pool.query(
        "UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3",
        [quantity, user_id, product_id]
      );
    } else {
      // Adiciona o item ao carrinho
      await pool.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
        [user_id, product_id, quantity]
      );
    }

    res
      .status(201)
      .json({ message: "Item adicionado ao carrinho com sucesso" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.delete("/api/cart/:product_id", authenticateToken, async (req, res) => {
  const { product_id } = req.params;
  const { id: user_id } = req.user; // Extrai user_id do token JWT

  try {
    // Remove o item do carrinho
    const result = await pool.query(
      "DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *",
      [user_id, product_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Item não encontrado no carrinho" });
    }

    res.json({ message: "Item removido do carrinho com sucesso" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.patch("/api/cart/:product_id", authenticateToken, async (req, res) => {
  const { product_id } = req.params;
  const { quantity } = req.body;
  const { id: user_id } = req.user; // Extrai user_id do token JWT

  if (quantity <= 0) {
    return res
      .status(400)
      .json({ message: "A quantidade deve ser maior que zero" });
  }

  try {
    // Atualiza a quantidade do item no carrinho
    const result = await pool.query(
      "UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *",
      [quantity, user_id, product_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Item não encontrado no carrinho" });
    }

    res.json({
      message: "Quantidade do item atualizada com sucesso",
      item: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.get("/api/cart/:product_id", authenticateToken, async (req, res) => {
  const { product_id } = req.params;
  const { id: user_id } = req.user; // Extrai user_id do token JWT

  try {
    const result = await pool.query(
      `
      SELECT c.id, c.product_id, p.name, p.description, p.price, c.quantity, p.image_url
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1 AND c.product_id = $2
      `,
      [user_id, product_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Item não encontrado no carrinho" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
