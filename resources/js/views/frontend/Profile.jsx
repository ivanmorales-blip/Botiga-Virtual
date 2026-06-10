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

      <h1 className="profile-title">
        Mi perfil
      </h1>

      {error && (
        <div
          className="error"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {/* PERSONAL INFO */}
      <section
        className="profile-section"
        aria-labelledby="personal-info-heading"
      >
        <h2 id="personal-info-heading">
          Información personal
        </h2>

        <label
          htmlFor="nombre"
          className="sr-only"
        >
          Nombre
        </label>

        <input
          id="nombre"
          value={tempUser?.nombre || ""}
          onChange={(e) =>
            updateField("nombre", e.target.value)
          }
          disabled={!editing}
          placeholder="Nombre"
          autoComplete="given-name"
        />

        <label
          htmlFor="apellidos"
          className="sr-only"
        >
          Apellidos
        </label>

        <input
          id="apellidos"
          value={tempUser?.apellidos || ""}
          onChange={(e) =>
            updateField("apellidos", e.target.value)
          }
          disabled={!editing}
          placeholder="Apellidos"
          autoComplete="family-name"
        />
      </section>

      {/* CONTACT INFO */}
      <section
        className="profile-section"
        aria-labelledby="contact-info-heading"
      >
        <h2 id="contact-info-heading">
          Contacto
        </h2>

        <label
          htmlFor="telefono"
          className="sr-only"
        >
          Teléfono
        </label>

        <input
          id="telefono"
          type="tel"
          value={tempUser?.telefono || ""}
          onChange={(e) =>
            updateField("telefono", e.target.value)
          }
          disabled={!editing}
          placeholder="Teléfono"
          autoComplete="tel"
        />

        <label
          htmlFor="email"
          className="sr-only"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          value={tempUser?.email || ""}
          onChange={(e) =>
            updateField("email", e.target.value)
          }
          disabled={!editing}
          placeholder="Email"
          autoComplete="email"
        />
      </section>

      {/* ADDRESS */}
      <section
        className="profile-section"
        aria-labelledby="address-heading"
      >
        <h2 id="address-heading">
          Dirección
        </h2>

        <label
          htmlFor="direccion"
          className="sr-only"
        >
          Dirección
        </label>

        <input
          id="direccion"
          value={tempUser?.direccion || ""}
          onChange={(e) =>
            updateField("direccion", e.target.value)
          }
          disabled={!editing}
          placeholder="Dirección"
          autoComplete="street-address"
        />
      </section>

      {/* ACTIONS */}
      <div
        className="profile-actions"
        role="group"
        aria-label="Acciones de perfil"
      >
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="profile-btn"
            aria-label="Editar perfil"
          >
            Editar perfil
          </button>
        ) : (
          <>
            <button
              onClick={save}
              disabled={saving}
              className="profile-btn"
              aria-busy={saving}
            >
              {saving
                ? "Guardando..."
                : "Guardar cambios"}
            </button>

            <button
              onClick={cancelEdit}
              className="profile-btn secondary"
            >
              Cancelar
            </button>
          </>
        )}

        <button
          onClick={logout}
          className="logout-btn"
          aria-label="Cerrar sesión"
        >
          Cerrar sesión
        </button>
      </div>

      {/* PEDIDOS */}
      <section
        className="profile-section pedidos-section"
        aria-labelledby="orders-heading"
      >
        <h2 id="orders-heading">
          Mis pedidos
        </h2>

        {pedidos.length === 0 ? (
          <p role="status">
            No tienes pedidos aún.
          </p>
        ) : (
          <div
            role="list"
            aria-label="Lista de pedidos"
          >
            {pedidos.map((pedido) => (
              <article
                key={pedido.id}
                className="pedido-item"
                role="listitem"
              >
                <div className="pedido-top">

                  <a
                    href={`/pedido/${pedido.id}/pdf`}
                    className="pdf-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Descargar factura del pedido ${pedido.id}`}
                  >
                    Descargar Factura
                  </a>

                  <div className="pedido-heading">
                    Pedido #{pedido.id}
                  </div>

                  <span
                    className={`estado ${pedido.estat}`}
                    aria-label={`Estado del pedido: ${pedido.estat}`}
                  >
                    {pedido.estat}
                  </span>
                </div>

                <div
                  className="pedido-products"
                  role="list"
                  aria-label={`Productos del pedido ${pedido.id}`}
                >
                  {pedido.detalles.map((detalle, i) => (
                    <div
                      key={i}
                      className="producto-line"
                      role="listitem"
                    >
                      <span>
                        {detalle.producto
                          ? detalle.producto.nombre
                          : detalle.pack?.nombre || "Pack"}
                      </span>

                      <span>
                        x{detalle.quantitat}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="pedido-total"
                  aria-label={`Total del pedido ${pedido.total} euros`}
                >
                  Total: {pedido.total}€
                </div>

              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  </div>
);
}