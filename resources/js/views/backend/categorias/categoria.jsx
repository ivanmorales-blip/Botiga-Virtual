import React, { useEffect, useState } from "react";

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTipo, setNewTipo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTipo, setEditingTipo] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const loadCategorias = () => {
    setLoading(true);

    fetch("/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleCreate = async () => {
    if (!newTipo.trim()) return;

    try {
      await fetch("/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: newTipo,
        }),
      });

      setNewTipo("");
      setShowCreate(false);
      setStatusMessage("Category created successfully");
      loadCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (cat) => {
    setEditingId(cat.id);
    setEditingTipo(cat.tipo);
  };

  const saveEdit = async (id) => {
    if (!editingTipo.trim()) return;

    try {
      await fetch(`/api/categorias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: editingTipo,
        }),
      });

      setEditingId(null);
      setEditingTipo("");
      setStatusMessage("Category updated successfully");
      loadCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTipo("");
  };

  const deleteCategoria = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await fetch(`/api/categorias/${id}`, {
        method: "DELETE",
      });

      setStatusMessage("Category deleted successfully");
      loadCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (cat) => {
    try {
      await fetch(`/api/categorias/${cat.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estat: !cat.estat,
        }),
      });

      setStatusMessage(
        cat.estat
          ? "Category deactivated successfully"
          : "Category activated successfully"
      );

      loadCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCategorias = categorias.filter((cat) =>
    cat.tipo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-8 min-h-screen">
      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </div>

      <h1 className="text-3xl font-bold text-orange-700 mb-6 text-center">
        LLista de Categorías
      </h1>

      {/* Search */}
      <div className="mb-4 flex justify-center">
        <div>
          <label
            htmlFor="search-categoria"
            className="sr-only"
          >
            Search categories
          </label>

          <input
            id="search-categoria"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cercar per nom..."
            aria-describedby="search-help"
            className="px-4 py-2 border rounded-lg w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <p id="search-help" className="sr-only">
            Filter categories by name
          </p>
        </div>
      </div>

      {/* Create section */}
      <div className="flex flex-col gap-4 mb-6 items-center justify-center">
        {!showCreate ? (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            aria-label="Create new category"
            className="bg-orange-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Crear
          </button>
        ) : (
          <div
            className="flex gap-2 items-center"
            role="group"
            aria-label="Create category form"
          >
            <div>
              <label
                htmlFor="new-categoria"
                className="sr-only"
              >
                New category name
              </label>

              <input
                id="new-categoria"
                type="text"
                value={newTipo}
                onChange={(e) => setNewTipo(e.target.value)}
                placeholder="Nova categoría"
                className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="bg-green-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Registrar
            </button>

            <button
              type="button"
              onClick={() => {
                setShowCreate(false);
                setNewTipo("");
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <p
          role="status"
          aria-live="polite"
          className="text-center text-gray-700 mb-4"
        >
          Loading categories...
        </p>
      )}

      {/* Table */}
      <table
        className="w-full bg-white shadow rounded"
        aria-label="Categories table"
      >
        <caption className="sr-only">
          List of categories with status and actions
        </caption>

        <thead>
          <tr className="bg-orange-100 text-left">
            <th scope="col" className="p-3">
              ID
            </th>
            <th scope="col" className="p-3">
              Tipo
            </th>
            <th scope="col" className="p-3">
              Estado
            </th>
            <th scope="col" className="p-3">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredCategorias.map((cat) => (
            <tr key={cat.id} className="border-t">
              <th scope="row" className="p-3 font-normal">
                {cat.id}
              </th>

              <td className="p-3">
                {editingId === cat.id ? (
                  <input
                    type="text"
                    value={editingTipo}
                    onChange={(e) => setEditingTipo(e.target.value)}
                    aria-label={`Edit category ${cat.tipo}`}
                    className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  cat.tipo
                )}
              </td>

              <td className="p-3">
                {cat.estat ? (
                  <span
                    className="text-green-700 font-semibold"
                    aria-label="Category is active"
                  >
                    ✓ Activo
                  </span>
                ) : (
                  <span
                    className="text-red-700 font-semibold"
                    aria-label="Category is inactive"
                  >
                    ✕ Inactivo
                  </span>
                )}
              </td>

              <td className="p-3 flex gap-2 flex-wrap">
                {editingId === cat.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEdit(cat.id)}
                      aria-label={`Save changes for ${cat.tipo}`}
                      className="bg-green-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Guardar
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      aria-label="Cancel editing"
                      className="bg-gray-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleStatus(cat)}
                      aria-label={
                        cat.estat
                          ? `Deactivate category ${cat.tipo}`
                          : `Activate category ${cat.tipo}`
                      }
                      className={`px-3 py-1 rounded text-white focus:outline-none focus:ring-2 ${
                        cat.estat
                          ? "bg-gray-600 focus:ring-gray-500"
                          : "bg-green-600 focus:ring-green-500"
                      }`}
                    >
                      {cat.estat ? "Desactivar" : "Activar"}
                    </button>

                    {cat.estat && (
                      <button
                        type="button"
                        onClick={() => startEditing(cat)}
                        aria-label={`Edit category ${cat.tipo}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Editar
                      </button>
                    )}

                    {!cat.estat && (
                      <button
                        type="button"
                        onClick={() => deleteCategoria(cat.id)}
                        aria-label={`Delete category ${cat.tipo}`}
                        className="bg-red-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Borrar
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}

          {filteredCategorias.length === 0 && !loading && (
            <tr>
              <td
                colSpan={4}
                className="p-3 text-center text-gray-700"
              >
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}