import React, { useState, useEffect } from "react";

export default function ProductCreate() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [marca, setMarca] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [selectedCaracteristicas, setSelectedCaracteristicas] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // Load data
  useEffect(() => {
    fetch("/api/categorias")
      .then(res => res.json())
      .then(setCategorias);

    fetch("/api/caracteristicas")
      .then(res => res.json())
      .then(setCaracteristicas);
  }, []);

  // Toggle característica
  const toggleCaracteristica = (id) => {
    setSelectedCaracteristicas(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const res = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nombre,
          precio,
          stock,
          descripcion,
          categoria_id: categoriaId || null,
          marca,
          caracteristicas: selectedCaracteristicas, // 🔥 key part
        }),
      });

      const data = await res.json();

      if (!res.ok) throw data;


      // Reset
      setNombre("");
      setPrecio("");
      setStock("");
      setDescripcion("");
      setCategoriaId("");
      setMarca("");
      setSelectedCaracteristicas([]);

    } catch (err) {
      console.error(err);
      setErrors(err.errors ? Object.values(err.errors).flat() : ["Error"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-orange-600 text-center">
        Crear Producto
      </h1>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} className="w-full border p-2 rounded"/>

        <input type="number" placeholder="Precio" value={precio} onChange={e=>setPrecio(e.target.value)} className="w-full border p-2 rounded"/>

        <input type="number" placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} className="w-full border p-2 rounded"/>

        <input placeholder="Marca" value={marca} onChange={e=>setMarca(e.target.value)} className="w-full border p-2 rounded"/>

        <textarea placeholder="Descripción" value={descripcion} onChange={e=>setDescripcion(e.target.value)} className="w-full border p-2 rounded"/>

        <select value={categoriaId} onChange={e=>setCategoriaId(e.target.value)} className="w-full border p-2 rounded">
          <option value="">Categoria</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>{c.tipo}</option>
          ))}
        </select>

        {/* 🔥 Características */}
        <div>
          <label className="font-semibold">Característiques</label>
          <div className="border rounded p-2 max-h-40 overflow-y-auto">
            {caracteristicas.map(c => (
              <label key={c.id} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={selectedCaracteristicas.includes(c.id)}
                  onChange={() => toggleCaracteristica(c.id)}
                />
                {c.descripcio}
              </label>
            ))}
          </div>
        </div>

        <button className="w-full bg-orange-500 text-white p-2 rounded">
          {loading ? "Creando..." : "Crear"}
        </button>
      </form>
    </div>
  );
}