import React, { useEffect, useState } from "react";

export default function PackEdit({ packId, onSaved }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nom, setNom] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [preu, setPreu] = useState("");
  const [estat, setEstat] = useState(true);

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [images, setImages] = useState([]); // Existing images with path & order
  const [newImages, setNewImages] = useState([]); // File uploads

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, packRes] = await Promise.all([
        fetch("/api/productos"),
        fetch(`/api/packs/${packId}`)
      ]);

      const allProducts = await productsRes.json();
      const packData = await packRes.json();

      setProducts(allProducts);

      setNom(packData.nom);
      setDescripcio(packData.Descripcio);
      setPreu(packData.preu);
      setEstat(packData.estat);

      const packProducts = (packData.productes || []).map(p => ({
        ...p,
        quantity: p.pivot?.quantity || 1
      }));
      setSelectedProducts(packProducts);

      setImages((packData.images || []).sort((a,b)=>a.order-b.order));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [packId]);

  const filteredProducts = products.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const addProduct = product => {
    const existing = selectedProducts.find(p => p.id === product.id);
    if (existing) {
      setSelectedProducts(prev =>
        prev.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const removeProduct = index =>
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));

  const changeQuantity = (productId, value) => {
    const qty = Math.max(1, Number(value));
    setSelectedProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, quantity: qty } : p))
    );
  };

  const handleImageUpload = e => {
    setNewImages([...newImages, ...Array.from(e.target.files)]);
  };

  const removeExistingImage = index =>
    setImages(prev => prev.filter((_, i) => i !== index));

  const removeNewImage = index =>
    setNewImages(prev => prev.filter((_, i) => i !== index));

  const moveImage = (arr, from, to) => {
    const newArr = [...arr];
    const [moved] = newArr.splice(from, 1);
    newArr.splice(to, 0, moved);
    return newArr;
  };

  const moveExistingImage = (from, to) => setImages(prev => moveImage(prev, from, to));
  const moveNewImage = (from, to) => setNewImages(prev => moveImage(prev, from, to));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!nom || !descripcio || !preu) return alert("Omple tots els camps!");

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("Descripcio", descripcio);
    formData.append("preu", preu);
    formData.append("estat", estat ? 1 : 0);
    formData.append("productes", JSON.stringify(selectedProducts.map(p => ({ id: p.id, quantity: p.quantity }))));
    formData.append("existing_images", JSON.stringify(images.map((img, i) => ({ id: img.id, order: i }))));

    newImages.forEach((file, i) => {
      formData.append("new_images[]", file);
      formData.append("new_images_order[]", images.length + i);
    });

    try {
      setSaving(true);
      const res = await fetch(`/api/packs/${packId}`, {
        method: "POST", // or PUT if backend expects PUT
        body: formData
      });

      if (!res.ok) throw new Error("Error updating pack");
      alert("Pack actualitzat correctament!");
      if (onSaved) onSaved();
    } catch (err) {
      console.error(err);
      alert("Error actualitzant el pack");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center text-gray-500">Carregant...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">Editar Pack</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <input type="text" placeholder="Nom del pack" value={nom} onChange={e=>setNom(e.target.value)} className="p-2 border rounded" required />
          <textarea placeholder="Descripció" value={descripcio} onChange={e=>setDescripcio(e.target.value)} rows={3} className="p-2 border rounded" required />
          <input type="number" placeholder="Preu (€)" value={preu} onChange={e=>setPreu(e.target.value)} className="p-2 border rounded" required />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={estat} onChange={e=>setEstat(e.target.checked)} />
            Actiu
          </label>
        </div>

        {/* Images */}
        <div className="max-w-md mx-auto space-y-2">
          <label className="font-semibold">Imatges del Pack</label>
          <input type="file" multiple onChange={handleImageUpload} className="border rounded p-2 w-full"/>
          <div className="flex gap-2 overflow-x-auto mt-2">
            {images.map((img, i) => (
              <div key={img.id} className="relative">
                <img src={img.url} alt="" className="h-24 w-24 object-cover rounded"/>
                <div className="flex gap-1 mt-1 justify-center">
                  {i>0 && <button type="button" onClick={()=>moveExistingImage(i,i-1)} className="px-1 bg-gray-200 rounded">↑</button>}
                  {i<images.length-1 && <button type="button" onClick={()=>moveExistingImage(i,i+1)} className="px-1 bg-gray-200 rounded">↓</button>}
                  <button type="button" onClick={()=>removeExistingImage(i)} className="text-red-500 font-bold">×</button>
                </div>
              </div>
            ))}
            {newImages.map((file,i)=>(
              <div key={i} className="relative">
                <img src={URL.createObjectURL(file)} alt="" className="h-24 w-24 object-cover rounded"/>
                <div className="flex gap-1 mt-1 justify-center">
                  {i>0 && <button type="button" onClick={()=>moveNewImage(i,i-1)} className="px-1 bg-gray-200 rounded">↑</button>}
                  {i<newImages.length-1 && <button type="button" onClick={()=>moveNewImage(i,i+1)} className="px-1 bg-gray-200 rounded">↓</button>}
                  <button type="button" onClick={()=>removeNewImage(i)} className="text-red-500 font-bold">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Selection */}
        <div className="flex gap-6 max-w-4xl mx-auto">
          <div className="flex-1 bg-orange-50 p-4 rounded max-h-[400px] overflow-y-auto">
            <input type="text" placeholder="Buscar producte..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full p-2 border rounded mb-4" />
            {filteredProducts.map(p=>(
              <div key={p.id} onClick={()=>addProduct(p)} className="cursor-pointer p-2 bg-white rounded border mb-1 flex justify-between items-center hover:bg-orange-100">
                <span>{p.nombre}</span>
                <span>{selectedProducts.find(sp=>sp.id===p.id)?.quantity || 0}×</span>
              </div>
            ))}
          </div>
          <div className="flex-1 bg-green-50 p-4 rounded max-h-[400px] overflow-y-auto">
            <h2 className="font-semibold mb-4 text-center">Productes del Pack</h2>
            {selectedProducts.map((p,i)=>(
              <div key={i} className="flex justify-between items-center bg-white p-2 rounded border mb-2">
                <div>
                  <div className="font-semibold">{p.nombre}</div>
                  <div className="text-xs text-gray-500">ID: {p.id} | Preu: {p.precio} €</div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={()=>changeQuantity(p.id, p.quantity-1)} className="px-2 bg-gray-200 rounded">-</button>
                  <span>{p.quantity}</span>
                  <button type="button" onClick={()=>changeQuantity(p.id, p.quantity+1)} className="px-2 bg-gray-200 rounded">+</button>
                  <button type="button" onClick={()=>removeProduct(i)} className="text-red-500 font-bold ml-2">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <button type="submit" disabled={saving} className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition">
            {saving ? "Guardant..." : "Actualitzar Pack"}
          </button>
        </div>
      </form>
    </div>
  );
}