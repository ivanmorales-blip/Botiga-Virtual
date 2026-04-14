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
    <div className="p-8  min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-orange-500 text-center">
        Llista de Packs
      </h1>

      <div className="mt-10 text-center">
        <a href="/packs-react/create" className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition">
          Crear Pack
        </a>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Carregant packs...</div>
      ) : packs.length === 0 ? (
        <div className="text-center text-gray-500">No hi ha packs disponibles</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
                      <div
            key={pack.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition"
          >

            {/* 🖼 Images carousel */}
            {pack.images?.length > 0 && (
              <div className="flex gap-2 overflow-x-auto mb-4">
                {pack.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-bold text-gray-800">
                {pack.nom}
              </h2>

              {/* ✅ Active badge */}
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  pack.actiu
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {pack.actiu ? "Actiu" : "Inactiu"}
              </span>
            </div>

            {/* ✅ Description (RESTORED) */}
            <p className="text-gray-600 text-sm mb-2">
              {pack.Descripcio}
            </p>

            {/* ✅ Price */}
            <p className="text-sm text-orange-500 font-semibold mb-2">
              {pack.preu} €
            </p>

            {/* ✅ Product count (RESTORED + IMPROVED) */}
            <p className="text-sm text-gray-500 mb-4">
              {(pack.productes || []).reduce(
                (sum, p) => sum + (p.pivot?.quantity || 1),
                0
              )}{" "}
              productes
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Pack #{pack.id}
              </span>

              <div className="flex gap-2">
                {/* Toggle active */}
                <button
                  onClick={() => toggleActive(pack)}
                  className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                >
                  {pack.actiu ? "Desactivar" : "Activar"}
                </button>

                {/* Edit */}
                <button
                  onClick={() => setEditingPackId(pack.id)}
                  className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm"
                >
                  Editar
                </button>
              </div>
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
    </div>
  );
}