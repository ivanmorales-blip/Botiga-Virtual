import React, { useEffect, useState } from "react";
import "../../../../../scss/CategoriaProductos.scss";
import "../../../../../scss/_productos.scss";
import "../../../../../scss/productpopup.scss";
import { notify } from "../../../utils/notification.js";
import { addToCart } from "../../../utils/cart.js";

export default function CategoriaProductos() {
  const [categorias, setCategorias] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);

  const [productos, setProductos] = useState([]);
  const [packs, setPacks] = useState([]);

  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [popupImageIndex, setPopupImageIndex] = useState(0);

  // 📦 LOAD STATIC DATA
  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then(setCategorias);

    fetch("/api/caracteristicas")
      .then((r) => r.json())
      .then(setCaracteristicas);
  }, []);

  // 📦 LOAD PRODUCTS / PACKS
  useEffect(() => {
    loadProductos();
    loadPacks();
  }, [selectedCategoria, selectedCaracteristicas]);

  const loadProductos = async () => {
    const res = await fetch("/api/productos");
    const data = await res.json();
    setProductos(Array.isArray(data) ? data : []);
  };

  const loadPacks = async () => {
    const res = await fetch("/api/packs");
    const data = await res.json();
    setPacks(Array.isArray(data) ? data : []);
  };

  // 🧠 NORMALIZE PACK
  const normalizePack = (pack) => ({
    id: pack.id, // ✅ FIX: no fake "pack-xxx"
    nombre: pack.nom,
    precio: pack.preu,
    descripcion: pack.Descripcio,
    isPack: true,
    productes: pack.productes,
    imatges: pack.images?.map((i) => ({ path: i.image_path })) || [],
  });

  const allItems = [
    ...productos,
    ...packs.map(normalizePack),
  ];

  const openProduct = (item) => {
    setSelectedProduct(item);
    setQty(1);
    setPopupImageIndex(0);
  };

  const closeProduct = () => setSelectedProduct(null);

  const handleCaracteristicaChange = (id) => {
    const num = Number(id);
    setSelectedCaracteristicas((prev) =>
      prev.includes(num)
        ? prev.filter((c) => c !== num)
        : [...prev, num]
    );
  };

  // 🛒 ADD TO CART (FIXED FOR BOTH PRODUCTS + PACKS)
  const handleAddToCart = async (item, quantity = 1) => {
    try {
      await addToCart(item.id, quantity, item.isPack || false);

      notify(
        "success",
        item.isPack
          ? "Pack añadido al carrito"
          : "Producto añadido al carrito"
      );
    } catch (err) {
      console.error(err);
      notify("error", "Error al añadir al carrito");
    }
  };

  return (
    <div className="categorias-page">
      <h1>Categorías</h1>

      <div className="page-content">

        {/* FILTERS */}
        <div className="filters">
          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tipo}
              </option>
            ))}
          </select>

          <div className="caracteristicas">
            {Object.entries(
              caracteristicas.reduce((acc, car) => {
                const key = car.tipo?.tipo || "Otros";
                acc[key] = acc[key] || [];
                acc[key].push(car);
                return acc;
              }, {})
            ).map(([tipo, list]) => (
              <div key={tipo}>
                <h2>{tipo}</h2>
                {list.map((c) => (
                  <label key={c.id}>
                    <input
                      type="checkbox"
                      checked={selectedCaracteristicas.includes(Number(c.id))}
                      onChange={() =>
                        handleCaracteristicaChange(c.id)
                      }
                    />
                    {c.descripcio}
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="productos">
          <div className="productos-grid">
            {allItems.map((item) => {
              const img = item.imatges?.[0]
                ? `/storage/${item.imatges[0].path}`
                : null;

              return (
                <div
                  key={`${item.id}-${item.isPack ? "pack" : "prod"}`}
                  className={`product-card ${
                    item.isPack ? "pack-card" : ""
                  }`}
                  onClick={() => openProduct(item)}
                >
                  <div className="product-image-placeholder">
                    {img ? <img src={img} alt={item.nombre} /> : "📦"}
                  </div>

                  <div className="product-name">
                    {item.isPack ? "📦 PACK - " : ""}
                    {item.nombre}
                  </div>

                  <div className="product-price">
                    {item.precio} €
                  </div>

                  <button
                    className="buy-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item, 1);
                    }}
                  >
                    Comprar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* POPUP */}
      {selectedProduct && (
        <div
          className="product-popup-overlay"
          onClick={closeProduct}
        >
          <div
            className="product-popup"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LEFT */}
            <div className="popup-left">
              {selectedProduct.imatges?.length > 0 ? (
                <div className="popup-carousel">
                  <img
                    src={`/storage/${selectedProduct.imatges[popupImageIndex].path}`}
                    className="popup-main-image"
                  />

                  {selectedProduct.imatges.length > 1 && (
                    <>
                      <button
                        className="carousel-btn left"
                        onClick={() =>
                          setPopupImageIndex(
                            (i) =>
                              (i - 1 +
                                selectedProduct.imatges.length) %
                              selectedProduct.imatges.length
                          )
                        }
                      >
                        ‹
                      </button>

                      <button
                        className="carousel-btn right"
                        onClick={() =>
                          setPopupImageIndex(
                            (i) =>
                              (i + 1) %
                              selectedProduct.imatges.length
                          )
                        }
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="product-image-placeholder-large">
                  📦
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="popup-right">
              <h2 className="popup-title">
                {selectedProduct.nombre}
              </h2>

              <div className="popup-price">
                {selectedProduct.precio} €
              </div>

              {selectedProduct.descripcion && (
                <div className="popup-box">
                  <strong>Descripció</strong>
                  <p>{selectedProduct.descripcion}</p>
                </div>
              )}

              {selectedProduct.isPack && (
                <div className="popup-box">
                  <strong>Contingut del pack</strong>
                  <ul>
                    {selectedProduct.productes?.map((p) => (
                      <li key={p.id}>
                        {p.nombre} ×{" "}
                        {p.pivot?.quantity || 1}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) =>
                  setQty(parseInt(e.target.value) || 1)
                }
                className="popup-qty"
              />

              <button
                className="buy-button"
                onClick={() =>
                  handleAddToCart(selectedProduct, qty)
                }
              >
                Comprar
              </button>
            </div>

            <button
              className="popup-close"
              onClick={closeProduct}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}