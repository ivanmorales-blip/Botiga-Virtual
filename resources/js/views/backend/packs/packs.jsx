import React, { useEffect, useState } from "react";
import PackEdit from "./packedit";

export default function Packs() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPackId, setEditingPackId] = useState(null);

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

  const toggleActive = async (pack) => {
    try {
      await fetch(`/api/packs/${pack.id}/toggle`, {
        method: "POST",
      });
      loadPacks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-10">
        Llista de Packs
      </h1>

      {/* CREATE */}
      <div className="text-center mb-10">
        <a
          href="/packs-react/create"
          className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg transition"
        >
          + Crear Pack
        </a>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center text-gray-500">Carregant packs...</div>
      ) : packs.length === 0 ? (
        <div className="text-center text-gray-500">
          No hi ha packs disponibles
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition flex flex-col"
            >
              {/* STATUS FIRST (MOVED UP) */}
              <div className="flex justify-end mb-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    pack.estat
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {pack.estat ? "Actiu" : "Inactiu"}
                </span>
              </div>

              {/* TITLE */}
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                {pack.nom}
              </h2>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 mb-2">
                {pack.Descripcio}
              </p>

              {/* PRICE */}
              <p className="text-orange-500 font-semibold mb-3">
                {pack.preu} €
              </p>

              {/* PRODUCTS LIST */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">
                  Productes inclosos
                </p>

                <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
                  {(pack.productes || []).map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center bg-gray-100 rounded-full px-4 py-1 text-sm text-gray-700"
                    >
                      <span className="truncate max-w-[70%]">
                        {p.nombre}
                      </span>

                      <span className="text-gray-500 text-xs ml-2">
                        x{p.pivot?.quantity || 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* IMAGES MOVED TO BOTTOM (LESS CLUTTER) */}
              {pack.images?.length > 0 && (
                <div className="mt-auto mb-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {pack.images.map((img, i) => (
                      <img
                        key={i}
                        src={img.url || img.image_path}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* FOOTER ACTIONS */}
              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  #{pack.id}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(pack)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs transition"
                  >
                    {pack.estat ? "Desactivar" : "Activar"}
                  </button>

                  <button
                    onClick={() => setEditingPackId(pack.id)}
                    className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs transition"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editingPackId && (
        <PackEdit
          packId={editingPackId}
          onClose={() => setEditingPackId(null)}
        />
      )}
    </div>
  );
}