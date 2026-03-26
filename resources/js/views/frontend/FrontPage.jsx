import React, { useEffect, useState } from "react";
import "../../../../scss/FrontPage.scss";

export default function FrontPage() {
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch("/api/productos")
      .then(res => res.json())
      .then(data => setProducts(data.filter(p => p.estat === 1)))
      .catch(err => console.error("Error fetching products:", err));

    fetch("/api/productos/recent")
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => setRecentProducts(data.filter(p => p.estat === 1)))
      .catch(err => console.error("Error fetching recent products:", err));

    fetch("/api/categorias")
      .then(res => res.json())
      .then(data => setCategories(data.filter(p => p.estat === 1)))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const filteredProducts = products
  .filter(p => p.estat === 1)
  .filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const openProduct = (product) => setSelectedProduct(product);
  const closeProduct = () => setSelectedProduct(null);

  // Product Card
const ProductCard = ({ p }) => (
  <div className="product-card" onClick={() => openProduct(p)}>
    <div className="product-image-placeholder">📦</div>
    <div className="product-name">{p.nombre}</div>
    <div className="product-price">{p.precio} €</div>
    
    {/* Stock indicator */}
    {p.stock >= 1 ? (
      <div className="stock in-stock">En stock</div>
    ) : (
      <div className="stock out-of-stock">Agotado</div>
    )}

    <button
      className="buy-button"
      onClick={(e) => {
        e.stopPropagation(); // prevents popup open
        alert("Comprar functionality not implemented yet");
      }}
    >
      Comprar
    </button>
  </div>
);

  return (
    <div className="frontpage-container">
      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cerca productes..."
        />
      </div>

      {/* Recent products */}
      <div className="divider"><h2>Productes Recents</h2></div>
      <div className="products-grid">
        {recentProducts.length === 0
          ? <p className="no-products">No hi ha productes recents</p>
          : recentProducts.map(p => <ProductCard key={p.id} p={p} />)}
      </div>

      {/* Featured products (empty) */}
      <div className="divider"><h2>Productes Destacats</h2></div>
      <div className="products-grid"></div>

      {/* Products by category */}
      {categories.map(cat => (
        <div key={cat.id}>
          <div className="divider"><h2>{cat.tipo}</h2></div>
          <div className="products-grid">
            {filteredProducts
              .filter(p => p.categoria_id === cat.id)
              .map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      ))}

      {/* Popup modal */}
{selectedProduct && (
  <div className="product-popup-overlay" onClick={closeProduct}>
    <div
      className="product-popup"
      onClick={(e) => e.stopPropagation()} // prevent overlay click
    >
      {/* Left: Image */}
      <div className="popup-left">
        <div className="product-image-placeholder-large">📦</div>
      </div>

      {/* Right: Product data */}
      <div className="popup-right">
        <h2 className="popup-name">{selectedProduct.nombre}</h2>

        {/* Stock */}
        {selectedProduct.stock >= 1 ? (
          <div className="stock in-stock">En stock</div>
        ) : (
          <div className="stock out-of-stock">Agotado</div>
        )}

        {/* Price */}
        <div className="popup-price">{selectedProduct.precio} €</div>

        {/* Category */}
        {selectedProduct.categoria && (
          <div className="popup-attribute">
            <strong>Categoria:</strong> {selectedProduct.categoria.tipo}
          </div>
        )}

        {/* Brand */}
        {selectedProduct.marca && (
          <div className="popup-attribute">
            <strong>Marca:</strong> {selectedProduct.marca}
          </div>
        )}

        {/* Caracteristicas */}
        {selectedProduct.caracteristicas && selectedProduct.caracteristicas.length > 0 && (
          <div className="popup-attribute">
            <strong>Característiques:</strong>
            <ul>
              {selectedProduct.caracteristicas.map(c => (
                <li key={c.id}>
                  {c.tipo?.tipo}: {c.descripcio}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Comprar button */}
        <button
          className="buy-button"
          onClick={() => alert("Comprar functionality not implemented yet")}
        >
          Comprar
        </button>
      </div>

      {/* Description box */}
      {selectedProduct.descripcion && (
        <div className="popup-description">
          {selectedProduct.descripcion}
        </div>
      )}

      {/* Close button */}
      <button className="popup-close" onClick={closeProduct}>
        ✖
      </button>
    </div>
  </div>
)}
    </div>
  );
}