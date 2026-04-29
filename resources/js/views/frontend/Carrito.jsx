import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCart } from "../../utils/cart.js";
import "../../../../scss/Carrito.scss";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(undefined);

  // 👤 USER (SESSION STORAGE)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    } catch (err) {
      console.error("User parse error:", err);
      setUser(null);
    }
  }, []);

  // 📦 LOAD PRODUCTS
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/productos", {
          credentials: "include",
          headers: {
            Accept: "application/json"
          }
        });

        const text = await res.text();

        const data = JSON.parse(text);

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Products load error:", err);
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  // 🛒 LOAD CART (WHEN PRODUCTS READY)
  useEffect(() => {
    const loadCart = async () => {
      if (!products.length) return;

      try {
        const cartData = await getCart();

        console.log("🛒 RAW CART DATA:", cartData);

        const enriched = cartData.map(item => {
          const product = products.find(p => p.id === item.id);

          return {
            id: item.id,
            quantity: item.quantity,
            isPack: item.isPack,
            nombre: product?.nombre || "Producto",
            precio: product?.precio || 0,
            imagen: product?.imagen || null
          };
        });

        setCart(enriched);
      } catch (err) {
        console.error("Cart load error:", err);
      }
    };

    loadCart();
  }, [products]);

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      const updated = await getCart();
      setCart(updated);
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  // 🔄 UPDATE ITEM
  const handleUpdate = async (id, quantity) => {
    try {
      await updateCart(id, Math.max(1, quantity || 1));
      const updated = await getCart();
      setCart(updated);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleCheckout = async () => {
    console.log();

    try {
      if (!user) {
        alert("Debes iniciar sesión");
        return;
      }

      const cleanCart = cart.map(({ id, quantity, isPack }) => ({
        id,
        quantity,
        isPack
      }));


      const res = await fetch("/api/pedido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          cart: cleanCart,
          usuari_id: user.id,
          direccio: "Dirección del usuario",
          telefon: "123456789",
          email: "test@email.com"
        })
      });

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.error("❌ JSON parse error:", e);
        throw new Error("Invalid JSON from backend");
      }

      console.log("📦 PARSED BACKEND RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Error al crear pedido");
      }

      alert("Pedido creado correctamente");

      sessionStorage.removeItem("cart");
      setCart([]);

    } catch (err) {
      console.error("❌ Checkout error:", err);
      alert(err.message);
    }
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
              <div key={`${item.id}-${item.isPack}`} className="cart-item">

                <div className="cart-info">
                  {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} />
                  ) : (
                    <span>📦</span>
                  )}
                  <span>{item.nombre}</span>
                </div>

                <span>{item.precio} €</span>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdate(item.id, parseInt(e.target.value))
                  }
                />

                <button onClick={() => handleRemove(item.id)}>
                  Eliminar
                </button>

              </div>
            ))}
          </div>

          <div className="cart-total">
            <strong>Total: {total.toFixed(2)} €</strong>

            <button onClick={handleCheckout}>
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}