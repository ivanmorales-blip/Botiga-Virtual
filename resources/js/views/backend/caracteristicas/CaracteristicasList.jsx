import React, { useState, useEffect } from "react";

export default function CaracteristicasList() {
  // States
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [newDescripcion, setNewDescripcion] = useState("");
  const [editingTipoId, setEditingTipoId] = useState(null);
  const [creating, setCreating] = useState(false);

  const [newTipo, setNewTipo] = useState("");
  const [creatingTipo, setCreatingTipo] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingDescripcion, setEditingDescripcion] = useState("");
  const [editingTipo, setEditingTipo] = useState(null);

  const [showCreateCaracteristica, setShowCreateCaracteristica] = useState(false);
  const [showCreateTipo, setShowCreateTipo] = useState(false);
  

  const loadData = async () => {
    setLoading(true);
    try {
      const resC = await fetch("/api/caracteristicas");
      if (!resC.ok) throw new Error("Error loading caracteristicas");
      const dataC = await resC.json();
      setCaracteristicas(dataC);

      // Fetch tipos
      const resT = await fetch("/api/tipos-caracteristicas");
      if (!resT.ok) throw new Error("Error loading tipos");
      const dataT = await resT.json();
      setTipos(dataT);
    } catch (err) {
      console.error("Error loading data:", err);
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = caracteristicas.filter((c) =>
    c.descripcio.toLowerCase().includes(search.toLowerCase())
  );

const handleCreate = async () => {
  if (!newDescripcion.trim() || !editingTipoId) return;

  setCreating(true);
  try {
    const res = await fetch("/api/caracteristicas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        descripcio: newDescripcion,
        tipo_id: Number(editingTipoId),
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(JSON.stringify(data));

    setNewDescripcion("");
    setEditingTipoId(null);
    await loadData();
  } catch (err) {
    console.error(err);
    alert("Error creating caracteristica");
  } finally {
    setCreating(false);
  }
};

  const handleCreateTipo = async () => {
    if (!newTipo.trim()) return;
    setCreatingTipo(true);
    try {
      const res = await fetch("/api/tipo-caracteristicas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: newTipo }),
      });
      if (!res.ok) throw new Error("Error creating tipo");
      setNewTipo("");
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Error creating tipo");
    } finally {
      setCreatingTipo(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editingDescripcion.trim() || !editingTipo) return;
    try {
      const res = await fetch(`/api/caracteristicas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcio: editingDescripcion,
          tipo_id: editingTipo,
        }),
      });
      if (!res.ok) throw new Error("Error updating caracteristica");
      setEditingId(null);
      setEditingDescripcion("");
      setEditingTipo(null);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Error updating caracteristica");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Segur que vols eliminar aquesta característica?")) return;
    try {
      const res = await fetch(`/api/caracteristicas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error deleting caracteristica");
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Error deleting caracteristica");
    }
  };

return (
  <div className="p-8 min-h-screen">
    <h1 className="text-3xl font-bold mb-6 text-orange-600 text-center">
      Llista de Característiques
    </h1>

    <div className="flex justify-center mb-6">
      <div>
        <label htmlFor="search-caracteristiques" className="sr-only">
          Cerca per descripció
        </label>
        <input
          id="search-caracteristiques"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca per descripció..."
          className="border px-4 py-2 rounded w-80 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
        />
      </div>
    </div>

    <div className="flex gap-8 mb-6 items-start justify-end">

      <div className="flex flex-col gap-4 items-start">
        {!showCreateCaracteristica ? (
          <button
            type="button"
            className="bg-orange-600 text-white px-4 py-2 rounded"
            onClick={() => setShowCreateCaracteristica(true)}
          >
            Nova característica
          </button>
        ) : (
          <div className="flex gap-2" role="group" aria-label="Crear característica">

            <div>
              <label htmlFor="new-caracteristica" className="sr-only">
                Nova característica
              </label>
              <input
                id="new-caracteristica"
                type="text"
                value={newDescripcion}
                onChange={(e) => setNewDescripcion(e.target.value)}
                placeholder="Nova característica"
                className="border px-4 py-2 rounded w-64 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="new-tipo" className="sr-only">
                Selecciona tipus
              </label>
              <select
                id="new-tipo"
                value={editingTipoId || ""}
                onChange={(e) => setEditingTipoId(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="">Selecciona tipus</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tipo}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              disabled={creating || !editingTipoId || !newDescripcion.trim()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
            >
              {creating ? "Creant..." : "Crear"}
            </button>

            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setShowCreateCaracteristica(false);
                setNewDescripcion("");
                setEditingTipoId(null);
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 items-start">
        {!showCreateTipo ? (
          <button
            type="button"
            className="bg-orange-600 text-white px-4 py-2 rounded"
            onClick={() => setShowCreateTipo(true)}
          >
            Nou tipus de característica
          </button>
        ) : (
          <div className="flex gap-2" role="group" aria-label="Crear tipus">

            <div>
              <label htmlFor="new-tipo-name" className="sr-only">
                Nom del tipus
              </label>
              <input
                id="new-tipo-name"
                type="text"
                value={newTipo}
                onChange={(e) => setNewTipo(e.target.value)}
                placeholder="Nou tipus"
                className="border px-3 py-2 rounded w-64"
              />
            </div>

            <button
              type="button"
              onClick={handleCreateTipo}
              disabled={creatingTipo || !newTipo.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
            >
              {creatingTipo ? "Creant tipus..." : "Crear tipus"}
            </button>

            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setShowCreateTipo(false);
                setNewTipo("");
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>

    {loading ? (
      <div
        className="text-center text-gray-600"
        aria-live="polite"
      >
        Carregant...
      </div>
    ) : filtered.length === 0 ? (
      <div
        className="text-center text-gray-600"
        aria-live="polite"
      >
        No hi ha característiques
      </div>
    ) : (
      <div
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        role="list"
      >
        {filtered.map((c) => (
          <article
            key={c.id}
            role="listitem"
            className="bg-white rounded-xl shadow border p-4 flex flex-col justify-between hover:shadow-lg transition"
          >
            {editingId === c.id ? (
              <>
                <label htmlFor={`desc-${c.id}`} className="sr-only">
                  Descripció
                </label>
                <input
                  id={`desc-${c.id}`}
                  type="text"
                  value={editingDescripcion}
                  onChange={(e) => setEditingDescripcion(e.target.value)}
                  className="border px-2 py-1 rounded mb-2"
                />

                <label htmlFor={`tipo-${c.id}`} className="sr-only">
                  Tipus
                </label>
                <select
                  id={`tipo-${c.id}`}
                  value={editingTipo || ""}
                  onChange={(e) => setEditingTipo(e.target.value)}
                  className="border px-2 py-1 rounded mb-2"
                >
                  <option value="">Selecciona tipus</option>
                  {tipos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tipo}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleUpdate(c.id)}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  Guardar
                </button>
              </>
            ) : (
              <>
                <h2 className="text-gray-800 font-medium mb-2">
                  {c.descripcio}
                </h2>

                <p className="text-gray-600 text-sm mb-2">
                  Tipus: {c.tipo?.tipo || "Sense tipus"}
                </p>

                <div className="flex justify-between mt-2">
                  <button
                    type="button"
                    aria-label={`Editar ${c.descripcio}`}
                    onClick={() => {
                      setEditingId(c.id);
                      setEditingDescripcion(c.descripcio);
                      setEditingTipo(c.tipo_id);
                    }}
                    className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    aria-label={`Eliminar ${c.descripcio}`}
                    onClick={() => handleDelete(c.id)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    )}
  </div>
);
}