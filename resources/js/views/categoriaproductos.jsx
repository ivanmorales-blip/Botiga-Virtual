// src/views/CategoriaProductos.jsx
import React, { useEffect, useState } from "react";

export default function CategoriaProductos() {
  const [categorias, setCategorias] = useState([]);
  const [tipo, setTipo] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [productos, setProductos] = useState([]);

  // Cargar todas las categorías
  const loadCategorias = () => {
    fetch("/api/categorias")
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error(err));
  };

  // Cargar productos de la categoría seleccionada
  const loadProductos = async (categoriaId) => {
    if (!categoriaId) {
      setProductos([]);
      return;
    }
    try {
      const res = await fetch(`/categorias/${categoriaId}/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  // Crear nueva categoría
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

  // Activar/Desactivar producto
  const toggleEstado = async (prod) => {
    try {
      const url = `/api/productos/${prod.id}/${prod.estat ? "deactivate" : "activate"}`;
      const res = await fetch(url, { method: "PATCH" });
      if (!res.ok) throw new Error("Error updating product");
      loadProductos(selectedCategoria);
    } catch (err) {
      console.error(err);
    }
  };

  const categoriaSeleccionada = categorias.find(
    (c) => c.id == selectedCategoria
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">Categorías</h1>

      {/* Crear categoría y seleccionar categoría */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Tipo de categoría"
            className="border p-2 rounded w-64"
            required
          />
          <button className="bg-orange-500 text-white px-4 py-2 rounded">
            Crear
          </button>
        </form>

        <select
          value={selectedCategoria}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCategoria(value);
            loadProductos(value);
          }}
          className="border p-2 rounded w-64"
        >
          <option value="">Buscar categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.tipo}
            </option>
          ))}
        </select>
      </div>

      {/* Productos de la categoría */}
      {selectedCategoria && productos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-orange-500">
            Productos de: {categoriaSeleccionada?.tipo}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((prod) => (
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

      {selectedCategoria && productos.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          Esta categoría no tiene productos
        </p>
      )}
    </div>
  );
}