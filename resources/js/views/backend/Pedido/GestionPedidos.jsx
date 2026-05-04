import React, { useEffect, useState } from "react";
import "../../../../../scss/PedidosPage.scss";

export default function PedidoManager() {
  const [pedidos, setPedidos] = useState([]);
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    fetch("/api/pedidos")
      .then(res => res.json())
      .then(data => setPedidos(data));
  }, []);

  const updateStatus = async (id, newStatus) => {
    await fetch(`/api/pedido/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ estat: newStatus })
    });

    setPedidos(prev =>
      prev.map(p =>
        p.id === id ? { ...p, estat: newStatus } : p
      )
    );
  };

  const filteredPedidos = pedidos.filter(p => {
    if (filter === "active") {
      return p.estat === "En process" || p.estat === "Enviat";
    }
    return p.estat === filter;
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
          <option value="active">En proceso + Enviados</option>
          <option value="En process">En proceso</option>
          <option value="Enviat">Enviados</option>
          <option value="Completat">Completados</option>
          <option value="Cancelat">Cancelados</option>
        </select>
      </div>

      {filteredPedidos.map(pedido => (
        <div className="pedido-card" key={pedido.id}>
          
          {/* HEADER */}
          <div className="pedido-header">
            <div>
              <strong>Pedido #{pedido.id}</strong>
              <span>{pedido.total}€</span>
            </div>

            <select
              value={pedido.estat}
              onChange={(e) => updateStatus(pedido.id, e.target.value)}
              className={`status ${pedido.estat}`}
            >
              <option>En process</option>
              <option>Enviat</option>
              <option>Completat</option>
              <option>Cancelat</option>
            </select>
          </div>

          {/* CLIENT INFO */}
          <div className="cliente">
            <p><strong>Cliente:</strong> {pedido.usuario?.name || "Invitado"}</p>
            <p><strong>Email:</strong> {pedido.email}</p>
            <p><strong>Tel:</strong> {pedido.telefon}</p>
            <p><strong>Dirección:</strong> {pedido.direccio}</p>
          </div>

          {/* PRODUCTS */}
          <div className="productos">
            <h3>Productos</h3>
            <ul>
              {pedido.detalles.map((detalle, i) => (
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
      ))}
    </div>
  );
}