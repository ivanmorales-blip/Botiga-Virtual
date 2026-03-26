import React, { useEffect, useState } from "react";
import "../../../../scss/solucions.scss";

export default function SolucionsAdmin() {
  const [solucions, setSolucions] = useState([]);
  const [filter, setFilter] = useState("actives"); // default view

  const fetchData = () => {
    fetch("/api/solucions")
      .then(res => res.json())
      .then(data => setSolucions(data))
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateEstat = async (id, estat) => {
    try {
      const res = await fetch(`/api/solucions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ estat })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        return;
      }

      // update locally
      setSolucions(prev =>
        prev.map(sol =>
          sol.id === id ? { ...sol, estat } : sol
        )
      );

    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // ✅ Filtering logic
  const filteredSolucions = solucions.filter(sol => {
    if (filter === "actives") {
      return sol.estat === "pendent" || sol.estat === "en_proces";
    }
    if (filter === "") return true; // tots
    return sol.estat === filter;
  });

  return (
    <div className="solucions-admin">
      <h2>Gestió de Solucions</h2>

      {/* ✅ FILTER DROPDOWN */}
      <div className="filter-bar">
        <label>
          Filtrar:
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="actives">Actives</option>
            <option value="">Totes</option>
            <option value="pendent">Pendent</option>
            <option value="en_proces">En procés</option>
            <option value="completat">Completat</option>
          </select>
        </label>
      </div>

      <div className="solucions-grid">
        {filteredSolucions.length ? (
          filteredSolucions.map(sol => (
            <div key={sol.id} className="solucio-card">
              <p><strong>Descripció:</strong> {sol.descripcio}</p>
              <p><strong>Email:</strong> {sol.correu_electronic || "-"}</p>
              <p><strong>Telèfon:</strong> {sol.telefon || "-"}</p>

              <select
                value={sol.estat}
                onChange={(e) => updateEstat(sol.id, e.target.value)}
              >
                <option value="pendent">Pendent</option>
                <option value="en_proces">En procés</option>
                <option value="completat">Completat</option>
              </select>

              <div className="attachments">
                {sol.attachments?.length ? (
                  sol.attachments.map(file => (
                    <div key={file.id} className="attachment-item">
                      {file.tipus_arxiu.startsWith("image") ? (
                        <img
                          src={`/storage/${file.path}`}
                          alt={file.nom}
                        />
                      ) : (
                        <a
                          href={`/storage/${file.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.nom}
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No hi ha fitxers</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No hi ha solucions</p>
        )}
      </div>
    </div>
  );
}