// src/views/CategoriaProductos.jsx
import React, { useEffect, useState } from "react";

export default function CategoriaProductos() {
  const [categorias, setCategorias] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [tipo, setTipo] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mostrarMas, setMostrarMas] = useState(false);

  const MAX_VISIBLE = 5;

  const loadCategorias = () => {
    fetch("/api/categorias")
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error(err));
  };

  const loadCaracteristicas = () => {
    fetch("/api/caracteristicas")
      .then(res => res.json())
      .then(data => setCaracteristicas(data))
      .catch(err => console.error(err));
  };

  const loadProductos = async (categoriaId = "", caracteristicasIds = []) => {
    const params = new URLSearchParams();
    if (categoriaId) params.append("categoria", categoriaId);
    caracteristicasIds.forEach(id => params.append("caracteristica[]", id));

    const res = await fetch(`/api/productos?${params.toString()}`);
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    loadCategorias();
    loadCaracteristicas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipo.trim()) return;

    await fetch("/api/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo }),
    });

    setTipo("");
    loadCategorias();
  };

  const toggleEstado = async (prod) => {
  try {
    const url = `/api/productos/${prod.id}/${prod.estat ? "deactivate" : "activate"}`;
    const res = await fetch(url, { method: "PATCH" });
    if (!res.ok) throw new Error("Error updating product");

    // Actualizar solo el estado del producto localmente
    setProductos(prev =>
      prev.map(p =>
        p.id === prod.id ? { ...p, estat: !p.estat } : p
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  const categoriaSeleccionada = categorias.find(
    (c) => c.id == selectedCategoria
  );

  const productosFiltrados = selectedCaracteristicas.length
    ? productos.filter(p =>
        selectedCaracteristicas.every(sc =>
          p.caracteristicas?.some(c => c.id == sc)
        )
      )
    : productos;

  const handleCaracteristicaChange = (id) => {
    let nuevaSeleccion;
    if (selectedCaracteristicas.includes(id)) {
      nuevaSeleccion = selectedCaracteristicas.filter(c => c !== id);
    } else {
      nuevaSeleccion = [...selectedCaracteristicas, id];
    }
    setSelectedCaracteristicas(nuevaSeleccion);
    loadProductos(selectedCategoria, nuevaSeleccion);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-orange-500 mb-4">Categorías</h1>

      {/* Crear categoría y buscar categoría un poco más grandes */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Nueva categoría"
            className="border px-3 py-2 rounded text-base w-56"
            required
          />
          <button className="bg-orange-500 text-white px-4 py-2 rounded text-base">
            Crear
          </button>
        </form>

        <select
          value={selectedCategoria}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCategoria(value);
            loadProductos(value, selectedCaracteristicas);
          }}
          className="border px-3 py-2 rounded text-base w-56"
        >
          <option value="">Buscar categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.tipo}
            </option>
          ))}
        </select>
      </div>

      {/* Características */}
      <div className="border p-4 rounded w-64 bg-white shadow mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Características</h2>
        {(mostrarMas ? caracteristicas : caracteristicas.slice(0, MAX_VISIBLE)).map(car => (
          <label key={car.id} className="flex items-center mb-1 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={selectedCaracteristicas.includes(car.id)}
              onChange={() => handleCaracteristicaChange(car.id)}
              className="accent-orange-500 mr-2"
            />
            <span>{car.descripcio}</span>
          </label>
        ))}
        {caracteristicas.length > MAX_VISIBLE && (
          <button
            className="text-blue-500 text-xs mt-1"
            onClick={() => setMostrarMas(!mostrarMas)}
          >
            {mostrarMas ? "Ver menos" : "Ver más"}
          </button>
        )}
      </div>

      {/* Productos filtrados */}
      {selectedCategoria && productosFiltrados.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-orange-500">
            Productos de: {categoriaSeleccionada?.tipo}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-xl shadow p-4 border hover:shadow-md transition relative"
              >
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full mb-2 inline-block ${
                    prod.estat ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {prod.estat ? "Activo" : "Inactivo"}
                </span>

                <h3 className="font-semibold text-lg mb-2">{prod.nombre}</h3>
                <p className="text-gray-700 mb-1">{prod.precio} €</p>
                {prod.descripcion && (
                  <p className="text-gray-500 text-sm mb-2">{prod.descripcion}</p>
                )}
                <p className="text-sm text-gray-600 mb-2">Stock: {prod.stock}</p>

                <button
                  onClick={() => toggleEstado(prod)}
                  className={`absolute bottom-2 right-2 px-2 py-1 rounded text-white text-xs ${
                    prod.estat
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {prod.estat ? "Desactivar" : "Activar"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCategoria && productosFiltrados.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No hay productos con esos filtros
        </p>
      )}
    </div>
  );
}