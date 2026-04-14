import React, { useEffect, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";

export default function PackEdit({ packId, onClose }) {
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);

  const [nom, setNom] = useState("");
  const [desc, setDesc] = useState("");
  const [preu, setPreu] = useState("");

  const [search, setSearch] = useState("");

  // ✅ STABLE IMAGE STATE
  const [images, setImages] = useState([]);

  useEffect(() => {
    load();
  }, [packId]);

  const load = async () => {
    setLoading(true);

    const [pRes, packRes] = await Promise.all([
      fetch("/api/productos"),
      fetch(`/api/packs/${packId}`)
    ]);

    const allProducts = await pRes.json();
    const pack = await packRes.json();

    setProducts(allProducts);

    setNom(pack.nom);
    setDesc(pack.Descripcio);
    setPreu(pack.preu);

    setSelected(
      (pack.productes || []).map(p => ({
        id: p.id,
        nombre: p.nombre,
        quantity: p.pivot?.quantity || 1
      }))
    );

    // IMPORTANT: normalize images
    setImages(
      (pack.images || []).map(img => ({
        id: img.id,
        url: img.url,
        file: null
      }))
    );

    setLoading(false);
  };

  // ---------------- PRODUCTS DND ----------------
  const onDragEnd = ({ active, over }) => {
    if (!over || over.id !== "dropzone") return;

    const id = Number(active.id);

    setSelected(prev => {
      const exists = prev.find(p => p.id === id);

      if (exists) {
        return prev.map(p =>
          p.id === id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }

      const product = products.find(p => p.id === id);
      if (!product) return prev;

      return [
        ...prev,
        { id: product.id, nombre: product.nombre, quantity: 1 }
      ];
    });
  };

  // ---------------- PRODUCTS SEARCH ----------------
  const filteredProducts = products.filter(p =>
    (p.nombre || "").toLowerCase().includes(search.toLowerCase())
  );

  const removeProduct = (id) => {
    setSelected(prev => prev.filter(p => p.id !== id));
  };

  // ---------------- IMAGES ----------------
  const addImages = (e) => {
    const files = Array.from(e.target.files || []);

    const mapped = files.map(file => ({
      id: null,
      file,
      url: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...mapped]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from, to) => {
    const arr = [...images];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setImages(arr);
  };

  // ---------------- SAVE (STABLE SYNC) ----------------
  const save = async () => {
    const formData = new FormData();

    formData.append("_method", "PUT");

    formData.append("nom", nom);
    formData.append("Descripcio", desc);
    formData.append("preu", preu);

    // PRODUCTS
    formData.append(
      "productes",
      JSON.stringify(
        selected.map(p => ({
          id: p.id,
          quantity: p.quantity
        }))
      )
    );

    // IMAGE STATE (SOURCE OF TRUTH)
    const imageState = images.map((img, index) => ({
      id: img.id,
      order: index
    }));

    formData.append("images", JSON.stringify(imageState));

    // ONLY NEW FILES
    images.forEach(img => {
      if (img.file) {
        formData.append("new_images[]", img.file);
      }
    });

    try {
      const res = await fetch(`/api/packs/${packId}`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Save failed");
      }

      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Error saving pack");
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[95%] max-w-5xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Pack</h2>
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded-lg">
            Close
          </button>
        </div>

        {/* BASIC */}
        <div className="grid gap-3 mb-6">
          <input
            className="border rounded-lg p-2"
            value={nom}
            onChange={e => setNom(e.target.value)}
            placeholder="Nom"
          />

          <textarea
            className="border rounded-lg p-2"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Descripció"
          />

          <input
            className="border rounded-lg p-2"
            value={preu}
            onChange={e => setPreu(e.target.value)}
            placeholder="Preu"
          />
        </div>

        {/* IMAGES */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Images</h3>

          <input type="file" multiple onChange={addImages} />

          <div className="flex gap-2 mt-2 flex-wrap">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img.url}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
                >
                  ×
                </button>

                {i > 0 && (
                  <button
                    onClick={() => moveImage(i, i - 1)}
                    className="absolute bottom-0 left-0 bg-gray-200 px-1 rounded"
                  >
                    ←
                  </button>
                )}

                {i < images.length - 1 && (
                  <button
                    onClick={() => moveImage(i, i + 1)}
                    className="absolute bottom-0 right-0 bg-gray-200 px-1 rounded"
                  >
                    →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCTS + DND */}
        <DndContext onDragEnd={onDragEnd}>
          <div className="flex gap-4">

            {/* PRODUCTS */}
            <div className="w-1/2 border rounded-xl p-3">
              <input
                className="w-full border rounded-lg p-2 mb-3"
                placeholder="Search products"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <div className="max-h-[300px] overflow-y-auto">
                {filteredProducts.map(p => (
                  <Draggable key={p.id} product={p} />
                ))}
              </div>
            </div>

            {/* DROP ZONE */}
            <DropZone selected={selected} setSelected={setSelected} remove={removeProduct} />

          </div>
        </DndContext>

        {/* SAVE */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={save}
            className="px-4 py-2 rounded-lg bg-green-500 text-white"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

// ---------------- DRAGGABLE ----------------
function Draggable({ product }) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: product.id
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-2 mb-2 bg-gray-100 rounded-lg cursor-grab"
    >
      {product.nombre}
    </div>
  );
}

// ---------------- DROP ZONE ----------------
function DropZone({ selected, setSelected, remove }) {
  const { setNodeRef } = useDroppable({ id: "dropzone" });

  return (
    <div ref={setNodeRef} className="w-1/2 border rounded-xl p-3 min-h-[300px]">

      {selected.length === 0 && (
        <p className="text-gray-400">Drop products here</p>
      )}

      {selected.map(p => (
        <div key={p.id} className="flex justify-between items-center mb-2 bg-green-50 p-2 rounded-lg">

          <span>{p.nombre}</span>

          <div className="flex gap-2 items-center">
            <button
              onClick={() =>
                setSelected(prev =>
                  prev.map(x =>
                    x.id === p.id
                      ? { ...x, quantity: Math.max(1, x.quantity - 1) }
                      : x
                  )
                )
              }
            >
              -
            </button>

            <span>{p.quantity}</span>

            <button
              onClick={() =>
                setSelected(prev =>
                  prev.map(x =>
                    x.id === p.id
                      ? { ...x, quantity: x.quantity + 1 }
                      : x
                  )
                )
              }
            >
              +
            </button>

            <button
              onClick={() => remove(p.id)}
              className="text-red-500"
            >
              ×
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}