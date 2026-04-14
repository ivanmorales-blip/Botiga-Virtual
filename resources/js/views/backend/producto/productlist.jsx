import React, { useEffect, useState } from "react";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editedFields, setEditedFields] = useState({});
  const [search, setSearch] = useState("");

  const safeJson = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error("❌ Not JSON response:", text);
      throw new Error("Server returned HTML instead of JSON");
    }
  };

  // 🔹 Load data
  const loadProducts = () => {
    setLoading(true);
    fetch("/api/productos")
      .then(safeJson)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
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

  // 🔹 Group características
  const groupedCaracteristicas = caracteristicas.reduce((acc, c) => {
    const key = c.tipo?.nombre || "Altres";
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  // 🔹 Toggle active
  const toggleActive = async (product) => {
    try {
      await fetch(`/api/productos/${product.id}/${product.estat ? "deactivate" : "activate"}`, {
        method: "POST",
      });
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Start edit
  const startEdit = (product) => {
    setEditingId(product.id);
    setEditedFields({
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock,
      descripcion: product.descripcion || "",
      categoria_id: product.categoria_id || "",
      marca: product.marca || "",
      caracteristicas: product.caracteristicas?.map((c) => c.id) || [],
      destacat: product.destacat || false,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedFields({});
  };

  const toggleEditCaracteristica = (id) => {
    setEditedFields((prev) => {
      const current = prev.caracteristicas || [];
      return {
        ...prev,
        caracteristicas: current.includes(id)
          ? current.filter((c) => c !== id)
          : [...current, id],
      };
    });
  };

  // 🔹 Save edit
  const saveEdit = async (id) => {
    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedFields),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        console.error("Update error:", data);
        alert("Error updating product");
        return;
      }

      cancelEdit();
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // 🔹 Filter
  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-orange-500 text-center">
        Llista de Productes
      </h1>

      <div className="mb-3 flex justify-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca per nom..." className="px-4 py-2 border rounded-lg w-80 shadow-sm"/>
      </div>
      <div className="mt-10 text-center mb-6">
        <a href="/products-react/create" className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition">
          Crear Entrada Producte
        </a>
      </div>


      {loading ? (
        <p className="text-center text-gray-500">Carregant...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-400">No hi ha productes</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    p.estat
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {p.estat ? "Actiu" : "Inactiu"}
                </span>

                {p.destacat ? (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    ⭐ Destacat
                  </span>
                ) : null}
              </div>

              {editingId === p.id ? (
                <>
                  <input
                    value={editedFields.nombre}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, nombre: e.target.value })
                    }
                    className="w-full border p-2 mt-2 rounded"
                  />
                  <input
                    type="number"
                    value={editedFields.precio}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, precio: e.target.value })
                    }
                    className="w-full border p-2 mt-1 rounded"
                  />
                  <input
                    type="number"
                    value={editedFields.stock}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, stock: e.target.value })
                    }
                    className="w-full border p-2 mt-1 rounded"
                  />
                  <input
                    value={editedFields.marca}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, marca: e.target.value })
                    }
                    className="w-full border p-2 mt-1 rounded"
                  />
                  <textarea
                    value={editedFields.descripcion}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, descripcion: e.target.value })
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
                    <label className="text-sm font-semibold text-gray-700">
                      Producte destacat
                    </label>
                  </div>

                  <div className="mt-3">
                    <strong className="text-sm">Característiques</strong>

                    {Object.entries(groupedCaracteristicas).map(([tipo, items]) => (
                      <div key={tipo} className="mt-2">
                        <p className="text-xs font-semibold text-gray-500">{tipo}</p>

                        {items.map((c) => (
                          <label key={c.id} className="flex gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={editedFields.caracteristicas?.includes(c.id)}
                              onChange={() => toggleEditCaracteristica(c.id)}
                            />
                            {c.descripcio}
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => saveEdit(p.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-300 px-3 py-1 rounded"
                    >
                      Cancel·lar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-bold text-lg mt-2">{p.nombre}</h2>
                  <p className="text-orange-500 font-semibold">{p.precio} €</p>

                  {p.stock > 0 && (
                    <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                  )}

                  <p className="text-sm text-gray-500">Marca: {p.marca || "—"}</p>

                  <p className="text-xs text-gray-400 mt-2">
                    {p.categoria?.tipo || "Sense categoria"}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => toggleActive(p)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      {p.estat ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      onClick={() => startEdit(p)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
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
    </div>
  );
}