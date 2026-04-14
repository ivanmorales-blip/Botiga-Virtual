import "../../../../scss/solucions.scss";
import React, { useState } from "react";

export default function CreateSolucions() {
  const [descripcio, setDescripcio] = useState("");
  const [correu, setCorreu] = useState("");
  const [telefon, setTelefon] = useState("");
  const [estat, setEstat] = useState("pendent");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("descripcio", descripcio);
    formData.append("correu_electronic", correu);
    formData.append("telefon", telefon);
    formData.append("estat", "pendent");
    files.forEach((file) => formData.append("attachments[]", file));

    setLoading(true);
    setErrors([]);

    try {
      const res = await fetch("/api/solucions", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        setErrors(errData.errors || ["Error al enviar"]);
      } else {
        await res.json();
        setDescripcio("");
        setCorreu("");
        setTelefon("");
        setFiles([]);
        setShowSuccessPopup(true); 
      }
    } catch (err) {
      console.error("Error uploading:", err);
      setErrors(["Error de connexió"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solucions-form max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-orange-600 text-center">
        Solicitar Solució
      </h1>

      {errors.length > 0 && (
        <div className="errors mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Descripció"
          value={descripcio}
          onChange={(e) => setDescripcio(e.target.value)}
          className="input-field w-full border p-2 rounded"
          rows={5}
          required
        />

        <input
          type="email"
          placeholder="Correu electrònic"
          value={correu}
          onChange={(e) => setCorreu(e.target.value)}
          className="input-field w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Telèfon"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          className="input-field w-full border p-2 rounded"
          required
        />

        <label className="block">
          <span className="font-semibold">Adjuntar fitxers</span>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFiles}
            className="mt-2 file-input"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Creant..." : "Crear"}
        </button>
      </form>

      {showSuccessPopup && (
        <div className="success-popup-overlay" onClick={() => setShowSuccessPopup(false)}>
          <div className="success-popup" onClick={(e) => e.stopPropagation()}>
            <p>La solució s'ha enviat correctament!</p>
            <button onClick={() => setShowSuccessPopup(false)}>Tancar</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .success-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .success-popup {
          background: #fff;
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .success-popup button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #f97316;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: bold;
        }

        .success-popup button:hover {
          background: #ea580c;
        }
      `}</style>
    </div>
  );
}