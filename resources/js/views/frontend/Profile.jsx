import React, { useState } from "react";
import axios from "axios";
import "../../../../scss/Profile.scss";

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.withCredentials = true;

export default function Profile() {
  const [user, setUser] = useState(window.Laravel?.user || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const updateField = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const save = async () => {
  setSaving(true);
  setError(null);

  try {
    await axios.patch("http://127.0.0.1:8000/profile", user, {
      withCredentials: true,
    });
  } catch (err) {
    console.error("API ERROR:", err.response?.data || err.message);
    setError("No se pudo guardar el usuario");
  }

  setSaving(false);
};

 const logout = async () => {
  try {
    await axios.post("/logout", {}, {
      withCredentials: true,
    });

    window.location.href = "/";
  } catch (err) {
    console.error("Logout error:", err);
  }
};

  if (!user) {
    return <div>No hay usuario autenticado</div>;
  }

return (
  <div className="profile-page">
    <div className="profile-card">

      <h2 className="profile-title">Mi perfil</h2>

      {error && <div className="error">{error}</div>}

      {/* PERSONAL INFO */}
      <div className="profile-section">
        <h3>Información personal</h3>

        <input
          value={user.nombre || ""}
          onChange={(e) => updateField("nombre", e.target.value)}
          placeholder="Nombre"
        />

        <input
          value={user.apellidos || ""}
          onChange={(e) => updateField("apellidos", e.target.value)}
          placeholder="Apellidos"
        />
      </div>

      {/* CONTACT INFO */}
      <div className="profile-section">
        <h3>Contacto</h3>

        <input
          value={user.telefono || ""}
          onChange={(e) => updateField("telefono", e.target.value)}
          placeholder="Teléfono"
        />

        <input
          value={user.email || ""}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="Email"
        />
      </div>

      {/* ADDRESS */}
      <div className="profile-section">
        <h3>Dirección</h3>

        <input
          value={user.direccion || ""}
          onChange={(e) => updateField("direccion", e.target.value)}
          placeholder="Dirección"
        />
      </div>

      {/* ACTION */}
      <button
        onClick={save}
        disabled={saving}
        className="profile-btn"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>

      <button onClick={logout} className="profile-btn logout-btn">
        Cerrar sesión
      </button>

    </div>
  </div>
);
}