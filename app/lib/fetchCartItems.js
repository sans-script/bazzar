export const fetchCartItems = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://bazzar-39eb.onrender.com/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar itens do carrinho");
    }

    const cartItems = await response.json();
    return cartItems;
  } catch (error) {
    console.error("Erro ao buscar itens do carrinho:", error);
    return [];
  }
};
