import React, { useEffect, useState } from "react";

export default function PackCreate({ onCreated }) {
  const [nom, setNom] = useState(""); 
  const [descripcio, setDescripcio] = useState(""); 
  const [preu, setPreu] = useState(""); 
  const [estat, setEstat] = useState(true);

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/productos")
      .then(res => res.json())
      .then(data => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Product handlers
  const addProduct = product => {
    const existing = selectedProducts.find(p => p.id === product.id);
    if (existing) {
      setSelectedProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p))
      );
    } else {
      setSelectedProducts(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const removeProduct = index =>
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));

  const changeQuantity = (id, value) => {
    const qty = Math.max(1, Number(value));
    setSelectedProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, quantity: qty } : p))
    );
  };

  // Image handlers
  const handleImageUpload = e =>
    setNewImages(prev => [...prev, ...Array.from(e.target.files)]);

  const removeNewImage = index =>
    setNewImages(prev => prev.filter((_, i) => i !== index));

  const moveNewImage = (from, to) => {
    const arr = [...newImages];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setNewImages(arr);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!nom || !descripcio || !preu || selectedProducts.length === 0)
      return alert("Omple tots els camps i afegeix almenys un producte!");

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("Descripcio", descripcio);
    formData.append("preu", preu);
    formData.append("estat", estat ? 1 : 0);
    formData.append(
      "productes",
      JSON.stringify(selectedProducts.map(p => ({ id: p.id, quantity: p.quantity })))
    );

    newImages.forEach((file, i) => {
      formData.append("new_images[]", file);
      formData.append("new_images_order[]", i);
    });

    try {
      setCreating(true);
      const res = await fetch("/api/packs", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Error creant el pack");

      alert("Pack creat correctament!");
      setNom("");
      setDescripcio("");
      setPreu("");
      setSelectedProducts([]);
      setNewImages([]);
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      alert("Error creant el pack");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="text-center text-gray-500">Carregant...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">Crear Pack</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Nom del pack"
            value={nom}
            onChange={e => setNom(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <textarea
            placeholder="Descripció"
            value={descripcio}
            onChange={e => setDescripcio(e.target.value)}
            rows={3}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Preu (€)"
            value={preu}
            onChange={e => setPreu(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={estat} onChange={e => setEstat(e.target.checked)} /> Actiu
          </label>
        </div>

        {/* Images */}
        <div className="max-w-md mx-auto space-y-2">
          <label className="font-semibold">Imatges del Pack</label>
          <input type="file" multiple onChange={handleImageUpload} className="border rounded p-2 w-full" />
          <div className="flex gap-2 overflow-x-auto mt-2">
            {newImages.map((file, i) => (
              <div key={i} className="relative">
                <img src={URL.createObjectURL(file)} alt="" className="h-24 w-24 object-cover rounded" />
                <div className="flex gap-1 mt-1 justify-center">
                  {i > 0 && (
                    <button type="button" onClick={() => moveNewImage(i, i - 1)} className="px-1 bg-gray-200 rounded">↑</button>
                  )}
                  {i < newImages.length - 1 && (
                    <button type="button" onClick={() => moveNewImage(i, i + 1)} className="px-1 bg-gray-200 rounded">↓</button>
                  )}
                  <button type="button" onClick={() => removeNewImage(i)} className="text-red-500 font-bold">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product selection */}
        <div className="flex gap-6 max-w-4xl mx-auto">
          {/* Available products */}
          <div className="flex-1 bg-orange-50 p-4 rounded max-h-[400px] overflow-y-auto">
            <input type="text" placeholder="Buscar producte..." value={search} onChange={e => setSearch(e.target.value)} className="w-full p-2 border rounded mb-4" />
            {filteredProducts.map(p => (
              <div key={p.id} onClick={() => addProduct(p)} className="cursor-pointer p-2 bg-white rounded border mb-1 flex justify-between items-center hover:bg-orange-100">
                <span>{p.nombre}</span>
                <span>{selectedProducts.find(sp => sp.id === p.id)?.quantity || 0}×</span>
              </div>
            ))}
          </div>

          {/* Selected products */}
          <div className="flex-1 bg-green-50 p-4 rounded max-h-[400px] overflow-y-auto">
            <h2 className="font-semibold mb-4 text-center">Productes del Pack</h2>
            {selectedProducts.map((p, i) => (
              <div key={i} className="flex justify-between items-center bg-white p-2 rounded border mb-2">
                <div>
                  <div className="font-semibold">{p.nombre}</div>
                  <div className="text-xs text-gray-500">ID: {p.id} | Preu: {p.precio} €</div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => changeQuantity(p.id, p.quantity - 1)} className="px-2 bg-gray-200 rounded">-</button>
                  <span>{p.quantity}</span>
                  <button type="button" onClick={() => changeQuantity(p.id, p.quantity + 1)} className="px-2 bg-gray-200 rounded">+</button>
                  <button type="button" onClick={() => removeProduct(i)} className="text-red-500 font-bold ml-2">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="text-center mt-6">
          <button type="submit" disabled={creating} className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition">
            {creating ? "Creant..." : "Crear Pack"}
          </button>
        </div>
      </form>
    </div>
  );
}