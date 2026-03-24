import React, { useEffect, useState } from "react";

export default function PackCreate() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [nom, setNom] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [preu, setPreu] = useState("");
  const [creating, setCreating] = useState(false);

  // Load products from API
  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Add product or increment quantity
  const addProduct = (product) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Decrement or remove product
  const decrementProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev
        .map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  // Remove completely
  const removeProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom || !descripcio || !preu || selectedProducts.length === 0)
      return alert("Omple tots els camps i afegeix almenys un producte!");

    const payload = {
      nom,
      Descripcio: descripcio,
      preu: parseFloat(preu),
      productes: selectedProducts.map((p) => ({ id: p.id, quantity: p.quantity })),
    };

    setCreating(true);
    try {
      const res = await fetch("/api/packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error creant el pack");

      alert("Pack creat correctament!");
      setNom("");
      setDescripcio("");
      setPreu("");
      setSelectedProducts([]);
    } catch (err) {
      console.error("Create error:", err);
      alert("Error creant el pack");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 flex justify-center min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-orange-500 mb-6 text-center">
          Crear Pack
        </h1>

        {/* Form */}
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

          <button
            type="submit"
            disabled={creating}
            className="mt-4 w-full max-w-md mx-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition"
          >
            {creating ? "Creant..." : "Crear Pack"}
          </button>
        </form>

        <div className="flex gap-6 mt-6">
          {/* Left Column: Products */}
          <div className="flex-1 bg-orange-50 rounded-2xl p-4 max-h-[500px] overflow-y-auto border border-orange-200">
            <input
              type="text"
              placeholder="Buscar producte..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            />

            {loading ? (
              <div className="text-gray-500 text-center">Carregant...</div>
            ) : (
              <div className="grid gap-3">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => addProduct(p)}
                    className="p-3 bg-white rounded-xl border border-orange-200 cursor-pointer hover:bg-orange-100 transition flex justify-between items-center"
                  >
                    <div>
                      <div className="text-sm font-semibold">{p.nombre}</div>
                      <div className="text-xs text-gray-500">ID: {p.id}</div>
                    </div>
                    <div className="text-sm text-orange-500 font-medium">
                      {selectedProducts.find((sp) => sp.id === p.id)?.quantity || 0}×
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Selected Products */}
          <div className="flex-1 bg-green-50 rounded-2xl p-4 max-h-[500px] overflow-y-auto border border-green-200">
            <h2 className="font-semibold mb-4 text-center">Productes del Pack</h2>

            {selectedProducts.length === 0 ? (
              <div className="text-gray-400 text-center">Cap producte afegit</div>
            ) : (
              <div className="space-y-2">
                {selectedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-white rounded-xl border border-green-200 flex justify-between items-center"
                  >
                    <div>
                      <div className="text-sm font-semibold">{p.nombre}</div>
                      <div className="text-xs text-gray-500">
                        ID: {p.id} | Preu: {p.precio} €
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decrementProduct(p.id)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="font-medium">{p.quantity}</span>
                      <button
                        type="button"
                        onClick={() => addProduct(p)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProduct(p.id)}
                        className="text-red-500 font-bold hover:text-red-700 ml-2"
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
      </div>
    </div>
  );
}