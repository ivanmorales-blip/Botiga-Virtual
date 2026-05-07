import React, { useEffect, useState, useCallback } from "react";
import { getCart, removeFromCart, updateCart } from "../../utils/cart.js";
import "../../../../scss/Carrito.scss";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👤 USER
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/auth/user-bridge", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        setUser(res.ok ? await res.json() : null);
      } catch {
        setUser(null);
      }
    };

    loadUser();
  }, []);

  // 📦 PRODUCTS
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/productos", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  // 🧠 LOAD CART + ENRICH
const loadCart = useCallback(async () => {
  try {
    const rawCart = await getCart();

    const enriched = await Promise.all(
      rawCart.map(async (item) => {
        const res = await fetch(
          `/api/catalog-item?id=${item.id}&isPack=${item.isPack ? 1 : 0}`,
          {
            credentials: "include",
            headers: { Accept: "application/json" },
          }
        );

        const data = await res.json();

        return {
          id: item.id,
          isPack: item.isPack,
          quantity: item.quantity,

          // 👇 ALWAYS from backend now
          nombre: data.nombre,
          precio: data.precio,
          imagen: data.imagen
            ? `/storage/${data.imagen}`
            : null,
        };
      })
    );

    setCart(enriched);
  } catch (err) {
    console.error("Cart load error:", err);
    setCart([]);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    if (products.length > 0) loadCart();
  }, [products, loadCart]);

  // 🧮 TOTAL
  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.precio,
    0
  );

  // 🗑 REMOVE
  const handleRemove = async (id, isPack) => {
    await removeFromCart(id, isPack);

    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.isPack === isPack)
      )
    );
  };

  // 🔄 UPDATE
  const handleUpdate = async (id, isPack, qty) => {
    const safeQty = Math.max(1, parseInt(qty) || 1);

    await updateCart(id, safeQty, isPack);

    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.isPack === isPack
          ? { ...item, quantity: safeQty }
          : item
      )
    );
  };

  // 💳 CHECKOUT
  const handleCheckout = async () => {
  try {
    if (!user?.id) {
      alert("Debes iniciar sesión");
      return;
    }

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");

    if (!csrfToken) {
      throw new Error("CSRF token not found in page");
    }

    const res = await fetch("/pedido", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRF-TOKEN": csrfToken,
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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || data?.error || "Error al crear pedido");
    }

    window.location.href = `/paypal/pay/${data.pedido_id}`;
  } catch (err) {
    console.error("Checkout error:", err);
    alert(err.message);
  }
};
  // ⏳ LOADING
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
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.isPack}`}
                className="cart-item"
              >
                <div className="cart-info">
                  {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} />
                  ) : (
                    <span>📦</span>
                  )}

                  <span>
                    {item.isPack ? "📦 PACK - " : ""}
                    {item.nombre}
                  </span>
                </div>

                <span>{item.precio} €</span>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdate(
                      item.id,
                      item.isPack,
                      e.target.value
                    )
                  }
                />

                <button
                  onClick={() =>
                    handleRemove(item.id, item.isPack)
                  }
                >
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