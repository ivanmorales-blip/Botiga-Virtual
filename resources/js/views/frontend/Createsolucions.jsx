import "../../../../scss/solucions.scss";
import React, { useState } from "react";
import { notify } from "../../utils/notification.js";

export default function CreateSolucions() {
  const [descripcio, setDescripcio] = useState("");
  const [correu, setCorreu] = useState("");
  const [telefon, setTelefon] = useState("");
  const [files, setFiles] = useState([]);

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

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

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || ["Error al enviar"]);
        notify("error", "Error al enviar la solució");
        return;
      }

      setDescripcio("");
      setCorreu("");
      setTelefon("");
      setFiles([]);

      notify("success", "La solució s'ha enviat correctament!");
    } catch (err) {
      console.error("Error uploading:", err);
      setErrors(["Error de connexió"]);
      notify("error", "Error de connexió");
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
      <div
        className="errors mb-4 p-3 bg-red-100 text-red-700 rounded"
        role="alert"
        aria-live="assertive"
      >
        <h2 className="sr-only">Errors del formulari</h2>

        {errors.map((e, i) => (
          <p key={i}>{e}</p>
        ))}
      </div>
    )}

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-label="Formulari de sol·licitud"
    >
      <div>
        <label
          htmlFor="descripcio"
          className="block font-semibold mb-1"
        >
          Descripció
        </label>

        <textarea
          id="descripcio"
          value={descripcio}
          onChange={(e) => setDescripcio(e.target.value)}
          className="input-field w-full border p-2 rounded"
          rows={5}
          required
          aria-required="true"
        />
      </div>

      <div>
        <label
          htmlFor="correu"
          className="block font-semibold mb-1"
        >
          Correu electrònic
        </label>

        <input
          id="correu"
          type="email"
          value={correu}
          onChange={(e) => setCorreu(e.target.value)}
          className="input-field w-full border p-2 rounded"
          autoComplete="email"
          required
          aria-required="true"
        />
      </div>

      <div>
        <label
          htmlFor="telefon"
          className="block font-semibold mb-1"
        >
          Telèfon
        </label>

        <input
          id="telefon"
          type="tel"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          className="input-field w-full border p-2 rounded"
          autoComplete="tel"
          required
          aria-required="true"
        />
      </div>

      <div>
        <label
          htmlFor="fitxers"
          className="block font-semibold"
        >
          Adjuntar fitxers
        </label>

        <p
          id="fitxers-help"
          className="text-sm text-gray-500 mt-1 mb-2"
        >
          Formats acceptats: imatges i PDF.
        </p>

        <input
          id="fitxers"
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleFiles}
          className="mt-2 file-input"
          aria-describedby="fitxers-help"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition-colors"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Creant..." : "Crear"}
      </button>
    </form>
  </div>
);
}