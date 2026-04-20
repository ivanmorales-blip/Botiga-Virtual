import React, { useEffect, useState } from "react";
import "../../../../scss/FrontPage.scss";
import { addToCart } from "../../utils/cart.js";

export default function FrontPage() {
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch("/api/productos")
      .then(res => res.json())
      .then(data => setProducts(data.filter(p => p.estat === 1)));

    fetch("/api/productos/recent")
      .then(res => res.json())
      .then(data => setRecentProducts(data.filter(p => p.estat === 1)));

    fetch("/api/categorias")
      .then(res => res.json())
      .then(data => setCategories(data.filter(p => p.estat === 1)));
  }, []);

  const filteredProducts = products
    .filter(p => p.estat === 1)
    .filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))
    .filter(p => selectedCategory === "" || p.categoria_id === selectedCategory);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setQty(1);
  };

  const closeProduct = () => setSelectedProduct(null);

  const ProductCard = ({ p }) => (
    <div className="product-card" onClick={() => openProduct(p)}>
      <div className="product-image-placeholder">📦</div>
      <div className="product-name">{p.nombre}</div>
      <div className="product-price">{p.precio} €</div>

      {p.stock >= 1 ? (
        <div className="stock in-stock">En stock</div>
      ) : (
        <div className="stock out-of-stock">Agotado</div>
      )}

      <button
        className="buy-button"
        onClick={async (e) => {
          e.stopPropagation();
          await addToCart(p.id, 1, false);
          alert("Producto añadido");
        }}
      >
        Comprar
      </button>
    </div>
  );

  return (
    <div className="frontpage-container">

      {/* SEARCH + FILTER UI (unchanged) */}
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca productes..."
          />
        </div>
      </div>

      {/* RECENTS */}
      <div className="divider"><h2>Productes Recents</h2></div>
      <div className="products-grid">
        {recentProducts.map(p => <ProductCard key={p.id} p={p} />)}
      </div>

      {/* DESTACATS */}
      <div className="divider"><h2>Productes Destacats</h2></div>
      <div className="products-grid">
        {products.filter(p => p.destacat === 1)
          .map(p => <ProductCard key={p.id} p={p} />)}
      </div>

      {/* CATEGORIES */}
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

      {/* POPUP */}
      {selectedProduct && (
        <div className="product-popup-overlay" onClick={closeProduct}>
          <div className="product-popup" onClick={(e) => e.stopPropagation()}>

            <div className="popup-left">
              <div className="product-image-placeholder-large">📦</div>
            </div>

            <div className="popup-right">
              <h2>{selectedProduct.nombre}</h2>
              <div>{selectedProduct.precio} €</div>

              {/* ✅ quantity ONLY here */}
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              />

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