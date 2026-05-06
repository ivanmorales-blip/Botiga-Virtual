import React, { useEffect, useState } from "react";
import "../../../../../scss/PedidosPage.scss";

const STATUS_ORDER = [
  "Pagado",
  "En proceso",
  "Enviado",
  "Completado",
  "Cancelado",
];

// normalize backend values safely
const normalizeStatus = (status) => {
  if (!status) return "";

  const map = {
    "Pagado": "Pagado",
    "En proceso": "En proceso",
    "Enviat": "Enviado",
    "Enviado": "Enviado",
    "Completat": "Completado",
    "Completado": "Completado",
    "Cancelat": "Cancelado",
    "Cancelado": "Cancelado",
  };

  return map[status.trim()] || status.trim();
};

export default function PedidoManager() {
  const [pedidos, setPedidos] = useState([]);
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    fetch("/api/pedidos", {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        const text = await res.text();

        try {
          return JSON.parse(text);
        } catch {
          console.error("❌ Invalid JSON:", text);
          return [];
        }
      })
      .then((data) => {
        setPedidos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setPedidos([]);
      });
  }, []);

  const updateStatus = async (id, newStatus) => {
    await fetch(`/api/pedido/${id}/status`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ estat: newStatus }),
    });

    setPedidos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, estat: newStatus } : p
      )
    );
  };

  // 🔥 FIXED FILTER LOGIC
  const filteredPedidos = pedidos.filter((p) => {
  const status = normalizeStatus(p.estat);

  if (filter === "active") {
    return ["Pagado", "En proceso", "Enviado"].includes(status);
  }

  return status === filter;
});

  return (
    <div className="pedidos">
      <div className="pedidos-header">
  <h1>Gestión de Pedidos</h1>

  <select
    className="filter"
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
  >
    <option value="active">Activos (Pagado → Enviado)</option>
    <option value="Pagado">Pagado</option>
    <option value="En proceso">En proceso</option>
    <option value="Enviado">Enviado</option>
    <option value="Completado">Completado</option>
    <option value="Cancelado">Cancelado</option>
  </select>
</div>

      {filteredPedidos.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay pedidos para este filtro
        </p>
      ) : (
        filteredPedidos.map((pedido) => (
          <div className="pedido-card" key={pedido.id}>
            {/* HEADER */}
            <div className="pedido-header">
              <div>
                <strong>Pedido #{pedido.id}</strong>
                <span>{pedido.total}€</span>
              </div>

              <select
                value={normalizeStatus(pedido.estat)}
                onChange={(e) =>
                  updateStatus(pedido.id, e.target.value)
                }
                className={`status ${normalizeStatus(pedido.estat)}`}
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* CLIENT INFO */}
            <div className="cliente">
              <p>
                <strong>Cliente:</strong>{" "}
                {pedido.usuario?.name || "Invitado"}
              </p>
              <p>
                <strong>Email:</strong> {pedido.email}
              </p>
              <p>
                <strong>Tel:</strong> {pedido.telefon}
              </p>
              <p>
                <strong>Dirección:</strong> {pedido.direccio}
              </p>
            </div>

            {/* PRODUCTS */}
            <div className="productos">
              <h3>Productos</h3>
              <ul>
                {pedido.detalles?.map((detalle, i) => (
                  <li key={i}>
                    {detalle.producto
                      ? detalle.producto.nombre
                      : detalle.pack?.nombre || "Pack"}
                    <span>x{detalle.quantitat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}