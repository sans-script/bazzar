"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchProducts } from "./lib/fetchProducts";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    const getCartItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cart/1"); // Corrigido para corresponder à rota do backend
        if (!response.ok) {
          throw new Error("Erro ao buscar itens do carrinho");
        }
        const data = await response.json();
        setCartItems(data);

      } catch (error) {
        console.error("Erro ao buscar itens do carrinho:", error);
      }
    };

    getProducts();
    getCartItems();
    
  }, []);

  // Função para adicionar um item ao carrinho
  const handleAddToCart = async (productId, quantity) => {
    try {
      const userId = 1; // Substitua pelo ID do usuário real

      // Verifique se quantity é um número válido
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("Quantidade inválida");
      }

      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          quantity,
        }),
      });

      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error("Erro ao adicionar ao carrinho");
      }

      // Analisar a resposta JSON
      const result = await response.json();
      console.log(result.message); // Exibir mensagem de sucesso

      // Atualizar o estado ou fazer outra ação conforme necessário
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error.message);
    }
    console.log(cartItems);
  };

  return (
    <main className="flex flex-col w-screen h-screen">
      <div>
        <h1>Produtos</h1>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <p>{product.image_url}</p>
              <Image
                src={`http://localhost:5000/${product.image_url}`} // URL direta para a imagem
                alt={product.name}
                width={200} // Largura da imagem
                height={200} // Altura da imagem
              />
              <button onClick={() => handleAddToCart(product.id, 5)}>
                Adicionar ao Carrinho
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Meu Carrinho</h1>
        <ul>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <li key={item.id}>
                <h2>{item.name}</h2>
                <p>${item.price}</p>
                <Image
                  src={`http://localhost:5000/${item.image_url}`} // Certifique-se de que o caminho da imagem está correto
                  alt={item.name}
                  width={200}
                  height={200}
                />
                <p>Quantidade: {item.quantity}</p>
              </li>
            ))
          ) : (
            <p>Seu carrinho está vazio.</p>
          )}
        </ul>
      </div>
    </main>
  );
}