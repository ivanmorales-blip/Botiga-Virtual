import React, { useEffect, useState } from "react";

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [tipo, setTipo] = useState(""); // new category
  const [editingId, setEditingId] = useState(null); // id being edited
  const [editingTipo, setEditingTipo] = useState(""); // inline edit value
  const [search, setSearch] = useState(""); // search input

  // Load categories from API
  const loadCategorias = () => {
    fetch("/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  // Create new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipo.trim()) return;

    try {
      await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo }),
      });
      setTipo("");
      loadCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  // Inline edit start
  const startEditing = (cat) => {
    setEditingId(cat.id);
    setEditingTipo(cat.tipo);
  };

  // Save inline edit
  const saveEdit = async (id) => {
    if (!editingTipo.trim()) return;

    try {
      await fetch(`/api/categorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: editingTipo }),
      });
      setEditingId(null);
      setEditingTipo("");
      loadCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel inline edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTipo("");
  };

  // Deactivate category
  const deactivateCategoria = async (id) => {
    try {
      await fetch(`/api/categorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estat: false }),
      });
      loadCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete category (only if estat = false)
  const deleteCategoria = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await fetch(`/api/categorias/${id}`, { method: "DELETE" });
      loadCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter categories by search
  const filteredCategorias = categorias.filter((cat) =>
    cat.tipo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">Categorías</h1>

      {/* New category form */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Tipo de categoría" className="border p-2 rounded w-64" required/>
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
          Crear
        </button>
      </form>

      {/* Search bar */}
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar categoría..." className="mb-4 p-2 border rounded w-64"/>

      {/* Categories table */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-orange-100 text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Tipo</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategorias.map((cat) => (
            <tr key={cat.id} className="border-t">
              <td className="p-3">{cat.id}</td>

              {/* Inline edit for tipo */}
              <td className="p-3">
                {editingId === cat.id ? (
                  <input type="text" value={editingTipo} onChange={(e) => setEditingTipo(e.target.value)} className="border p-1 rounded w-full"/>
                ) : (
                  cat.tipo
                )}
              </td>

              {/* Estado column */}
              <td className="p-3">
                {cat.estat ? (
                  <span className="text-green-600 font-semibold">Activo</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactivo</span>
                )}
              </td>

              <td className="p-3 flex gap-2">
                {editingId === cat.id ? (
                  <>
                    <button onClick={() => saveEdit(cat.id)} className="bg-green-500 text-white px-3 py-1 rounded">
                      Guardar
                    </button>
                    <button onClick={cancelEdit} className="bg-gray-400 text-white px-3 py-1 rounded">
                      Cancelar
                    </button>
                  </>
                ) : (
                  <React.Fragment>
                    {/* Toggle Activate/Deactivate */}
                    <button
                      onClick={() =>
                        fetch(`/api/categorias/${cat.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ estat: !cat.estat }),
                        }).then(() => loadCategorias())
                      }
                      className={`px-3 py-1 rounded ${
                        cat.estat ? "bg-gray-500 text-white" : "bg-green-500 text-white"
                      }`}
                    >
                      {cat.estat ? "Desactivar" : "Activar"}
                    </button>

                    {/* Edit button only if active */}
                    {cat.estat ? (
                      <button onClick={() => startEditing(cat)} className="bg-blue-500 text-white px-3 py-1 rounded">
                        Editar
                      </button>
                    ) : null}

                    {/* Delete button only if inactive */}
                    {!cat.estat ? (
                      <button onClick={() => deleteCategoria(cat.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                        Borrar
                      </button>
                    ) : null}
                  </React.Fragment>
                )}
              </td>
            </tr>
          ))}

          {filteredCategorias.length === 0 && (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}