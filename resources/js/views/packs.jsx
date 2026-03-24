import React, { useEffect, useState } from "react";
import PackEdit from "./packedit";

export default function Packs() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPackId, setEditingPackId] = useState(null);

  // Load packs from API
  const loadPacks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/packs");
      const data = await res.json();
      setPacks(data);
    } catch (err) {
      console.error("Error loading packs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacks();
  }, []);

  // Delete pack
  const deletePack = async (id) => {
    if (!confirm("Segur que vols eliminar aquest pack?")) return;
    try {
      await fetch(`/api/packs/${id}`, { method: "DELETE" });
      loadPacks();
    } catch (err) {
      console.error(err);
    }
  };

  // Handler after editing
  const handlePackSaved = () => {
    setEditingPackId(null);
    loadPacks();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-orange-500 text-center">
        Llista de Packs
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">Carregant packs...</div>
      ) : packs.length === 0 ? (
        <div className="text-center text-gray-500">No hi ha packs disponibles</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                  Pack
                </span>

                <button
                  onClick={() => deletePack(pack.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-semibold"
                  title="Eliminar Pack"
                >
                  <svg className="h-4 w-4">
                    <use href="/icons/sprite.svg#icon-trash"></use>
                  </svg>
                  Eliminar
                </button>
              </div>

              {/* Pack info */}
              <h2 className="text-xl font-bold text-gray-800 mb-1">{pack.nom}</h2>
              <p className="text-gray-600 text-sm mb-3">{pack.Descripcio}</p>
              <p className="text-sm text-orange-500 font-semibold mb-3">{pack.preu} €</p>

              {/* Products summary */}
              <p className="text-sm text-gray-500 mb-4">
                {(pack.productes || []).reduce(
                  (sum, p) => sum + (p.pivot?.quantity || 1),
                  0
                )}{" "}
                productes
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Pack ID #{pack.id}</span>

                {/* Edit button */}
                <button
                  onClick={() => setEditingPackId(pack.id)}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition"
                >
                  Editar Pack
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline Edit */}
      {editingPackId && (
        <div className="mt-10">
          <PackEdit packId={editingPackId} onSaved={handlePackSaved} />
        </div>
      )}

      {/* Back / Create button */}
      <div className="mt-10 text-center">
        <a
          href="/packs-react/create"
          className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition"
        >
          Crear Pack
        </a>
      </div>
    </div>
  );
}