import React, { useEffect, useState, useCallback } from "react";
import { getCart, removeFromCart, updateCart } from "../../utils/cart.js";
import "../../../../scss/Carrito.scss";
import { GoAlert } from "react-icons/go";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configuracions, setConfiguracions] = useState({});
  const [missatgeError, setMissatgeError] = useState("");

  const [vullInstallacio, setVullInstallacio] = useState(false);
  const [adrecessInstallacio, setAdrecessInstallacio] = useState("");

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

  // 📦 PRODUCTS + CONFIGURACIONS
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

    fetch("/api/configuracions", {
      headers: { Accept: "application/json" },
    })
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(c => { map[c.clau] = parseFloat(c.valor) || null; });
        setConfiguracions(map);
      })
      .catch(() => {});
  }, []);

  // 🧠 LOAD CART
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
            nombre: data.nombre,
            precio: data.precio,
            imagen: data.imagen ? `/storage/${data.imagen}` : null,
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

  // 💰 TOTALS
  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.precio, 0);
  const costEnviament = configuracions['enviament'] || 9;

  const calcularInstallacio = (total) => {
    if (total <= 250) return configuracions['install_0'] || 90;
    if (total <= 500) return configuracions['install_250'] || 120;
    if (total <= 1000) return configuracions['install_500'] || 180;
    return null;
  };

  const costInstallacio = vullInstallacio ? calcularInstallacio(subtotal) : 0;
  const installacioAConsultar = vullInstallacio && costInstallacio === null;
  const total = subtotal + costEnviament + (costInstallacio || 0);

  // 🗑 REMOVE
  const handleRemove = async (id, isPack) => {
    await removeFromCart(id, isPack);
    setCart((prev) => prev.filter((item) => !(item.id === id && item.isPack === isPack)));
  };

  // 🔄 UPDATE
  const handleUpdate = async (id, isPack, qty) => {
    const safeQty = Math.max(1, parseInt(qty) || 1);
    await updateCart(id, safeQty, isPack);
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.isPack === isPack ? { ...item, quantity: safeQty } : item
      )
    );
  };

  const handleCheckout = async () => {
    try {
      if (!user?.id) {
        alert("Debes iniciar sesión");
        return;
      }

      if (vullInstallacio && !adrecessInstallacio.trim()) {
        setMissatgeError("Has d'indicar l'adreça d'instal·lació per continuar.");
        return;
      }

      if (installacioAConsultar) {
        setMissatgeError("El cost d'instal·lació per a aquest import és a consultar. Contacta amb nosaltres.");
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
          Accept: "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
          usuari_id: user.id,
          cart: cart.map(({ id, quantity, isPack }) => ({ id, quantity, isPack })),
          direccio: "Dirección del usuario",
          telefon: "123456789",
          email: "test@email.com",
          installacio: vullInstallacio,
          adreca_installacio: vullInstallacio ? adrecessInstallacio : null,
          cost_installacio: costInstallacio,
          cost_enviament: costEnviament,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Error al crear pedido");
      window.location.href = `/paypal/pay/${data.pedido_id}`;

    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="cart-page">Cargando carrito...</div>;
  }

  return (
<div className="cart-page">
  <h1>Carrito</h1>

  {cart.length === 0 ? (
    <p role="status">El carrito está vacío</p>
  ) : (
    <>
      <div
        className="cart-list"
        role="list"
        aria-label="Productos del carrito"
      >
        {cart.map((item) => (
          <div
            key={`${item.id}-${item.isPack}`}
            className="cart-item"
            role="listitem"
          >
            <div className="cart-info">
              {item.imagen ? (
                <img
                  src={item.imagen}
                  alt={`${item.isPack ? "Pack" : "Producto"} ${item.nombre}`}
                />
              ) : (
                <span aria-hidden="true">📦</span>
              )}

              <span>
                {item.isPack ? "📦 PACK - " : ""}
                {item.nombre}
              </span>
            </div>

            <span
              className="price"
              aria-label={`Precio de ${item.nombre}`}
            >
              {item.precio} €
            </span>

            <label
              htmlFor={`quantity-${item.id}-${item.isPack}`}
              className="sr-only"
            >
              Cantidad de {item.nombre}
            </label>

            <input
              id={`quantity-${item.id}-${item.isPack}`}
              type="number"
              min="1"
              inputMode="numeric"
              value={item.quantity}
              onChange={(e) =>
                handleUpdate(item.id, item.isPack, e.target.value)
              }
            />

            <button
              onClick={() =>
                handleRemove(item.id, item.isPack)
              }
              aria-label={`Eliminar ${item.nombre} del carrito`}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <section
        className="installation-section"
        aria-labelledby="installation-heading"
      >
        <h2
          id="installation-heading"
          className="sr-only"
        >
          Servei d'instal·lació
        </h2>

        <div className="installation-toggle">
          <input
            type="checkbox"
            id="installacio"
            className="installation-checkbox"
            checked={vullInstallacio}
            onChange={(e) =>
              setVullInstallacio(e.target.checked)
            }
          />

          <label
            htmlFor="installacio"
            className="installation-label"
          >
            Vull el servei d'instal·lació
          </label>
        </div>

        {vullInstallacio && (
          <>
            <label
              htmlFor="installation-address"
              className="sr-only"
            >
              Adreça d'instal·lació
            </label>

            <input
              id="installation-address"
              type="text"
              className="installation-address"
              placeholder="Carrer, número, pis, codi postal i ciutat"
              value={adrecessInstallacio}
              onChange={(e) => {
                setAdrecessInstallacio(e.target.value);
                setMissatgeError("");
              }}
              aria-describedby="installation-info"
            />

            {installacioAConsultar ? (
              <p
                id="installation-info"
                className="installation-warning"
                role="status"
              >
                <GoAlert
                  size={25}
                  aria-hidden="true"
                />
                El cost d'instal·lació per a imports superiors
                a 1.000€ és a consultar.
              </p>
            ) : (
              <p
                id="installation-info"
                className="installation-info"
              >
                Cost d'instal·lació:
                <strong> {costInstallacio}€</strong>
              </p>
            )}
          </>
        )}
      </section>

      <section
        className="cart-total"
        aria-labelledby="order-summary"
      >
        <h2
          id="order-summary"
          className="sr-only"
        >
          Resum de la compra
        </h2>

        <div
          className="cart-summary"
          aria-live="polite"
        >
          <strong>
            Total:{" "}
            {installacioAConsultar
              ? `${(subtotal + costEnviament).toFixed(
                  2
                )} € + instal·lació a consultar`
              : `${total.toFixed(2)} €`}
          </strong>
        </div>

        {missatgeError && (
          <div
            className="cart-error"
            role="alert"
          >
            <GoAlert
              size={20}
              aria-hidden="true"
            />

            <p className="cart-error-message">
              {missatgeError}
            </p>

            <button
              className="cart-error-close"
              onClick={() => setMissatgeError("")}
              aria-label="Tancar missatge d'error"
            >
              ✕
            </button>
          </div>
        )}

        <button
          className="checkout-btn"
          onClick={handleCheckout}
          aria-label="Finalitzar la compra"
        >
          Finalizar compra
        </button>
      </section>
    </>
  )}
</div>
  );
}