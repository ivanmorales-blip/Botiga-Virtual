import React, { useEffect, useState } from "react";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editedFields, setEditedFields] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [search, setSearch] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const safeJson = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error("Not JSON response:", text);
      throw new Error("Server returned HTML instead of JSON");
    }
  };

  const loadProducts = () => {
    setLoading(true);
    fetch("/api/productos")
      .then(safeJson)
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const loadCategories = () => {
    fetch("/api/categorias")
      .then(safeJson)
      .then(setCategories)
      .catch(console.error);
  };

  const loadCaracteristicas = () => {
    fetch("/api/caracteristicas")
      .then(safeJson)
      .then(setCaracteristicas)
      .catch(console.error);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadCaracteristicas();
  }, []);

  const getIndex = (id, total) => {
    const idx = currentImageIndex[id] || 0;
    return total && idx >= total ? 0 : idx;
  };

  const prevImage = (id, total) =>
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: (getIndex(id, total) - 1 + total) % total,
    }));

  const nextImage = (id, total) =>
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: (getIndex(id, total) + 1) % total,
    }));

  const toggleActive = async (product) => {
    try {
      const endpoint = product.estat
        ? `/api/productos/${product.id}/deactivate`
        : `/api/productos/${product.id}/activate`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(await res.text());

      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setImagePreview([]);
    setEditedFields({
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock,
      descripcion: product.descripcion || "",
      categoria_id: product.categoria_id || "",
      marca: product.marca || "",
      caracteristicas: product.caracteristicas?.map((c) => c.id) || [],
      destacat: product.destacat || false,
      codi: product.codi || "",
      imatges_existents: product.imatges || [],
      imatges_a_borrar: [],
      imatges_noves: [],
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedFields({});
    setImagePreview(null);
  };

  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-8 min-h-screen">
      {/* SCREEN READER STATUS */}
      <div aria-live="polite" className="sr-only">
        {loading ? "Loading products..." : ""}
      </div>

      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold mb-4 text-orange-600 text-center">
          Llista de Productes
        </h1>
      </header>

      {/* SEARCH */}
      <div className="mb-3 flex justify-center">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>

        <input
          id="product-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca per nom..."
          className="px-4 py-2 border rounded-lg w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* CREATE */}
      <nav className="mt-10 text-center mb-6" aria-label="Product actions">
        <a
          href="/products-react/create"
          className="inline-block bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Crear Entrada Producte
        </a>
      </nav>

      {/* CONTENT */}
      {loading ? (
        <p role="status" className="text-center text-gray-600">
          Carregant...
        </p>
      ) : filteredProducts.length === 0 ? (
        <p role="status" className="text-center text-gray-500">
          No hi ha productes
        </p>
      ) : (
        <section
          aria-label="Product list"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProducts.map((p) => (
            <article
              key={p.id}
              aria-labelledby={`product-${p.id}`}
              className="bg-white p-6 rounded-2xl shadow"
            >
              {/* STATUS */}
              <div className="flex justify-between items-center">
                <span
                  aria-label={p.estat ? "Active product" : "Inactive product"}
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    p.estat
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.estat ? "Actiu" : "Inactiu"}
                </span>

                {p.destacat && (
                  <span
                    aria-label="Featured product"
                    className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold"
                  >
                    ★ Destacat
                  </span>
                )}
              </div>

              {/* EDIT MODE */}
              {editingId === p.id ? (
                <section aria-label="Edit product form">
                  <input
                    aria-label="Product name"
                    value={editedFields.nombre}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, nombre: e.target.value })
                    }
                    className="w-full border p-2 mt-2 rounded"
                  />

                  <input
                    aria-label="Product code"
                    value={editedFields.codi || ""}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, codi: e.target.value })
                    }
                    className="w-full border p-2 mt-1 rounded"
                  />

                  <input
                    aria-label="Price"
                    type="number"
                    value={editedFields.precio}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, precio: e.target.value })
                    }
                    className="w-full border p-2 mt-1 rounded"
                  />

                  <input
                    aria-label="Stock"
                    type="number"
                    value={editedFields.stock}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, stock: e.target.value })
                    }
                    className="w-full border p-2 mt-1 rounded"
                  />

                  <textarea
                    aria-label="Description"
                    value={editedFields.descripcion}
                    onChange={(e) =>
                      setEditedFields({
                        ...editedFields,
                        descripcion: e.target.value,
                      })
                    }
                    className="w-full border p-2 mt-1 rounded"
                  />

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={editedFields.destacat || false}
                      onChange={(e) =>
                        setEditedFields({
                          ...editedFields,
                          destacat: e.target.checked,
                        })
                      }
                    />
                    <label>Producte destacat</label>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => saveEdit(p.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Guardar
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-400 px-3 py-1 rounded"
                    >
                      Cancel·lar
                    </button>
                  </div>
                </section>
              ) : (
                <>
                  {/* IMAGE */}
                  {p.imatges?.length > 0 && (
                    <section aria-label="Product images">
                      <img
                        src={`/storage/${p.imatges[getIndex(p.id, p.imatges.length)].path}`}
                        alt={`Product ${p.nombre}`}
                        className="w-full h-[200px] object-contain"
                      />

                      {p.imatges.length > 1 && (
                        <div className="flex justify-between mt-2">
                          <button type="button" onClick={() => prevImage(p.id, p.imatges.length)}>
                            ‹
                          </button>
                          <button type="button" onClick={() => nextImage(p.id, p.imatges.length)}>
                            ›
                          </button>
                        </div>
                      )}
                    </section>
                  )}

                  {/* INFO */}
                  <h2 id={`product-${p.id}`} className="font-bold text-lg mt-2">
                    {p.nombre}
                  </h2>

                  <p className="text-orange-600 font-semibold">
                    {p.precio} €
                  </p>

                  <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                  <p className="text-sm text-gray-500">Marca: {p.marca || "—"}</p>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(p)}
                      aria-label="Toggle product status"
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      {p.estat ? "Desactivar" : "Activar"}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Editar
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
