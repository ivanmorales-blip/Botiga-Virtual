import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCart } from "../../utils/cart.js";
import "../../../../scss/Carrito.scss";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
    const cartData = await getCart();
    const products = await fetch("/api/productos").then(res => res.json());

    const enriched = cartData.map(item => {
      const product = products.find(p => p.id === item.id);

      return {
        ...item,
        nombre: product?.nombre || "Producto",
        precio: product?.precio || 0,
        imagen: product?.imagen || null
      };
    });

    setCart(enriched);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (id) => {
    await removeFromCart(id);
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdate = async (id, quantity) => {
    const safeQty = quantity || 1;

    await updateCart(id, safeQty);

    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: safeQty } : item
      )
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.precio,
    0
  );

  return (
    <div className="cart-page">
      <h1>Carrito</h1>

      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map(item => (
              <div key={item.id} className="cart-item">

                <div className="cart-info">
                  {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} />
                  ) : (
                    <span>📦</span>
                  )}
                  <span>{item.nombre}</span>
                </div>

                <span className="price">{item.precio} €</span>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdate(item.id, parseInt(e.target.value) || 1)
                  }
                />

                <button onClick={() => handleRemove(item.id)}>
                  Eliminar
                </button>

              </div>
            ))}
          </div>

          <div className="cart-total">
            Total: {total.toFixed(2)} €
          </div>
        </>
      )}
    </div>
  );
}