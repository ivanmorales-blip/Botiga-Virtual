import React, { useEffect, useState } from "react";

export default function PackCreate() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [nom, setNom] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [preu, setPreu] = useState("");

  useEffect(() => {
    fetch("/api/productes")
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
    p.nom.toLowerCase().includes(search.toLowerCase())
  );

  const addProduct = (product) => setSelectedProducts((prev) => [...prev, product]);
  const removeProduct = (index) =>
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom || !descripcio || !preu) return alert("Omple tots els camps!");

    const payload = {
      nom,
      Descripcio: descripcio,
      preu: parseFloat(preu),
      productes: selectedProducts.map((p) => p.id),
    };

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
      console.error(err);
      alert("Error al crear el pack.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 flex justify-center">
      {/* Outer square container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6">
        {/* Your content goes here */}

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
        </form>

        {/* Columns */}
        <div className="flex gap-6">
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
                    className="p-3 bg-white rounded-xl border border-orange-200 cursor-pointer hover:bg-orange-100 transition"
                  >
                    <div className="text-sm font-semibold">{p.nom}</div>
                    <div className="text-xs text-gray-500">ID: {p.id}</div>
                    <div className="text-xs text-orange-500 font-medium">{p.preu} €</div>
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
              <div className="grid gap-3">
                {selectedProducts.map((p, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white rounded-xl border border-green-200 flex justify-between items-center"
                  >
                    <div>
                      <div className="text-sm font-semibold">{p.nom}</div>
                      <div className="text-xs text-gray-500">ID: {p.id}</div>
                      <div className="text-xs text-orange-500 font-medium">{p.preu} €</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(i)}
                      className="text-red-500 font-bold hover:text-red-700 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transition"
          >
            Crear Pack
          </button>
        </div>
      </div>
    </div>
  );
}