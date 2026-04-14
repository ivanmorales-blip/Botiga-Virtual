import React, { useEffect, useState } from "react";

export default function PackCreate({ onCreated }) {
  const [nom, setNom] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [preu, setPreu] = useState("");
  const [estat, setEstat] = useState(true);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [images, setImages] = useState([]);
  const [creating, setCreating] = useState(false);

  // ----------------------------
  // LOAD PRODUCTS
  // ----------------------------
  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  const filteredProducts = products.filter((p) =>
    (p.nombre || "").toLowerCase().includes(search.toLowerCase())
  );

  // ----------------------------
  // DRAG PRODUCT
  // ----------------------------
  const handleDragStartProduct = (e, product) => {
    e.dataTransfer.setData("product", JSON.stringify(product));
  };

  const allowDrop = (e) => e.preventDefault();

  // ----------------------------
  // DROP PRODUCT INTO PACK
  // ----------------------------
  const handleDropToPack = (e) => {
    e.preventDefault();

    const data = e.dataTransfer.getData("product");
    if (!data) return;

    const product = JSON.parse(data);

    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);

      if (exists) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ----------------------------
  // REORDER PRODUCTS INSIDE PACK
  // ----------------------------
  const handleDragStartPack = (e, index) => {
    e.dataTransfer.setData("packIndex", index);
  };

  const handleDropReorder = (e, toIndex) => {
    e.preventDefault();

    const fromIndex = Number(e.dataTransfer.getData("packIndex"));
    if (isNaN(fromIndex)) return;

    setSelectedProducts((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr;
    });
  };

  const removeProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ----------------------------
  // IMAGES
  // ----------------------------
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (i) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const moveImage = (from, to) => {
    const arr = [...images];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setImages(arr);
  };

  // ----------------------------
  // SUBMIT (FIXED)
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nom || !descripcio || !preu) {
      alert("Omple tots els camps");
      return;
    }

    const formData = new FormData();

    formData.append("nom", nom);
    formData.append("Descripcio", descripcio);
    formData.append("preu", preu);
    formData.append("estat", estat ? 1 : 0);

    // PRODUCTS
    formData.append(
      "productes",
      JSON.stringify(
        selectedProducts.map((p, i) => ({
          id: p.id,
          quantity: p.quantity,
          order: i,
        }))
      )
    );

    // IMAGES (🔥 FIXED - MUST MATCH LARAVEL)
    images.forEach((file, i) => {
      formData.append("new_images[]", file);
      formData.append("new_images_order[]", i);
    });

    try {
      setCreating(true);

      const res = await fetch("/api/packs", {
        method: "POST",
        body: formData,
      });

      const data = await res.text();

      if (!res.ok) {
        console.error("SERVER RESPONSE:", data);
        throw new Error("Error creating pack");
      }

      alert("Pack creat correctament!");

      // reset
      setNom("");
      setDescripcio("");
      setPreu("");
      setSelectedProducts([]);
      setImages([]);

      if (onCreated) onCreated();
    } catch (err) {
      console.error("PACK CREATE ERROR:", err);
      alert(err.message || "Error creant pack");
    } finally {
      setCreating(false);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-orange-500 mb-6">
        Crear Pack
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* BASIC */}
        <div className="grid gap-3 max-w-md">
          <input
            className="border p-2"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />

          <textarea
            className="border p-2"
            placeholder="Descripció"
            value={descripcio}
            onChange={(e) => setDescripcio(e.target.value)}
          />

          <input
            type="number"
            className="border p-2"
            placeholder="Preu"
            value={preu}
            onChange={(e) => setPreu(e.target.value)}
          />

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={estat}
              onChange={(e) => setEstat(e.target.checked)}
            />
            Actiu
          </label>
        </div>

        {/* IMAGES */}
        <div>
          <input type="file" multiple onChange={handleImageUpload} />

          <div className="flex gap-2 mt-2 overflow-x-auto">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-20 h-20 object-cover"
                />

                <button type="button" onClick={() => removeImage(i)}>
                  ×
                </button>

                {i > 0 && (
                  <button type="button" onClick={() => moveImage(i, i - 1)}>
                    ←
                  </button>
                )}

                {i < images.length - 1 && (
                  <button type="button" onClick={() => moveImage(i, i + 1)}>
                    →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* DRAG AREA */}
        <div className="flex gap-4">

          {/* PRODUCTS */}
          <div className="w-1/2 border p-3">
            <input
              className="border p-2 w-full mb-2"
              placeholder="Buscar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {filteredProducts.map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStartProduct(e, p)}
                className="p-2 border mb-1 bg-white cursor-grab"
              >
                {p.nombre}
              </div>
            ))}
          </div>

          {/* PACK DROP ZONE */}
          <div
            className="w-1/2 border p-3 min-h-[300px]"
            onDrop={handleDropToPack}
            onDragOver={allowDrop}
          >
            <h3 className="font-bold mb-2">Pack</h3>

            {selectedProducts.map((p, i) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStartPack(e, i)}
                onDrop={(e) => handleDropReorder(e, i)}
                onDragOver={allowDrop}
                className="flex justify-between border p-2 mb-1 bg-green-50"
              >
                <span>
                  {p.nombre} ({p.quantity})
                </span>

                <button
                  type="button"
                  onClick={() => removeProduct(p.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          className="bg-orange-500 text-white px-4 py-2"
          disabled={creating}
        >
          {creating ? "Creant..." : "Crear Pack"}
        </button>
      </form>
    </div>
  );
}