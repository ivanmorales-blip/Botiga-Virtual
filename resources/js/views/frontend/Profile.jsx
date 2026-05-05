import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../../scss/Profile.scss";

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.withCredentials = true;

export default function Profile() {
  const [user, setUser] = useState(window.Laravel?.user || null);
  const [tempUser, setTempUser] = useState(window.Laravel?.user || null);
  const [pedidos, setPedidos] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* =========================
     SYNC TEMP USER
  ========================= */
  useEffect(() => {
    setTempUser(user);
  }, [user]);

  /* =========================
     FETCH PEDIDOS
  ========================= */
  useEffect(() => {
    axios
      .get("/my-pedidos")
      .then((res) => setPedidos(res.data))
      .catch((err) => console.error("Error loading pedidos:", err));
  }, []);

  /* =========================
     UPDATE TEMP FIELD
  ========================= */
  const updateField = (field, value) => {
    setTempUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================
     SAVE PROFILE
  ========================= */
  const save = async () => {
    setSaving(true);
    setError(null);

    try {
      await axios.patch("/profile", tempUser);
      setUser(tempUser);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el usuario");
    }

    setSaving(false);
  };

  /* =========================
     CANCEL EDIT
  ========================= */
  const cancelEdit = () => {
    setTempUser(user);
    setEditing(false);
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = async () => {
    try {
      await axios.post("/logout");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /* =========================
     EMPTY STATE
  ========================= */
  if (!user) {
    return <div>No hay usuario autenticado</div>;
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="profile-page">
      <div className="profile-card">

        <h2 className="profile-title">Mi perfil</h2>

        {error && <div className="error">{error}</div>}

        {/* =========================
            PERSONAL INFO
        ========================= */}
        <div className="profile-section">
          <h3>Información personal</h3>

          <input
            value={tempUser?.nombre || ""}
            onChange={(e) => updateField("nombre", e.target.value)}
            disabled={!editing}
            placeholder="Nombre"
          />

          <input
            value={tempUser?.apellidos || ""}
            onChange={(e) => updateField("apellidos", e.target.value)}
            disabled={!editing}
            placeholder="Apellidos"
          />
        </div>

        {/* =========================
            CONTACT INFO
        ========================= */}
        <div className="profile-section">
          <h3>Contacto</h3>

          <input
            value={tempUser?.telefono || ""}
            onChange={(e) => updateField("telefono", e.target.value)}
            disabled={!editing}
            placeholder="Teléfono"
          />

          <input
            value={tempUser?.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
            disabled={!editing}
            placeholder="Email"
          />
        </div>

        {/* =========================
            ADDRESS
        ========================= */}
        <div className="profile-section">
          <h3>Dirección</h3>

          <input
            value={tempUser?.direccion || ""}
            onChange={(e) => updateField("direccion", e.target.value)}
            disabled={!editing}
            placeholder="Dirección"
          />
        </div>

        {/* =========================
            ACTIONS
        ========================= */}
        <div className="profile-actions">

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="profile-btn"
            >
              Editar perfil
            </button>
          ) : (
            <>
              <button
                onClick={save}
                disabled={saving}
                className="profile-btn" 
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>

              <button
                onClick={cancelEdit}
                className="profile-btn secondary"
              >
                Cancelar
              </button>
            </>
          )}

          <button onClick={logout} className="logout-btn">
            Cerrar sesión
          </button>

        </div>

        {/* =========================
            PEDIDOS (READ ONLY)
        ========================= */}
        <div className="profile-section pedidos-section">
          <h3>Mis pedidos</h3>

          {pedidos.length === 0 ? (
            <p>No tienes pedidos aún.</p>
          ) : (
            pedidos.map((pedido) => (
              <div key={pedido.id} className="pedido-item">

                <div className="pedido-top">
                  <a href={`/pedido/${pedido.id}/pdf`} className="pdf-btn" target="_blank">
                    Descargar Factura
                  </a>
                  <div>
                    <strong>Pedido #{pedido.id}</strong>
                  </div>

                  <span className={`estado ${pedido.estat}`}>
                    {pedido.estat}
                  </span>
                </div>

                <div className="pedido-products">
                  {pedido.detalles.map((detalle, i) => (
                    <div key={i} className="producto-line">
                      <span>
                        {detalle.producto
                          ? detalle.producto.nombre
                          : detalle.pack?.nombre || "Pack"}
                      </span>
                      <span>x{detalle.quantitat}</span>
                    </div>
                  ))}
                </div>

                <div className="pedido-total">
                  Total: {pedido.total}€
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}