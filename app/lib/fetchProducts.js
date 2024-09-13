export const fetchProducts = async () => {
  try {
    const response = await fetch("https://bazzar-39eb.onrender.com/api/products");
    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
