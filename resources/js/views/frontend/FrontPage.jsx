import React, { useEffect, useState } from "react";
import "../../../../scss/FrontPage.scss";
import { notify } from "../../utils/notification.js"
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
  const [popupImageIndex, setPopupImageIndex] = useState(0);

  useEffect(() => {
    fetch("/api/frontend/productos")
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
    setPopupImageIndex(0);
    setQty(1);
  };

  const closeProduct = () => setSelectedProduct(null);

  const ProductCard = ({ p }) => {
    const imagen = p.imatges && p.imatges.length > 0
      ? `/storage/${p.imatges[0].path}`
      : null;

    return (
      <div className="product-card" onClick={() => openProduct(p)}>
        <div className="product-image-placeholder">
          {imagen
            ? <img src={imagen} alt={p.nombre} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            : "📦"
          }
        </div>
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
            notify("success", "Producto añadido al carrito");
          }}
        >
          Comprar
        </button>
      </div>
    );
  };

  return (
    <div className="frontpage-container">

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

      <div className="divider"><h2>Productes Destacats</h2></div>
      <div className="products-grid">
        {products.filter(p => p.destacat === 1)
          .map(p => <ProductCard key={p.id} p={p} />)}
      </div>

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

      {selectedProduct && (
  <div className="product-popup-overlay" onClick={closeProduct}>
    <div className="product-popup" onClick={(e) => e.stopPropagation()}>

      {/* LEFT: CAROUSEL */}
      <div className="popup-left">
        {selectedProduct.imatges?.length > 0 ? (
          <div className="popup-carousel">

            <img
              src={`/storage/${selectedProduct.imatges[popupImageIndex].path}`}
              className="popup-main-image"
              alt={selectedProduct.nombre}
            />

            {selectedProduct.imatges.length > 1 && (
              <>
                <button
                  className="carousel-btn left"
                  onClick={() =>
                    setPopupImageIndex(
                      i => (i - 1 + selectedProduct.imatges.length) % selectedProduct.imatges.length
                    )
                  }
                >
                  ‹
                </button>

                <button
                  className="carousel-btn right"
                  onClick={() =>
                    setPopupImageIndex(
                      i => (i + 1) % selectedProduct.imatges.length
                    )
                  }
                >
                  ›
                </button>

                <div className="carousel-dots">
                  {selectedProduct.imatges.map((_, i) => (
                    <button
                      key={i}
                      className={`dot ${i === popupImageIndex ? "active" : ""}`}
                      onClick={() => setPopupImageIndex(i)}
                    />
                  ))}
                </div>
              </>
            )}

          </div>
        ) : (
          <div className="product-image-placeholder-large">📦</div>
        )}
      </div>

      {/* RIGHT: INFO */}
      <div className="popup-right">

        <h2 className="popup-title">{selectedProduct.nombre}</h2>

        <div className="popup-price">{selectedProduct.precio} €</div>

        <p className={`popup-stock ${selectedProduct.stock >= 1 ? "in-stock" : "out-of-stock"}`}>
          {selectedProduct.stock >= 1 ? "En stock" : "Agotado"}
        </p>

        {/* DESCRIPTION */}
        {selectedProduct.descripcion && (
          <div className="popup-box">
            <strong>Descripció</strong>
            <p>{selectedProduct.descripcion}</p>
          </div>
        )}

        {/* CATEGORY */}
        {selectedProduct.categoria && (
          <div className="popup-box">
            <strong>Categoria</strong>
            <p>{selectedProduct.categoria.tipo}</p>
          </div>
        )}

        {/* CHARACTERISTICS */}
        {selectedProduct.caracteristicas?.length > 0 && (
          <div className="popup-box">
            <strong>Característiques</strong>
            <ul>
              {selectedProduct.caracteristicas.map(c => (
                <li key={c.id}>
                  {c.tipo?.tipo} {c.descripcio}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* QTY */}
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(parseInt(e.target.value) || 1)}
          className="popup-qty"
        />

        <button
          className="buy-button"
          onClick={async () => {
            await addToCart(selectedProduct.id, qty, false);
            notify("success", "Producto añadido al carrito");
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