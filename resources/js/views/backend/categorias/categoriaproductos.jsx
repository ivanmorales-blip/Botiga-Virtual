import React, { useEffect, useState } from "react";
import "../../../../../scss/CategoriaProductos.scss";
import { addToCart } from "../../../utils/cart.js";

export default function CategoriaProductos() {
  const [categorias, setCategorias] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch("/api/categorias")
      .then(res => res.json())
      .then(setCategorias)
      .catch(console.error);

    fetch("/api/caracteristicas")
      .then(res => res.json())
      .then(setCaracteristicas)
      .catch(console.error);
  }, []);

  const loadProductos = async (categoriaId = "", caracteristicasIds = []) => {
    try {
      const params = new URLSearchParams();

      if (categoriaId) params.append("categoria", categoriaId);
      caracteristicasIds.forEach(id =>
        params.append("caracteristica[]", id)
      );

      const res = await fetch(`/api/productos?${params.toString()}`);
      const data = await res.json();

      // ⚠️ IMPORTANT FIX: ensure it's always an array
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading productos:", err);
      setProductos([]);
    }
  };

  useEffect(() => {
    loadProductos(selectedCategoria, selectedCaracteristicas);
  }, [selectedCategoria, selectedCaracteristicas]);

  const handleCaracteristicaChange = (id) => {
    setSelectedCaracteristicas(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const productosFiltrados = selectedCaracteristicas.length
    ? productos.filter(p =>
        selectedCaracteristicas.every(sc =>
          p.caracteristicas?.some(c => c.id == sc)
        )
      )
    : productos;

  const openProduct = (prod) => {
    setSelectedProduct(prod);
    setQty(1);
  };

  const closeProduct = () => setSelectedProduct(null);

  return (
    <div className="categorias-page">
      <h1>Categorías</h1>

      <div className="page-content">

        {/* FILTERS */}
        <div className="filters">
          <div className="categoria-filtros">
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="caracteristicas">
            {Object.entries(
              caracteristicas.reduce((acc, car) => {
                const key = car.tipo?.tipo || "Otros";
                acc[key] = acc[key] || [];
                acc[key].push(car);
                return acc;
              }, {})
            ).map(([tipo, lista]) => (
              <div key={tipo}>
                <h2>{tipo}</h2>
                {lista.map(car => (
                  <label key={car.id}>
                    <input
                      type="checkbox"
                      checked={selectedCaracteristicas.includes(car.id)}
                      onChange={() => handleCaracteristicaChange(car.id)}
                    />
                    {car.descripcio}
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="productos">
          {productosFiltrados.length > 0 ? (
            <div className="productos-grid">
              {productosFiltrados.map(prod => (
                <div
                  key={prod.id}
                  className="producto-card"
                  onClick={() => openProduct(prod)}
                >
                  <div className="product-image-placeholder">
                    {prod.imagen ? (
                      <img src={prod.imagen} alt={prod.nombre} />
                    ) : (
                      "📦"
                    )}
                  </div>

                  <h3>{prod.nombre}</h3>
                  <p className="precio">{prod.precio} €</p>

                  <p className={`stock ${prod.stock >= 1 ? "in-stock" : "out-of-stock"}`}>
                    {prod.stock >= 1 ? "En stock" : "Agotado"}
                  </p>

                  <button
                    className="buy-button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await addToCart(prod.id, 1, false);
                      alert("Producto añadido");
                    }}
                  >
                    Comprar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-productos">
              No hay productos con esos filtros
            </p>
          )}
        </div>
      </div>

      {/* POPUP */}
      {selectedProduct && (
        <div className="product-popup-overlay" onClick={closeProduct}>
          <div className="product-popup" onClick={(e) => e.stopPropagation()}>

            <div className="popup-left">
              <div className="product-image-placeholder-large">
                {selectedProduct.imagen ? (
                  <img src={selectedProduct.imagen} alt={selectedProduct.nombre} />
                ) : (
                  "📦"
                )}
              </div>
            </div>

            <div className="popup-right">
              <h2 className="popup-name">{selectedProduct.nombre}</h2>

              <p className={`stock ${selectedProduct.stock >= 1 ? "in-stock" : "out-of-stock"}`}>
                {selectedProduct.stock >= 1 ? "En stock" : "Agotado"}
              </p>

              <div className="popup-price">{selectedProduct.precio} €</div>

              {/* ✅ quantity ONLY here */}
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              />

              {selectedProduct.categoria && (
                <div className="popup-attribute">
                  <strong>Categoria:</strong> {selectedProduct.categoria.tipo}
                </div>
              )}

              {selectedProduct.caracteristicas?.length > 0 && (
                <div className="popup-attribute">
                  <strong>Característiques:</strong>
                  <ul>
                    {selectedProduct.caracteristicas.map(c => (
                      <li key={c.id}>
                        {c.tipo?.tipo} {c.descripcio}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                className="buy-button"
                onClick={async () => {
                  await addToCart(selectedProduct.id, qty, false);
                  alert("Producto añadido");
                }}
              >
                Comprar
              </button>
            </div>

            <button className="popup-close" onClick={closeProduct}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
}