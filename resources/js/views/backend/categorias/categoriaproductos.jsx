import React, { useEffect, useState } from "react";
import "../../../../../scss/CategoriaProductos.scss";

export default function CategoriaProductos() {
  const [categorias, setCategorias] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mostrarMas, setMostrarMas] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const MAX_VISIBLE = 5;

  useEffect(() => {
    fetch("/api/categorias")
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error(err));

    fetch("/api/caracteristicas")
      .then(res => res.json())
      .then(data => setCaracteristicas(data))
      .catch(err => console.error(err));
  }, []);

  const loadProductos = async (categoriaId = "", caracteristicasIds = []) => {
    const params = new URLSearchParams();
    if (categoriaId) params.append("categoria", categoriaId);
    caracteristicasIds.forEach(id => params.append("caracteristica[]", id));

    const res = await fetch(`/api/productos?${params.toString()}`);
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    loadProductos(selectedCategoria, selectedCaracteristicas);
  }, [selectedCategoria, selectedCaracteristicas]);

  const handleCaracteristicaChange = (id) => {
    const nuevaSeleccion = selectedCaracteristicas.includes(id)
      ? selectedCaracteristicas.filter(c => c !== id)
      : [...selectedCaracteristicas, id];
    setSelectedCaracteristicas(nuevaSeleccion);
  };

  const categoriaSeleccionada = categorias.find(c => c.id == selectedCategoria);

  const productosFiltrados = selectedCaracteristicas.length
    ? productos.filter(p =>
        selectedCaracteristicas.every(sc =>
          p.caracteristicas?.some(c => c.id == sc)
        )
      )
    : productos;

  const openProduct = (prod) => setSelectedProduct(prod);
  const closeProduct = () => setSelectedProduct(null);

  return (
    <div className="categorias-page">
      <h1>Categorías</h1>

      <div className="page-content">
        {/* Filters */}
        <div className="filters">
          <div className="categoria-filtros">
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.tipo}</option>
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

        {/* Products */}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Comprar functionality not implemented yet");
                    }}
                  >
                    Comprar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-productos">No hay productos con esos filtros</p>
          )}
        </div>
      </div>

      {/* Product Popup */}
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

              {selectedProduct.categoria && (
                <div className="popup-attribute">
                  <strong>Categoria:</strong> {selectedProduct.categoria.tipo}
                </div>
              )}

              {selectedProduct.caracteristicas && selectedProduct.caracteristicas.length > 0 && (
                <div className="popup-attribute">
                  <strong>Característiques:</strong>
                  <ul>
                    {selectedProduct.caracteristicas.map(c => (
                      <li key={c.id}>{c.tipo?.tipo}: {c.descripcio}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                className="buy-button"
                onClick={() => alert("Comprar functionality not implemented yet")}
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