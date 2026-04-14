import React, { useEffect, useState } from "react";

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTipo, setNewTipo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTipo, setEditingTipo] = useState("");
  const [search, setSearch] = useState("");

  // Load categories
  const loadCategorias = () => {
    fetch("/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  // Create
  const handleCreate = async () => {
    if (!newTipo.trim()) return;

    try {
      await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: newTipo }),
      });
      setNewTipo("");
      setShowCreate(false);
      loadCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit
  const startEditing = (cat) => {
    setEditingId(cat.id);
    setEditingTipo(cat.tipo);
  };

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

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTipo("");
  };

  // Delete
  const deleteCategoria = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await fetch(`/api/categorias/${id}`, { method: "DELETE" });
      loadCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter
  const filteredCategorias = categorias.filter((cat) =>
    cat.tipo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-orange-500 mb-6 flex justify-center">
        LLista de Categorías
      </h1>
      <div className="mb-3 flex justify-center">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cercar per nom..." className="px-4 py-2 border rounded-lg w-80 shadow-sm"/>
      </div>

    <div className="flex flex-col gap-4 mb-6 items-center justify-center">
      {!showCreate ? (
        <div className="flex justify-center">
          <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={() => setShowCreate(true)}>
            Crear
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input type="text" value={newTipo} onChange={(e) => setNewTipo(e.target.value)} placeholder="Nova categoría" className="border p-2 rounded w-64"/>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCreate}>
            Registrar
          </button>
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => {setShowCreate(false); setNewTipo("");}}>
            Cancelar
          </button>
        </div>
      )}
    </div>

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

              <td className="p-3">
                {editingId === cat.id ? (
                  <input
                    type="text"
                    value={editingTipo}
                    onChange={(e) => setEditingTipo(e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  cat.tipo
                )}
              </td>

              <td className="p-3">
                {cat.estat ? (
                  <span className="text-green-600 font-semibold">
                    Activo
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    Inactivo
                  </span>
                )}
              </td>

              <td className="p-3 flex gap-2 flex-wrap">
                {editingId === cat.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(cat.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        fetch(`/api/categorias/${cat.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ estat: !cat.estat }),
                        }).then(() => loadCategorias())
                      }
                      className={`px-3 py-1 rounded ${
                        cat.estat
                          ? "bg-gray-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {cat.estat ? "Desactivar" : "Activar"}
                    </button>

                    {cat.estat && (
                      <button
                        onClick={() => startEditing(cat)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Editar
                      </button>
                    )}

                    {!cat.estat && (
                      <button
                        onClick={() => deleteCategoria(cat.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Borrar
                      </button>
                    )}
                  </>
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