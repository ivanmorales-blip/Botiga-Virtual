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

  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then(setCategorias);

    fetch("/api/caracteristicas")
      .then((r) => r.json())
      .then(setCaracteristicas);
  }, []);

  useEffect(() => {
    loadProductos();
    loadPacks();
  }, []);

  const loadProductos = async () => {
    const res = await fetch("/api/productos");
    const data = await res.json();

    const active = Array.isArray(data)
      ? data.filter((p) => Number(p.estat) === 1)
      : [];

    setProductos(active);
  };

  const loadPacks = async () => {
    const res = await fetch("/api/packs");
    const data = await res.json();

    const active = Array.isArray(data)
      ? data.filter((p) => Number(p.estat) === 1)
      : [];

    setPacks(active);
  };

  const normalizePack = (pack) => ({
    id: pack.id,
    nombre: pack.nom,
    precio: pack.preu,
    descripcion: pack.Descripcio,
    categoria_id: pack.categoria_id,
    caracteristicas: pack.caracteristicas || [],
    stock: pack.stock || 0,
    isPack: true,
    productes: pack.productes,
    imatges:
      pack.images?.map((i) => ({
        path: i.image_path,
      })) || [],
  });

  const allItems = [
    ...productos,
    ...packs.map(normalizePack),
  ];

  const filteredItems = allItems.filter((item) => {

    const matchCategoria =
      !selectedCategoria ||
      Number(item.categoria_id) === Number(selectedCategoria);

    const matchCaracteristicas =
      selectedCaracteristicas.length === 0 ||
      selectedCaracteristicas.every((selectedId) =>
        item.caracteristicas?.some(
          (c) => Number(c.id) === Number(selectedId)
        )
      );

    return matchCategoria && matchCaracteristicas;
  });

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
      <aside
        className="filters"
        aria-label="Filtros de productos"
      >
        <div className="categoria-filtros">
          <label
            htmlFor="categoria-select"
            className="sr-only"
          >
            Filtrar por categoría
          </label>

          <select
            id="categoria-select"
            value={selectedCategoria}
            onChange={(e) =>
              setSelectedCategoria(e.target.value)
            }
          >
            <option value="">
              Todas las categorías
            </option>

            {categorias.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.tipo}
              </option>
            ))}
          </select>
        </div>

        <div
          className="caracteristicas"
          role="group"
          aria-labelledby="caracteristicas-title"
        >
          <h2 id="caracteristicas-title">
            Características
          </h2>

          {Object.entries(
            caracteristicas.reduce((acc, car) => {
              const key =
                car.tipo?.tipo || "Otros";

              acc[key] = acc[key] || [];
              acc[key].push(car);

              return acc;
            }, {})
          ).map(([tipo, list]) => (
            <section key={tipo}>
              <h3>{tipo}</h3>

              {list.map((c) => (
                <label key={c.id}>
                  <input
                    type="checkbox"
                    checked={selectedCaracteristicas.includes(
                      Number(c.id)
                    )}
                    onChange={() =>
                      handleCaracteristicaChange(
                        c.id
                      )
                    }
                  />

                  {c.descripcio}
                </label>
              ))}
            </section>
          ))}
        </div>
      </aside>

      {/* PRODUCTS */}
      <main className="productos">
        <div
          className="productos-grid"
          role="list"
          aria-label="Productos"
        >
          {filteredItems.map((item) => {
            const img = item.imatges?.[0]
              ? `/storage/${item.imatges[0].path}`
              : null;

            return (
              <div
                key={`${item.id}-${
                  item.isPack ? "pack" : "prod"
                }`}
                className={`product-card ${
                  item.isPack
                    ? "pack-card"
                    : ""
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Ver detalles de ${item.nombre}`}
                onClick={() =>
                  openProduct(item)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" ||
                    e.key === " "
                  ) {
                    e.preventDefault();
                    openProduct(item);
                  }
                }}
              >
                <div className="product-image-placeholder">
                  {img ? (
                    <img
                      src={img}
                      alt={item.nombre}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                    >
                      📦
                    </span>
                  )}
                </div>

                <div className="product-name">
                  {item.isPack
                    ? "📦 PACK - "
                    : ""}
                  {item.nombre}
                </div>

                <div className="product-price">
                  {item.precio} €
                </div>

                <button
                  type="button"
                  className="buy-button"
                  aria-label={`Comprar ${item.nombre}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(
                      item,
                      1
                    );
                  }}
                >
                  Comprar
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>

    {/* POPUP */}
    {selectedProduct && (
      <div
        className="product-popup-overlay"
        onClick={closeProduct}
      >
        <div
          className="product-popup"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-title"
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          {/* LEFT */}
          <div className="popup-left">
            {selectedProduct.imatges
              ?.length > 0 ? (
              <div className="popup-carousel">
                <img
                  src={`/storage/${selectedProduct.imatges[popupImageIndex].path}`}
                  className="popup-main-image"
                  alt={`${selectedProduct.nombre} - imagen ${
                    popupImageIndex + 1
                  } de ${
                    selectedProduct.imatges
                      .length
                  }`}
                />

                {selectedProduct.imatges
                  .length > 1 && (
                  <>
                    <button
                      type="button"
                      className="carousel-btn left"
                      aria-label="Imagen anterior"
                      onClick={() =>
                        setPopupImageIndex(
                          (i) =>
                            (i -
                              1 +
                              selectedProduct
                                .imatges
                                .length) %
                            selectedProduct
                              .imatges
                              .length
                        )
                      }
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      className="carousel-btn right"
                      aria-label="Imagen siguiente"
                      onClick={() =>
                        setPopupImageIndex(
                          (i) =>
                            (i + 1) %
                            selectedProduct
                              .imatges
                              .length
                        )
                      }
                    >
                      ›
                    </button>

                    <div className="carousel-dots">
                      {selectedProduct.imatges.map(
                        (_, i) => (
                          <button
                            type="button"
                            key={i}
                            aria-label={`Ir a imagen ${
                              i + 1
                            }`}
                            aria-current={
                              i ===
                              popupImageIndex
                            }
                            className={`dot ${
                              i ===
                              popupImageIndex
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              setPopupImageIndex(
                                i
                              )
                            }
                          />
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="product-image-placeholder-large">
                <span aria-hidden="true">
                  📦
                </span>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="popup-right">
            <h2
              id="product-title"
              className="popup-title"
            >
              {selectedProduct.nombre}
            </h2>

            <div className="popup-price">
              {selectedProduct.precio} €
            </div>

            <p
              className={`popup-stock ${
                selectedProduct.stock >= 1
                  ? "in-stock"
                  : "out-of-stock"
              }`}
            >
              {selectedProduct.stock >= 1
                ? "En stock"
                : "Agotado"}
            </p>

            {selectedProduct.descripcion && (
              <div className="popup-box">
                <strong>
                  Descripción
                </strong>
                <p>
                  {
                    selectedProduct.descripcion
                  }
                </p>
              </div>
            )}

            {selectedProduct.categoria && (
              <div className="popup-box">
                <strong>
                  Categoría
                </strong>
                <p>
                  {
                    selectedProduct
                      .categoria.tipo
                  }
                </p>
              </div>
            )}

            {selectedProduct
              .caracteristicas
              ?.length > 0 && (
              <div className="popup-box">
                <strong>
                  Características
                </strong>

                <ul>
                  {selectedProduct.caracteristicas.map(
                    (c) => (
                      <li key={c.id}>
                        {c.tipo?.tipo}{" "}
                        {c.descripcio}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            <div>
              <label
                htmlFor="popup-qty"
                className="sr-only"
              >
                Cantidad
              </label>

              <input
                id="popup-qty"
                type="number"
                min="1"
                value={qty}
                onChange={(e) =>
                  setQty(
                    parseInt(
                      e.target.value
                    ) || 1
                  )
                }
                className="popup-qty"
              />
            </div>

            <button
              type="button"
              className="buy-button"
              onClick={async () => {
                await addToCart(
                  selectedProduct.id,
                  qty,
                  selectedProduct.isPack ||
                    false
                );

                notify(
                  "success",
                  selectedProduct.isPack
                    ? "Pack añadido al carrito"
                    : "Producto añadido al carrito"
                );
              }}
            >
              Comprar
            </button>
          </div>

          <button
            type="button"
            className="popup-close"
            aria-label="Cerrar ventana"
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