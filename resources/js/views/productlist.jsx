import React, { useEffect, useState } from "react";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedFields, setEditedFields] = useState({});
  const [search, setSearch] = useState("");

  // Load products from API
  const loadProducts = () => {
    setLoading(true);
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  };

  // Load categories from API
  const loadCategories = () => {
    fetch("/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error loading categories:", err));
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Delete product (only if estat=false)
  const deleteProduct = async (id) => {
    if (!confirm("Segur que vols eliminar aquest producte?")) return;
    try {
      const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        alert(json.message || "No es pot eliminar");
      }
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle active/inactive
  const toggleActive = async (product) => {
    const action = product.estat ? "deactivate" : "activate";
    try {
      const res = await fetch(`/api/productos/${product.id}/${action}`, { method: "POST" });
      if (!res.ok) {
        const json = await res.json();
        alert(json.message || "Error toggling product");
      }
      loadProducts();
    } catch (err) {
      console.error("Error toggling product:", err);
    }
  };

  // Start editing a product
  const startEdit = (product) => {
    setEditingId(product.id);
    setEditedFields({
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock,
      descripcion: product.descripcion || "",
      categoria_id: product.categoria_id || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedFields({});
  };

  // Save edited product
  const saveEdit = async (id) => {
    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedFields),
      });
      if (!res.ok) {
        const json = await res.json();
        alert(json.message || "Error updating product");
      }
      cancelEdit();
      loadProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-orange-500 text-center">
        Llista de Productes
      </h1>

      {/* Search bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca per nom..."
          className="px-4 py-2 border rounded-lg w-80"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Carregant productes...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500">No hi ha productes</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition"
            >
              {/* Status */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    p.estat ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {p.estat ? "Actiu" : "Inactiu"}
                </span>
              </div>

              {editingId === p.id ? (
                <>
                  {/* Editable inputs */}
                  <input
                    type="text"
                    value={editedFields.nombre}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, nombre: e.target.value })
                    }
                    className="w-full mb-1 px-2 py-1 border rounded text-gray-800"
                  />
                  <input
                    type="number"
                    value={editedFields.precio}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, precio: e.target.value })
                    }
                    className="w-full mb-1 px-2 py-1 border rounded text-orange-500 font-semibold"
                  />
                  <input
                    type="number"
                    value={editedFields.stock}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, stock: e.target.value })
                    }
                    className="w-full mb-1 px-2 py-1 border rounded text-gray-500"
                  />
                  <textarea
                    value={editedFields.descripcion}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, descripcion: e.target.value })
                    }
                    className="w-full mb-1 px-2 py-1 border rounded text-gray-500"
                  />
                  <select
                    value={editedFields.categoria_id}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, categoria_id: e.target.value })
                    }
                    className="w-full mb-3 px-2 py-1 border rounded text-gray-700"
                  >
                    <option value="">Sense categoria</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.tipo}
                      </option>
                    ))}
                  </select>

                  <div className="flex justify-between">
                    <button
                      onClick={() => saveEdit(p.id)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-black rounded text-sm"
                    >
                      Cancel·lar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Display fields */}
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{p.nombre}</h2>
                  <p className="text-gray-600 text-sm mb-1">ID: {p.id}</p>
                  <p className="text-orange-500 font-semibold mb-1">Preu: {p.precio} €</p>
                  <p className="text-gray-500 text-sm mb-1">Stock: {p.stock}</p>
                  <p className="text-gray-500 text-sm mb-2">{p.descripcion}</p>
                  <p className="text-gray-500 text-sm mb-4">
                    {p.categoria?.tipo || "Sense categoria"}
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleActive(p)}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                    >
                      {p.estat ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(p.id)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                    >
                      Eliminar
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
                    >
                      Editar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <a
          href="/products-react/create"
          className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition"
        >
          Crear Producte
        </a>
      </div>
    </div>
  );
}