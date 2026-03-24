import React, { useEffect, useState } from "react";
import "../../../scss/FrontPage.scss";

export default function FrontPage() {
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/productos")
      .then(res => res.json())
      .then(setProducts);

    fetch("/api/productos/recent")
      .then(res => res.json())
      .then(setRecentProducts);

    fetch("/api/categorias")
      .then(res => res.json())
      .then(setCategories);
  }, []);

  // Filter products by search
  const filteredProducts = products.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
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

      {/* Recent products divider */}
      <div className="divider">
        <h2>Productes Recents</h2>
      </div>
      <div className="products-grid">
        {recentProducts.length === 0 && <p>No hi ha productes recents</p>}
        {recentProducts.map(p => (
          <div key={p.id} className="product-card">
            <div className="product-name">{p.nombre}</div>
            <div className="product-price">{p.precio} €</div>
            <div className="product-image-placeholder">📦</div>
          </div>
        ))}
      </div>

      {/* Productes Destacats divider (empty for now) */}
      <div className="divider">
        <h2>Productes Destacats</h2>
      </div>
      <div className="products-grid"></div>

      {/* Products by category */}
      {categories.map(cat => (
        <div key={cat.id}>
          <div className="divider">
            <h2>{cat.tipo}</h2>
          </div>
          <div className="products-grid">
            {filteredProducts
              .filter(p => p.categoria_id === cat.id)
              .map(p => (
                <div key={p.id} className="product-card">
                  <div className="product-name">{p.nombre}</div>
                  <div className="product-price">{p.precio} €</div>
                  <div className="product-image-placeholder">📦</div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}