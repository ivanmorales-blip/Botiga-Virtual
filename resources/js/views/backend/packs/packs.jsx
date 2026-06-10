import React, { useEffect, useState } from "react";
import PackEdit from "./packedit";

export default function Packs() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPackId, setEditingPackId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const loadPacks = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/packs");
      const data = await res.json();

      setPacks(data);
    } catch (err) {
      console.error("Error loading packs:", err);
      setStatusMessage("Error loading packs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacks();
  }, []);

  const toggleActive = async (pack) => {
    try {
      const res = await fetch(`/api/packs/${pack.id}/toggle`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Error toggling pack");
      }

      setStatusMessage(
        pack.estat ? "Pack deactivated" : "Pack activated"
      );

      loadPacks();
    } catch (err) {
      console.error("Toggle error:", err.message);
      setStatusMessage("Error updating pack status");
    }
  };

  return (
    <main className="p-8 min-h-screen bg-gray-50">
      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </div>

      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-10">
          Llista de Packs
        </h1>
      </header>

      {/* CREATE ACTION */}
      <nav className="text-center mb-10" aria-label="Pack actions">
        <a
          href="/packs-react/create"
          className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white font-semibold rounded-xl shadow-lg transition"
          aria-label="Create new pack"
        >
          + Crear Pack
        </a>
      </nav>

      {/* CONTENT STATES */}
      {loading ? (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="text-center text-gray-700"
        >
          Carregant packs...
        </div>
      ) : packs.length === 0 ? (
        <div
          role="status"
          className="text-center text-gray-700"
        >
          No hi ha packs disponibles
        </div>
      ) : (
        <section
          aria-label="List of packs"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {packs.map((pack) => (
            <article
              key={pack.id}
              aria-labelledby={`pack-title-${pack.id}`}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition flex flex-col"
            >
              {/* STATUS */}
              <div className="flex justify-end mb-3">
                <span
                  role="status"
                  aria-label={
                    pack.estat ? "Active pack" : "Inactive pack"
                  }
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    pack.estat
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {pack.estat ? "Actiu" : "Inactiu"}
                </span>
              </div>

              {/* TITLE */}
              <h2
                id={`pack-title-${pack.id}`}
                className="text-lg font-bold text-gray-800 mb-1"
              >
                {pack.nom}
              </h2>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 mb-2">
                {pack.Descripcio}
              </p>

              {/* PRICE */}
              <p className="text-orange-600 font-semibold mb-3">
                {pack.preu} €
              </p>

              {/* PRODUCTS LIST */}
              <section aria-label="Included products" className="mb-4">
                <p className="text-xs text-gray-500 mb-2">
                  Productes inclosos
                </p>

                <ul className="space-y-2 max-h-28 overflow-y-auto pr-1">
                  {(pack.productes || []).map((p) => (
                    <li
                      key={p.id}
                      className="flex justify-between items-center bg-gray-100 rounded-full px-4 py-1 text-sm text-gray-700"
                    >
                      <span className="truncate max-w-[70%]">
                        {p.nombre}
                      </span>

                      <span className="text-gray-500 text-xs ml-2">
                        x{p.pivot?.quantity || 1}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* IMAGES */}
              {pack.images?.length > 0 && (
                <section
                  className="mt-auto mb-4"
                  aria-label={`Images for ${pack.nom}`}
                >
                  <div className="flex gap-2 overflow-x-auto">
                    {pack.images.map((img, i) => (
                      <img
                        key={i}
                        src={img.url || img.image_path}
                        alt={`Pack ${pack.nom} image ${i + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* FOOTER ACTIONS */}
              <footer className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  ID #{pack.id}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(pack)}
                    aria-label={
                      pack.estat
                        ? `Deactivate pack ${pack.nom}`
                        : `Activate pack ${pack.nom}`
                    }
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white rounded-lg text-xs transition"
                  >
                    {pack.estat ? "Desactivar" : "Activar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingPackId(pack.id)}
                    aria-label={`Edit pack ${pack.nom}`}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white rounded-lg text-xs transition"
                  >
                    Editar
                  </button>
                </div>
              </footer>
            </article>
          ))}
        </section>
      )}

      {/* EDIT MODAL */}
      {editingPackId && (
        <PackEdit
          packId={editingPackId}
          onClose={() => setEditingPackId(null)}
        />
      )}
    </main>
  );
}