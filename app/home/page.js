"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProducts } from "../lib/fetchProducts";
import { fetchCartItems } from "../lib/fetchCartItems";

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [token, setToken] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");

    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    } else {
      router.push("/");
    }
    const getData = async () => {
      const [cartData, productData] = await Promise.all([
        fetchCartItems(),
        fetchProducts(),
      ]);

      setCartItems(cartData);
      setProducts(productData);
    };

    getData();
  }, [router]);

  const addToCart = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        throw new Error("Produto não encontrado");
      }
      const response = await fetch(
        "https://bazzar-39eb.onrender.com/api/cart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: 1,
            product_id: product.id,
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao adicionar ao carrinho");
      }
      const updatedCartItems = await fetchCartItems();
      setCartItems(updatedCartItems);

      const result = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (product_id) => {
    try {
      const response = await fetch(
        `https://bazzar-39eb.onrender.com/api/cart/${product_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao remover item do carrinho: ${response.statusText}`
        );
      }
      const updatedCartItems = await fetchCartItems();
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
    }
  };

  const decreaseQuantity = async (product_id) => {
    try {
      const response = await fetch(
        `https://bazzar-39eb.onrender.com/api/cart/${product_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao obter item do carrinho: ${response.statusText}`
        );
      }

      const item = await response.json();

      if (item.quantity <= 1) {
        await removeFromCart(product_id);
      } else {
        const newQuantity = item.quantity - 1;
        const updateResponse = await fetch(
          `https://bazzar-39eb.onrender.com/api/cart/${product_id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity: newQuantity }),
          }
        );

        if (!updateResponse.ok) {
          throw new Error(
            `Erro ao atualizar quantidade do item: ${updateResponse.statusText}`
          );
        }

        const updatedCartItems = await fetchCartItems();
        setCartItems(updatedCartItems);
      }
    } catch (error) {
      console.error("Erro ao diminuir a quantidade do item:", error);
    }
  };

  const handleCart = () => {
    setShowCart((prevShowCart) => !prevShowCart);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex relative items-start justify-center w-screen h-screen bg-[#F5F5F5] p-4 overflow-x-hidden">
      <div className="flex flex-col gap-2 lg:justify-start w-full  bg-white shadow-lg rounded-[35px] px-10 py-8 overflow-auto">
        <div className="flex w-full items-center justify-between">
          <div className="hidden lg:flex justify-center items-center border w-96 border-[#FF3300] rounded-[18px]">
            <input
              className=" w-80 p-4 outline-none "
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="w-10 h-10 rounded-full bg-[#FF3300] flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div>
            <svg
              width="227"
              height="59"
              viewBox="0 0 227 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M40.8282 34.6373H13.7415C10.9506 34.6373 8.68799 36.9321 8.68799 39.7629C8.68799 42.5935 10.9506 44.8884 13.7415 44.8884H40.8282C43.6192 44.8884 45.8818 42.5935 45.8818 39.7629C45.8818 36.9321 43.6192 34.6373 40.8282 34.6373Z"
                fill="#FF3300"
              />
              <path
                d="M40.8282 34.6373H13.7415C10.9506 34.6373 8.68799 36.9321 8.68799 39.7629C8.68799 42.5935 10.9506 44.8884 13.7415 44.8884H40.8282C43.6192 44.8884 45.8818 42.5935 45.8818 39.7629C45.8818 36.9321 43.6192 34.6373 40.8282 34.6373Z"
                fill="#FF3300"
              />
              <path
                d="M40.8282 34.6373H13.7415C10.9506 34.6373 8.68799 36.9321 8.68799 39.7629C8.68799 42.5935 10.9506 44.8884 13.7415 44.8884H40.8282C43.6192 44.8884 45.8818 42.5935 45.8818 39.7629C45.8818 36.9321 43.6192 34.6373 40.8282 34.6373Z"
                fill="#FF3300"
              />
              <path
                d="M14.6473 44.4803C11.9281 45.1182 9.21397 43.3997 8.58494 40.642L0.93263 7.087C0.303672 4.32899 1.99809 1.57601 4.71729 0.93807C7.43642 0.300133 10.1507 2.01879 10.7796 4.77674L18.4319 38.3315C19.061 41.0897 17.3665 43.8423 14.6473 44.4803Z"
                fill="#FF3300"
              />
              <path
                d="M14.6473 44.4803C11.9281 45.1182 9.21397 43.3997 8.58494 40.642L0.93263 7.087C0.303672 4.32899 1.99809 1.57601 4.71729 0.93807C7.43642 0.300133 10.1507 2.01879 10.7796 4.77674L18.4319 38.3315C19.061 41.0897 17.3665 43.8423 14.6473 44.4803Z"
                fill="#FF3300"
              />
              <path
                d="M14.6473 44.4803C11.9281 45.1182 9.21397 43.3997 8.58494 40.642L0.93263 7.087C0.303672 4.32899 1.99809 1.57601 4.71729 0.93807C7.43642 0.300133 10.1507 2.01879 10.7796 4.77674L18.4319 38.3315C19.061 41.0897 17.3665 43.8423 14.6473 44.4803Z"
                fill="#FF3300"
              />
              <path
                d="M7.0708 6.75385H48.3074V16.5951H7.0708V6.75385Z"
                fill="#FF3300"
              />
              <path
                d="M7.0708 6.75385H48.3074V16.5951H7.0708V6.75385Z"
                fill="#FF3300"
              />
              <path
                d="M7.0708 6.75385H48.3074V16.5951H7.0708V6.75385Z"
                fill="#FF3300"
              />
              <path
                d="M41.6367 19.8755H10.5072C7.71624 19.8755 5.45374 22.1703 5.45374 25.0011C5.45374 27.8319 7.71624 30.1267 10.5072 30.1267H41.6367C44.4277 30.1267 46.6903 27.8319 46.6903 25.0011C46.6903 22.1703 44.4277 19.8755 41.6367 19.8755Z"
                fill="#FF3300"
              />
              <path
                d="M41.6367 19.8755H10.5072C7.71624 19.8755 5.45374 22.1703 5.45374 25.0011C5.45374 27.8319 7.71624 30.1267 10.5072 30.1267H41.6367C44.4277 30.1267 46.6903 27.8319 46.6903 25.0011C46.6903 22.1703 44.4277 19.8755 41.6367 19.8755Z"
                fill="#FF3300"
              />
              <path
                d="M41.6367 19.8755H10.5072C7.71624 19.8755 5.45374 22.1703 5.45374 25.0011C5.45374 27.8319 7.71624 30.1267 10.5072 30.1267H41.6367C44.4277 30.1267 46.6903 27.8319 46.6903 25.0011C46.6903 22.1703 44.4277 19.8755 41.6367 19.8755Z"
                fill="#FF3300"
              />
              <path
                d="M34.8557 44.8884L41.1039 6.71655H56.7973C59.6152 6.71655 61.9121 7.12041 63.6887 7.92807C65.4647 8.73572 66.7141 9.86649 67.4369 11.3203C68.1723 12.7741 68.3804 14.4578 68.0619 16.3714C67.8043 17.8129 67.2777 19.105 66.4815 20.2482C65.6973 21.3791 64.7175 22.3235 63.5414 23.0813C62.3654 23.8267 61.0671 24.3487 59.6459 24.6469L59.572 25.0196C61.0909 25.0819 62.4325 25.4919 63.5966 26.2497C64.7726 27.0079 65.6421 28.0704 66.2057 29.437C66.7693 30.7915 66.8984 32.382 66.5919 34.2088C66.2609 36.2591 65.4465 38.0916 64.1476 39.7071C62.8613 41.3101 61.1649 42.5778 59.0573 43.5089C56.9503 44.4288 54.5123 44.8884 51.744 44.8884H34.8557ZM45.2016 37.4519H50.825C52.7727 37.4519 54.2798 37.0726 55.3455 36.3148C56.4237 35.5443 57.0606 34.488 57.2562 33.1464C57.4155 32.1647 57.3302 31.3196 56.9992 30.6114C56.6688 29.8906 56.1172 29.3378 55.3455 28.9524C54.5738 28.555 53.5996 28.3562 52.4235 28.3562H46.6352L45.2016 37.4519ZM47.646 22.4104H52.6994C53.6792 22.4104 54.5794 22.2427 55.4006 21.9073C56.2338 21.5714 56.9196 21.0871 57.4587 20.4532C58.0098 19.8197 58.3533 19.0554 58.4881 18.1606C58.6962 16.8808 58.4085 15.8743 57.6242 15.1412C56.84 14.4082 55.6947 14.0415 54.1882 14.0415H49.0057L47.646 22.4104Z"
                fill="#FF3300"
              />
              <path
                d="M25.8698 58.4201C29.3306 58.4201 32.1362 55.5745 32.1362 52.0646C32.1362 48.554 29.3306 45.7084 25.8698 45.7084C22.409 45.7084 19.6035 48.554 19.6035 52.0646C19.6035 55.5745 22.409 58.4201 25.8698 58.4201Z"
                fill="#FF3300"
              />
              <path
                d="M25.8698 58.4201C29.3306 58.4201 32.1362 55.5745 32.1362 52.0646C32.1362 48.554 29.3306 45.7084 25.8698 45.7084C22.409 45.7084 19.6035 48.554 19.6035 52.0646C19.6035 55.5745 22.409 58.4201 25.8698 58.4201Z"
                fill="#FF3300"
              />
              <path
                d="M25.8698 58.4201C29.3306 58.4201 32.1362 55.5745 32.1362 52.0646C32.1362 48.554 29.3306 45.7084 25.8698 45.7084C22.409 45.7084 19.6035 48.554 19.6035 52.0646C19.6035 55.5745 22.409 58.4201 25.8698 58.4201Z"
                fill="#FF3300"
              />
              <path
                d="M25.8698 58.4201C29.3306 58.4201 32.1362 55.5745 32.1362 52.0646C32.1362 48.554 29.3306 45.7084 25.8698 45.7084C22.409 45.7084 19.6035 48.554 19.6035 52.0646C19.6035 55.5745 22.409 58.4201 25.8698 58.4201Z"
                fill="#FF3300"
              />
              <path
                d="M25.8698 58.4201C29.3306 58.4201 32.1362 55.5745 32.1362 52.0646C32.1362 48.554 29.3306 45.7084 25.8698 45.7084C22.409 45.7084 19.6035 48.554 19.6035 52.0646C19.6035 55.5745 22.409 58.4201 25.8698 58.4201Z"
                fill="#FF3300"
              />
              <path
                d="M25.8698 58.4201C29.3306 58.4201 32.1362 55.5745 32.1362 52.0646C32.1362 48.554 29.3306 45.7084 25.8698 45.7084C22.409 45.7084 19.6035 48.554 19.6035 52.0646C19.6035 55.5745 22.409 58.4201 25.8698 58.4201Z"
                fill="#FF3300"
              />
              <path
                d="M49.7223 58.4201C53.1833 58.4201 55.9886 55.5745 55.9886 52.0646C55.9886 48.554 53.1833 45.7084 49.7223 45.7084C46.2615 45.7084 43.4559 48.554 43.4559 52.0646C43.4559 55.5745 46.2615 58.4201 49.7223 58.4201Z"
                fill="#FF3300"
              />
              <path
                d="M49.7223 58.4201C53.1833 58.4201 55.9886 55.5745 55.9886 52.0646C55.9886 48.554 53.1833 45.7084 49.7223 45.7084C46.2615 45.7084 43.4559 48.554 43.4559 52.0646C43.4559 55.5745 46.2615 58.4201 49.7223 58.4201Z"
                fill="#FF3300"
              />
              <path
                d="M49.7223 58.4201C53.1833 58.4201 55.9886 55.5745 55.9886 52.0646C55.9886 48.554 53.1833 45.7084 49.7223 45.7084C46.2615 45.7084 43.4559 48.554 43.4559 52.0646C43.4559 55.5745 46.2615 58.4201 49.7223 58.4201Z"
                fill="#FF3300"
              />
              <path
                d="M49.7223 58.4201C53.1833 58.4201 55.9886 55.5745 55.9886 52.0646C55.9886 48.554 53.1833 45.7084 49.7223 45.7084C46.2615 45.7084 43.4559 48.554 43.4559 52.0646C43.4559 55.5745 46.2615 58.4201 49.7223 58.4201Z"
                fill="#FF3300"
              />
              <path
                d="M49.7223 58.4201C53.1833 58.4201 55.9886 55.5745 55.9886 52.0646C55.9886 48.554 53.1833 45.7084 49.7223 45.7084C46.2615 45.7084 43.4559 48.554 43.4559 52.0646C43.4559 55.5745 46.2615 58.4201 49.7223 58.4201Z"
                fill="#FF3300"
              />
              <path
                d="M49.7223 58.4201C53.1833 58.4201 55.9886 55.5745 55.9886 52.0646C55.9886 48.554 53.1833 45.7084 49.7223 45.7084C46.2615 45.7084 43.4559 48.554 43.4559 52.0646C43.4559 55.5745 46.2615 58.4201 49.7223 58.4201Z"
                fill="#FF3300"
              />
              <path
                d="M77.9783 44.7375C76.0288 44.7375 74.3462 44.4102 72.9311 43.7555C71.5287 43.0877 70.5009 42.0788 69.8467 40.7293C69.2056 39.3799 69.0521 37.6964 69.3861 35.6789C69.6794 33.9688 70.2202 32.5325 71.0079 31.3701C71.8094 30.1944 72.7908 29.2391 73.9526 28.5043C75.1276 27.7694 76.4361 27.2083 77.878 26.8208C79.32 26.4333 80.829 26.1728 82.4045 26.0392C84.1666 25.8789 85.5954 25.7052 86.6902 25.5181C87.7988 25.3311 88.6266 25.0705 89.1737 24.7366C89.7214 24.3892 90.0554 23.9081 90.1751 23.2936V23.1934C90.3355 22.1646 90.1156 21.3696 89.5146 20.8085C88.9136 20.2474 88.0125 19.9668 86.8105 19.9668C85.529 19.9668 84.4336 20.2474 83.5262 20.8085C82.6181 21.3696 81.984 22.1445 81.623 23.1332L72.6504 22.8126C73.2113 20.9421 74.1726 19.272 75.5343 17.8023C76.8967 16.3193 78.6257 15.1569 80.7219 14.3152C82.8318 13.4601 85.2683 13.0326 88.0325 13.0326C89.9815 13.0326 91.7443 13.2664 93.3197 13.734C94.8951 14.1883 96.2237 14.8563 97.3053 15.7381C98.4001 16.6066 99.1815 17.6754 99.649 18.9447C100.116 20.2139 100.216 21.6636 99.9492 23.2936L96.4443 44.2164H87.231L87.9523 39.9279H87.7117C86.991 40.9695 86.1431 41.8518 85.168 42.5729C84.2067 43.2946 83.1251 43.8358 81.9238 44.1964C80.7219 44.5569 79.4065 44.7375 77.9783 44.7375ZM82.1037 38.3244C83.132 38.3244 84.1065 38.1106 85.0283 37.6831C85.9495 37.2555 86.7241 36.6676 87.3513 35.9195C87.9924 35.1579 88.3998 34.2761 88.5733 33.274L89.0339 30.348C88.7532 30.495 88.3998 30.6286 87.9724 30.7488C87.545 30.8691 87.0913 30.9827 86.61 31.0896C86.1293 31.1831 85.6355 31.2766 85.1279 31.3701C84.6341 31.4503 84.1604 31.5238 83.706 31.5906C82.7447 31.7375 81.91 31.9646 81.2025 32.272C80.495 32.5793 79.9272 32.9801 79.5005 33.4744C79.0863 33.9554 78.8325 34.5299 78.7391 35.198C78.5787 36.2 78.8124 36.9749 79.4403 37.5227C80.0676 38.0572 80.9556 38.3244 82.1037 38.3244ZM102.573 44.2164L103.474 38.6249L120.598 21.2494L120.679 21.049H106.899L108.201 13.4334H133.637L132.676 19.5659L116.673 36.4004L116.593 36.6008H130.292L129.07 44.2164H102.573ZM144.016 44.7375C142.067 44.7375 140.385 44.4102 138.97 43.7555C137.567 43.0877 136.54 42.0788 135.885 40.7293C135.244 39.3799 135.091 37.6964 135.425 35.6789C135.718 33.9688 136.259 32.5325 137.047 31.3701C137.848 30.1944 138.829 29.2391 139.991 28.5043C141.166 27.7694 142.475 27.2083 143.917 26.8208C145.359 26.4333 146.867 26.1728 148.443 26.0392C150.205 25.8789 151.634 25.7052 152.729 25.5181C153.837 25.3311 154.665 25.0705 155.212 24.7366C155.76 24.3892 156.094 23.9081 156.214 23.2936V23.1934C156.374 22.1646 156.154 21.3696 155.553 20.8085C154.952 20.2474 154.051 19.9668 152.849 19.9668C151.567 19.9668 150.472 20.2474 149.564 20.8085C148.657 21.3696 148.023 22.1445 147.662 23.1332L138.689 22.8126C139.25 20.9421 140.211 19.272 141.573 17.8023C142.935 16.3193 144.664 15.1569 146.76 14.3152C148.87 13.4601 151.307 13.0326 154.071 13.0326C156.02 13.0326 157.783 13.2664 159.358 13.734C160.934 14.1883 162.262 14.8563 163.344 15.7381C164.439 16.6066 165.22 17.6754 165.687 18.9447C166.155 20.2139 166.255 21.6636 165.988 23.2936L162.483 44.2164H153.27L153.991 39.9279H153.75C153.03 40.9695 152.182 41.8518 151.207 42.5729C150.245 43.2946 149.164 43.8358 147.962 44.1964C146.76 44.5569 145.445 44.7375 144.016 44.7375ZM148.142 38.3244C149.171 38.3244 150.145 38.1106 151.066 37.6831C151.988 37.2555 152.762 36.6676 153.39 35.9195C154.031 35.1579 154.438 34.2761 154.611 33.274L155.073 30.348C154.792 30.495 154.438 30.6286 154.011 30.7488C153.584 30.8691 153.129 30.9827 152.649 31.0896C152.168 31.1831 151.674 31.2766 151.167 31.3701C150.673 31.4503 150.199 31.5238 149.745 31.5906C148.783 31.7375 147.949 31.9646 147.241 32.272C146.534 32.5793 145.966 32.9801 145.538 33.4744C145.125 33.9554 144.871 34.5299 144.778 35.198C144.617 36.2 144.851 36.9749 145.479 37.5227C146.106 38.0572 146.994 38.3244 148.142 38.3244ZM177.064 44.7375C175.114 44.7375 173.431 44.4102 172.016 43.7555C170.615 43.0877 169.586 42.0788 168.932 40.7293C168.291 39.3799 168.137 37.6964 168.471 35.6789C168.765 33.9688 169.306 32.5325 170.094 31.3701C170.895 30.1944 171.876 29.2391 173.038 28.5043C174.213 27.7694 175.521 27.2083 176.963 26.8208C178.405 26.4333 179.914 26.1728 181.49 26.0392C183.252 25.8789 184.681 25.7052 185.776 25.5181C186.884 25.3311 187.712 25.0705 188.26 24.7366C188.807 24.3892 189.141 23.9081 189.261 23.2936V23.1934C189.421 22.1646 189.201 21.3696 188.6 20.8085C187.999 20.2474 187.098 19.9668 185.896 19.9668C184.614 19.9668 183.519 20.2474 182.611 20.8085C181.703 21.3696 181.069 22.1445 180.709 23.1332L171.736 22.8126C172.296 20.9421 173.258 19.272 174.62 17.8023C175.982 16.3193 177.711 15.1569 179.807 14.3152C181.917 13.4601 184.354 13.0326 187.118 13.0326C189.067 13.0326 190.829 13.2664 192.405 13.734C193.981 14.1883 195.31 14.8563 196.391 15.7381C197.486 16.6066 198.267 17.6754 198.734 18.9447C199.202 20.2139 199.301 21.6636 199.034 23.2936L195.529 44.2164H186.316L187.038 39.9279H186.798C186.076 40.9695 185.228 41.8518 184.254 42.5729C183.292 43.2946 182.211 43.8358 181.009 44.1964C179.807 44.5569 178.492 44.7375 177.064 44.7375ZM181.189 38.3244C182.217 38.3244 183.192 38.1106 184.114 37.6831C185.035 37.2555 185.809 36.6676 186.437 35.9195C187.078 35.1579 187.485 34.2761 187.659 33.274L188.119 30.348C187.838 30.495 187.485 30.6286 187.058 30.7488C186.63 30.8691 186.176 30.9827 185.696 31.0896C185.215 31.1831 184.721 31.2766 184.214 31.3701C183.719 31.4503 183.246 31.5238 182.791 31.5906C181.83 31.7375 180.996 31.9646 180.288 32.272C179.58 32.5793 179.013 32.9801 178.586 33.4744C178.171 33.9554 177.918 34.5299 177.824 35.198C177.664 36.2 177.898 36.9749 178.526 37.5227C179.153 38.0572 180.041 38.3244 181.189 38.3244ZM201.518 44.2164L206.645 13.4334H216.159L215.217 19.0449H215.538C216.433 17.014 217.601 15.5043 219.043 14.5156C220.485 13.5135 222.047 13.0125 223.729 13.0125C224.184 13.0125 224.637 13.0459 225.091 13.1127C225.559 13.1662 225.999 13.2463 226.413 13.3532L224.971 21.8907C224.517 21.717 223.923 21.5901 223.189 21.51C222.454 21.4164 221.787 21.3696 221.186 21.3696C220.025 21.3696 218.943 21.6302 217.942 22.1512C216.953 22.6589 216.112 23.3738 215.418 24.2956C214.737 25.2042 214.289 26.273 214.076 27.5022L211.312 44.2164H201.518Z"
                fill="#FF3300"
              />
            </svg>
          </div>

          <div className="flex items-center justify-end gap-4 w-96">
            {/* <button>
              <svg
                className="w-14 h-14"
                viewBox="0 0 70 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_15_5)">
                  <path
                    d="M70 35C70 54.33 54.33 70 35 70C15.67 70 0 54.33 0 35C0 15.67 15.67 0 35 0C54.33 0 70 15.67 70 35Z"
                    fill="#FF3300"
                  />
                  <path
                    d="M51.8244 59.5392C47.0392 62.8264 41.2442 64.75 34.9999 64.75C28.7555 64.75 22.9607 62.826 18.1754 59.5388C16.0619 58.087 15.1587 55.3217 16.3876 53.0712C18.9349 48.4057 24.1839 45.5 34.9999 45.5C45.8159 45.5 51.0649 48.406 53.6122 53.0712C54.841 55.3217 53.9377 58.0874 51.8244 59.5392Z"
                    fill="white"
                  />
                  <path
                    d="M35 35C40.7991 35 45.5 30.2992 45.5 24.5C45.5 18.7011 40.7991 14 35 14C29.2012 14 24.5001 18.7011 24.5001 24.5C24.5001 30.2992 29.2012 35 35 35Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_15_5">
                    <rect width="70" height="70" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button> */}
            <button onClick={() => handleCart()}>
              <svg
                className="w-10 h-10 lg:w-10 lg:h-10"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5996 10H44L40 24H16.7535M42 32H18L14 6H8M8 16H4M10 22H4M12 28H4M20 40C20 41.1046 19.1046 42 18 42C16.8954 42 16 41.1046 16 40C16 38.8954 16.8954 38 18 38C19.1046 38 20 38.8954 20 40ZM42 40C42 41.1046 41.1046 42 40 42C38.8954 42 38 41.1046 38 40C38 38.8954 38.8954 38 40 38C41.1046 38 42 38.8954 42 40Z"
                  stroke="#FF3300"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            {/* <div className="flex items-center justify-center border p-4 gap-4 w-70 h-14 border-[#999999] font-bold  rounded-[18px]">
              <h1 className="text-[10px] lg:text-2xl">10,000 $</h1>

              <button onClick={() => handleCart()}>
                <svg
                  className="w-5 h-5 lg:w-10 lg:h-10"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5996 10H44L40 24H16.7535M42 32H18L14 6H8M8 16H4M10 22H4M12 28H4M20 40C20 41.1046 19.1046 42 18 42C16.8954 42 16 41.1046 16 40C16 38.8954 16.8954 38 18 38C19.1046 38 20 38.8954 20 40ZM42 40C42 41.1046 41.1046 42 40 42C38.8954 42 38 41.1046 38 40C38 38.8954 38.8954 38 40 38C41.1046 38 42 38.8954 42 40Z"
                    stroke="#FF3300"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div> */}
          </div>
        </div>

        <div className="flex relative w-full h-96 overflow-hidden bg-[#FF3300] shadow-lg rounded-[35px]">
          <div className="absolute p-6 z-20">
            <h1 className="text-white font-bold text-3xl lg:text-5xl w-40 leading-[70px] italic p-4">
              Decorative Pillowcases Velvet
            </h1>
            <h2 className="text-white font-bold text-xl lg:text-3xl italic p-4">
              Bring charm and modernity to <br></br> your interior
            </h2>
          </div>

          <div className="absolute right-0 -bottom-10">
            <Image
              src="/armchair.png"
              className="opacity-75"
              alt="armchair"
              width={400}
              height={400}
            />
          </div>
        </div>
        <div className="w-full flex flex-wrap gap-4 items-center justify-around pt-5">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center justify-center border w-60 h-80 border-[#999999] rounded-[18px]"
              >
                <div className="flex w-full h-40 items-center justify-center">
                  <Image
                    src={`https://bazzar-39eb.onrender.com/${product.image_url}`}
                    alt={product.name}
                    width={110}
                    height={100}
                  />
                </div>
                <div className="p-8 w-full px-2 h-16">
                  <h1 className="font-bold w-full">{product.name}</h1>
                </div>

                <div className="flex w-full px-2 pt-8 justify-between items-center pb-4">
                  <h2 className="font-extrabold text-[#FF3300]">
                    US$ {Number(product.price).toFixed(2) || "0.00"}
                  </h2>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="bg-[#FF3300] text-white p-2 rounded-lg font-bold"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex gap-2 items-center justify-center pt-5 h-80">
              <h1 className="font-bold">
                No products found
              </h1>
              <h1 className="font-bold text-[#FF3300] text-xl">:&#40;</h1>
            </div>
          )}
        </div>

        <div
          className={
            showCart
              ? "absolute p-2 top-28 rounded-lg right-12 lg:right-14 bg-white w-[300px] lg:w-[500px] h-[400px] shadow-lg z-50 flex flex-col gap-4 overflow-auto"
              : "hidden"
          }
        >
          {cartItems.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-10 w-full h-full">
              <h1 className="font-bold text-2xl lg:text-3xl">The cart is empty 😪</h1>
              <svg
                className="w-40 h-40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 5L19 12H7.37671M20 16H8L6 3H3M11 3L13.5 5.5M13.5 5.5L16 8M13.5 5.5L16 3M13.5 5.5L11 8M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                  stroke="#FF3300"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          )}

          {cartItems.map((item) => {
            return (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between p-2 gap-2 w-full border border-[#999999] rounded-[18px]"
              >
                <div className="flex gap-1 items-center">
                  <div className="flex items-center justify-center w-8 h-8">
                    <Image
                      src={`https://bazzar-39eb.onrender.com/${item.image_url}`}
                      alt={item.name}
                      width={100}
                      height={100}
                    />
                  </div>
                  <h2 className="font-bold truncate w-40">{item.name}</h2>
                </div>

                <div className="flex gap-4 items-center justify-center">
                  <h2 className="font-bold truncate max-w-40 text-[#FF3300]">
                    US$ {item.price}
                  </h2>
                  {/* Botão de Deletar item do carrinho */}
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="w-4"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 5L19 12H7.37671M20 16H8L6 3H3M11 3L13.5 5.5M13.5 5.5L16 8M13.5 5.5L16 3M13.5 5.5L11 8M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                        stroke="#FF3300"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  {/* Botão de aumentar a quantidade em +1 */}
                  <button
                    onClick={() => addToCart(item.product_id)}
                    className="w-4"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 5L19 12H7.37671M20 16H8L6 3H3M16 5.5H13.5M13.5 5.5H11M13.5 5.5V8M13.5 5.5V3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                        stroke="#FF3300"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  {/* Botão de diminuir a quantidade em -1 ate no máximo 1 (não pode chegar a ser =< 0) */}
                  <button
                    onClick={() => decreaseQuantity(item.product_id)}
                    className="w-4"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_3_290)">
                        <path
                          d="M21 5L19 12H7.37671M20 16H8L6 3H3M16 6H11M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                          stroke="#FF3300"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_3_290">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
                <h2 className="font-bold text-xl w-10">x{item.quantity}</h2>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default Home;
