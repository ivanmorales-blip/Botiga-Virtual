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

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("descripcio", descripcio);
  formData.append("correu_electronic", correu);
  formData.append("telefon", telefon);
  formData.append("estat", "pendent"); // always pending

  files.forEach(file => formData.append("attachments[]", file));

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
      const data = await res.json();
      console.log(data);
      setDescripcio("");
      setCorreu("");
      setTelefon("");
      setFiles([]);

      window.location.assign("/"); 
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
      <h1 className="text-2xl font-bold mb-6 text-orange-600 text-center padding-bottom: 40rem;">Solicitar Solució</h1>

      {errors.length > 0 && (
        <div className="errors mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <textarea
        placeholder="Descripció"
        value={descripcio}
        onChange={e => setDescripcio(e.target.value)}
        className="input-field w-full border p-2 rounded"
        rows={5} 
        required
        />

        <input
          type="email"
          placeholder="Correu electrònic"
          value={correu}
          onChange={e => setCorreu(e.target.value)}
          className="input-field w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Telèfon"
          value={telefon}
          onChange={e => setTelefon(e.target.value)}
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
    </div>
  );
}