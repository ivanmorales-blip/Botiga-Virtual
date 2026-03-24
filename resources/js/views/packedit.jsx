import React, { useEffect, useState } from "react";

export default function PackEdit({ packId, onSaved }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nom, setNom] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [preu, setPreu] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");

  // Load all products and pack details
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

      // Map existing products with quantity from pivot
      const packProducts = (packData.productes || []).map((p) => ({
        ...p,
        quantity: p.pivot?.quantity || 1
      }));

      setSelectedProducts(packProducts);
    } catch (err) {
      console.error("Error loading data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [packId]);

  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const addProduct = (product) => {
    // If product already selected, increase quantity
    const existing = selectedProducts.find((p) => p.id === product.id);
    if (existing) {
      setSelectedProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const removeProduct = (index) =>
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));

  const changeQuantity = (productId, value) => {
    const qty = Math.max(1, Number(value));
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: qty } : p))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom || !descripcio || !preu) return alert("Omple tots els camps!");

    const payload = {
      nom,
      Descripcio: descripcio,
      preu: parseFloat(preu),
      productes: selectedProducts.map((p) => ({
        id: p.id,
        quantity: p.quantity
      }))
    };

    try {
      setSaving(true);
      const res = await fetch(`/api/packs/${packId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Error actualitzant el pack");

      alert("Pack actualitzat correctament!");
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Update error:", err);
      alert("Error actualitzant el pack.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Carregant...</div>;

  return (
    <div className="p-8 bg-gray-50 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">
          Editar Pack
        </h1>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Nom del pack"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
            <textarea
              placeholder="Descripció"
              value={descripcio}
              onChange={(e) => setDescripcio(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
              rows={3}
              required
            />
            <input
              type="number"
              placeholder="Preu (€)"
              value={preu}
              onChange={(e) => setPreu(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Products selection */}
          <div className="flex gap-6 mt-6">
            {/* Left: All products */}
            <div className="flex-1 bg-orange-50 rounded-2xl p-4 max-h-[400px] overflow-y-auto border border-orange-200">
              <input
                type="text"
                placeholder="Buscar producte..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              />
              {filteredProducts.length === 0 ? (
                <div className="text-gray-400 text-center">Cap producte trobat</div>
              ) : (
                <div className="grid gap-3">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => addProduct(p)}
                      className="p-3 bg-white rounded-xl border border-orange-200 cursor-pointer hover:bg-orange-100 transition"
                    >
                      <div className="text-sm font-semibold">{p.nombre}</div>
                      <div className="text-xs text-gray-500">ID: {p.id}</div>
                      <div className="text-xs text-orange-500 font-medium">{p.precio} €</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Selected products */}
            <div className="flex-1 bg-green-50 rounded-2xl p-4 max-h-[400px] overflow-y-auto border border-green-200">
              <h2 className="font-semibold mb-4 text-center">Productes del Pack</h2>
              {selectedProducts.length === 0 ? (
                <div className="text-gray-400 text-center">Cap producte afegit</div>
              ) : (
                <div className="space-y-2">
                  {selectedProducts.map((p, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-white p-2 rounded-xl border border-green-200"
                    >
                      <div>
                        <div className="text-sm font-semibold">{p.nombre}</div>
                        <div className="text-xs text-gray-500">ID: {p.id}</div>
                        <div className="text-xs text-orange-500 font-medium">{p.precio} €</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={p.quantity}
                          onChange={(e) => changeQuantity(p.id, e.target.value)}
                          className="w-16 p-1 border rounded text-center"
                        />
                        <button
                          type="button"
                          onClick={() => removeProduct(i)}
                          className="text-red-500 font-bold hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition"
            >
              {saving ? "Guardant..." : "Actualitzar Pack"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}