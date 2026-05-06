import React, { useEffect, useState } from "react";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editedFields, setEditedFields] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [search, setSearch] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const safeJson = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error("❌ Not JSON response:", text);
      throw new Error("Server returned HTML instead of JSON");
    }
  };

  const loadProducts = () => {
    setLoading(true);
    fetch("/api/productos")
      .then(safeJson)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  };

  const loadCategories = () => {
    fetch("/api/categorias").then(safeJson).then(setCategories).catch(console.error);
  };

  const loadCaracteristicas = () => {
    fetch("/api/caracteristicas").then(safeJson).then(setCaracteristicas).catch(console.error);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadCaracteristicas();
  }, []);

  const getIndex = (id, total) => {
    const idx = currentImageIndex[id] || 0;
    return total && idx >= total ? 0 : idx;
  };

  const prevImage = (id, total) =>
    setCurrentImageIndex(prev => ({ ...prev, [id]: (getIndex(id, total) - 1 + total) % total }));
  const nextImage = (id, total) =>
    setCurrentImageIndex(prev => ({ ...prev, [id]: (getIndex(id, total) + 1) % total }));

  const groupedCaracteristicas = caracteristicas.reduce((acc, c) => {
    const key = c.tipo?.nombre || "Altres";
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  const toggleActive = async (product) => {
    try {
      await fetch(`/api/productos/${product.id}/${product.estat ? "deactivate" : "activate"}`, { method: "POST" });
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setImagePreview([]);
    setEditedFields({
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock,
      descripcion: product.descripcion || "",
      categoria_id: product.categoria_id || "",
      marca: product.marca || "",
      caracteristicas: product.caracteristicas?.map((c) => c.id) || [],
      destacat: product.destacat || false,
      codi: product.codi || "",
      imatges_existents: product.imatges || [],
      imatges_a_borrar: [],
      imatges_noves: [],
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedFields({});
    setImagePreview(null);
  };

  const toggleEditCaracteristica = (id) => {
    setEditedFields((prev) => {
      const current = prev.caracteristicas || [];
      return {
        ...prev,
        caracteristicas: current.includes(id)
          ? current.filter((c) => c !== id)
          : [...current, id],
      };
    });
  };

  const marcarBorrar = (e, imatgeId) => {
    e.preventDefault();
    e.stopPropagation();
    setEditedFields(prev => ({
      ...prev,
      imatges_a_borrar: [...(prev.imatges_a_borrar || []), imatgeId],
      imatges_existents: prev.imatges_existents.filter(img => img.id !== imatgeId),
    }));
  };

  const handleImageChange = (e) => {
    const totalActual = (editedFields.imatges_existents?.length || 0) + (editedFields.imatges_noves?.length || 0);
    const hueco = 3 - totalActual;
    const files = Array.from(e.target.files).slice(0, hueco);

    const readers = files.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target.result);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(previews => {
      setImagePreview(prev => [...(Array.isArray(prev) ? prev : []), ...previews]);
    });

    setEditedFields(prev => ({ ...prev, imatges_noves: [...(prev.imatges_noves || []), ...files] }));
  };

  const quitarNova = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setEditedFields(prev => ({
      ...prev,
      imatges_noves: prev.imatges_noves.filter((_, i) => i !== index),
    }));
    setImagePreview(prev => Array.isArray(prev) ? prev.filter((_, i) => i !== index) : []);
  };

  const saveEdit = async (id) => {
    try {
      const formData = new FormData();

      formData.append("nombre", editedFields.nombre || "");
      formData.append("precio", editedFields.precio || "");
      formData.append("stock", editedFields.stock || "");
      formData.append("descripcion", editedFields.descripcion || "");
      formData.append("categoria_id", editedFields.categoria_id || "");
      formData.append("marca", editedFields.marca || "");
      formData.append("destacat", editedFields.destacat ? "1" : "0");
      formData.append("codi", editedFields.codi || "");
      // _method eliminado

      (editedFields.caracteristicas || []).forEach((cid) => {
        formData.append("caracteristicas[]", cid);
      });

      (editedFields.imatges_a_borrar || []).forEach(imatgeId => {
        formData.append("imatges_a_borrar[]", imatgeId);
      });

      (editedFields.imatges_noves || []).forEach((file, i) => {
        formData.append(i === 0 ? "imagen" : "imagenes[]", file);
      });

      const res = await fetch(`/api/productos/${id}`, { method: "POST", body: formData });
      const data = await safeJson(res);

      if (!res.ok) {
        console.error("Update error:", data);
        alert("Error updating product");
        return;
      }

      cancelEdit();
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-orange-500 text-center">
        Llista de Productes
      </h1>

      <div className="mb-3 flex justify-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca per nom..."
          className="px-4 py-2 border rounded-lg w-80 shadow-sm"
        />
      </div>

      <div className="mt-10 text-center mb-6">
        <a
          href="/products-react/create"
          style={{ background: "#f97316", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: "600", fontSize: "16px", textDecoration: "none", display: "inline-block" }}
        >
          Crear Entrada Producte
        </a>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Carregant...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-400">No hi ha productes</p>
      ) : (

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <span style={{
                fontSize: "12px",
                padding: "2px 10px",
                borderRadius: "999px",
                background: p.estat ? "#dcfce7" : "#fee2e2",
                color: p.estat ? "#16a34a" : "#dc2626",
                fontWeight: "600"
              }}>
                {p.estat ? "Actiu" : "Inactiu"}
              </span>
              {p.destacat ? (
                <span style={{
                  fontSize: "12px",
                  padding: "2px 10px",
                  borderRadius: "999px",
                  background: "#fef9c3",
                  color: "#ca8a04",
                  fontWeight: "600"
                }}>
                  ★ Destacat
                </span>
              ) : null}
            </div>

              {editingId === p.id ? (
                <>
                  <input value={editedFields.nombre} onChange={(e) => setEditedFields({ ...editedFields, nombre: e.target.value })} className="w-full border p-2 mt-2 rounded" />
                  <input type="text" placeholder="Codi" value={editedFields.codi || ""} onChange={(e) => setEditedFields({ ...editedFields, codi: e.target.value })} className="w-full border p-2 mt-1 rounded" />
                  <input type="number" value={editedFields.precio} onChange={(e) => setEditedFields({ ...editedFields, precio: e.target.value })} className="w-full border p-2 mt-1 rounded" />
                  <input type="number" value={editedFields.stock} onChange={(e) => setEditedFields({ ...editedFields, stock: e.target.value })} className="w-full border p-2 mt-1 rounded" />
                  <input value={editedFields.marca} onChange={(e) => setEditedFields({ ...editedFields, marca: e.target.value })} className="w-full border p-2 mt-1 rounded" />
                  <textarea value={editedFields.descripcion} onChange={(e) => setEditedFields({ ...editedFields, descripcion: e.target.value })} className="w-full border p-2 mt-1 rounded" />
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" checked={editedFields.destacat || false} onChange={(e) => setEditedFields({ ...editedFields, destacat: e.target.checked })} />
                    <label className="text-sm font-semibold text-gray-700">Producte destacat</label>
                  </div>

                  <div className="mt-3">
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                      Imatges{" "}
                      <span style={{ color: "#9ca3af", fontWeight: "400" }}>
                        ({(editedFields.imatges_existents?.length || 0) + (editedFields.imatges_noves?.length || 0)}/3)
                      </span>
                    </label>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "8px" }}>
                      {editedFields.imatges_existents?.map((img) => (
                        <div key={img.id} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", background: "#f9fafb", border: "1px solid #e5e7eb", aspectRatio: "1" }}>
                          <img src={`/storage/${img.path}`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }} />
                          <button type="button" onClick={(e) => marcarBorrar(e, img.id)}
                            style={{ position: "absolute", top: "4px", right: "4px", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            ✕
                          </button>
                        </div>
                      ))}
                      {Array.isArray(imagePreview) && imagePreview.map((src, i) => (
                        <div key={`nova-${i}`} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", background: "#fff7ed", border: "1px solid #fed7aa", aspectRatio: "1" }}>
                          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }} />
                          <button type="button" onClick={(e) => quitarNova(e, i)}
                            style={{ position: "absolute", top: "4px", right: "4px", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {(editedFields.imatges_existents?.length || 0) + (editedFields.imatges_noves?.length || 0) < 3 && (
                      <input type="file" accept="image/*" multiple onChange={handleImageChange}
                        style={{ marginTop: "8px", width: "100%", fontSize: "13px", padding: "6px", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                    )}
                    {(editedFields.imatges_existents?.length || 0) + (editedFields.imatges_noves?.length || 0) >= 3 && (
                      <p style={{ fontSize: "12px", color: "#f97316", marginTop: "4px" }}>Ja tens el màxim de 3 imatges.</p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button onClick={() => saveEdit(p.id)} className="bg-green-500 text-white px-3 py-1 rounded">Guardar</button>
                    <button onClick={cancelEdit} className="bg-gray-300 px-3 py-1 rounded">Cancel·lar</button>
                  </div>
                </>
              ) : (
                <>
                  {p.imatges && p.imatges.length > 0 && (
                    <div className="relative mt-2 overflow-hidden rounded-2xl" style={{ background: "#f9fafb" }}>
                      <img
                        src={`/storage/${p.imatges[getIndex(p.id, p.imatges.length)].path}`}
                        alt={p.nombre}
                        style={{ width: "100%", height: "200px", objectFit: "contain", padding: "16px" }}
                      />
                      {p.imatges.length > 1 && (
                        <>
                          <button
                            onClick={() => prevImage(p.id, p.imatges.length)}
                            style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                          >‹</button>
                          <button
                            onClick={() => nextImage(p.id, p.imatges.length)}
                            style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                          >›</button>
                          <div style={{ display: "flex", justifyContent: "center", gap: "6px", padding: "8px 0" }}>
                            {p.imatges.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setCurrentImageIndex(prev => ({ ...prev, [p.id]: i }))}
                                style={{ width: i === getIndex(p.id, p.imatges.length) ? "20px" : "8px", height: "8px", borderRadius: "999px", border: "none", cursor: "pointer", background: i === getIndex(p.id, p.imatges.length) ? "#f97316" : "#d1d5db", transition: "all 0.3s" }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <h2 className="font-bold text-lg mt-2">{p.nombre}</h2>
                  {p.codi && <p className="text-xs text-gray-400">Codi: {p.codi}</p>}
                  <p className="text-orange-500 font-semibold">{p.precio} €</p>
                  {p.stock > 0 && <p className="text-sm text-gray-500">Stock: {p.stock}</p>}
                  <p className="text-sm text-gray-500">Marca: {p.marca || "—"}</p>
                  <p className="text-xs text-gray-400 mt-2">{p.categoria?.tipo || "Sense categoria"}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => toggleActive(p)}
                      style={{ background: p.estat ? "#3b82f6" : "#22c55e", color: "white", padding: "6px 12px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" }}
                    >
                      {p.estat ? "Desactivar" : "Activar"}
                    </button>

                    <button
                      onClick={() => startEdit(p)}
                      style={{ background: "#eab308", color: "white", padding: "6px 12px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer" }}
                    >
                      Editar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}