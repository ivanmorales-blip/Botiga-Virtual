import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCart } from "../../utils/cart.js";
import "../../../../scss/Carrito.scss";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👤 GET USER (Laravel session)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/auth/user-bridge", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn("User not logged in");
        setUser(null);
      }
    };

    loadUser();
  }, []);

  // 📦 PRODUCTS
  useEffect(() => {
    fetch("/api/productos", {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  // 🛒 LOAD CART
  const loadCart = async () => {
    try {
      const cartData = await getCart();

      const enriched = cartData.map(item => {
        const product = products.find(p => p.id === item.id);

        return {
          id: item.id,
          quantity: item.quantity ?? 1,
          isPack: item.isPack ?? false,
          nombre: product?.nombre || "Producto",
          precio: product?.precio || 0,
          imagen: product?.imagen || null,
        };
      });

      setCart(enriched);
    } catch (err) {
      console.error("Cart error:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length) loadCart();
  }, [products]);

  // 🗑 REMOVE
  const handleRemove = async (id) => {
    await removeFromCart(id);
    setCart(prev => prev.filter(i => i.id !== id));
  };

  // 🔄 UPDATE
  const handleUpdate = async (id, qty) => {
    const safe = Math.max(1, parseInt(qty) || 1);

    await updateCart(id, safe);

    setCart(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: safe } : i))
    );
  };

  // 💰 TOTAL
  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.precio,
    0
  );

  // 🧾 CHECKOUT (FIXED + SAFE USER)
  const handleCheckout = async () => {
    try {
      if (!user?.id) {
        alert("Debes iniciar sesión");
        return;
      }

      const res = await fetch("/api/pedido", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          usuari_id: user.id,
          cart: cart.map(({ id, quantity, isPack }) => ({
            id,
            quantity,
            isPack,
          })),
          direccio: "Dirección del usuario",
          telefon: "123456789",
          email: "test@email.com",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Error al crear pedido");
      }

      alert("Pedido creado correctamente");
      setCart([]);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ⏳ LOADING STATE (UI preserved)
  if (loading) {
    return <div className="cart-page">Cargando carrito...</div>;
  }

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
                    handleUpdate(item.id, e.target.value)
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