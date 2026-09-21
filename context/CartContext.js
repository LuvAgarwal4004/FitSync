"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [animateCart, setAnimateCart] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  


  // add item
  const addToCart = (itemId) => {

    if (!itemId) return;
    const id = String(itemId); // 🔥 FORCE STRING

    setCart((prev) => {
      const existing = prev.find(item => item.id === id);

      if (existing) {
        return prev.map(item =>
          item.id === id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { id, qty: 1 }];
    });

    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 300);
  };
  const updateTimers = useRef({});

 const increaseQty = (id) => {
  let newQty;

  setCart(prev =>
    prev.map(item => {
      if (item.id === id) {
        newQty = item.qty + 1;
        return { ...item, qty: newQty };
      }
      return item;
    })
  );

  clearTimeout(updateTimers.current[id]);

  updateTimers.current[id] = setTimeout(() => {
    fetch("/api/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // email: session.user.email,
        productId: id,
        qty: newQty
      })
    });
  }, 400);
};


const decreaseQty = (id) => {
  let newQty;

  setCart(prev =>
    prev
      .map(item => {
        if (item.id === id) {
          newQty = item.qty - 1;
          return { ...item, qty: newQty };
        }
        return item;
      })
      .filter(item => item.qty > 0)
  );

  clearTimeout(updateTimers.current[id]);

  updateTimers.current[id] = setTimeout(() => {
    if (newQty <= 0) {
      fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // email: session.user.email,
          productId: id
        })
      });
    } else {
      fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // email: session.user.email,
          productId: id,
          qty: newQty
        })
      });
    }
  }, 400);
};
  // remove item
 const removeFromCart = async (id) => {
  const oldCart = [...cart];

  setCart(prev => prev.filter(item => item.id !== id));

  try {
    await fetch("/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // email: session.user.email,
        productId: id
      })
    });
  } catch (err) {
    // revert if failed
    setCart(oldCart);
  }
};
useEffect(() => {
  if (!session) {
    setCart([]); // IMPORTANT
  }
}, [session]);

  return (
    <CartContext.Provider value={{ cart,setCart, addToCart, removeFromCart, increaseQty,
     decreaseQty, animateCart, loading, setLoading  }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);