import React, { useEffect, useState } from "react";
import { getCart } from "../utils/cart";

export default function CartCounter() {
  const [count, setCount] = useState(0);

  const loadCart = async () => {
    const cart = await getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCount(total);
  };

  useEffect(() => {
    loadCart();

    const interval = setInterval(loadCart, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <a href="/cart-page" className="btn btn--secondary">
      🛒 {count}
    </a>
  );
}