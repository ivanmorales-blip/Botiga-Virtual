import React, { useState, useEffect } from "react";


export default function ProductCreate() {
 const [nombre, setNombre] = useState("");
 const [precio, setPrecio] = useState("");
 const [stock, setStock] = useState("");
 const [descripcion, setDescripcion] = useState("");
 const [categoriaId, setCategoriaId] = useState("");
 const [marca, setMarca] = useState("");
 const [destacat, setDestacat] = useState(false);
 const [codi, setCodi] = useState("");
 const [imagenes, setImagenes] = useState([]);
 const [imagePreviews, setImagePreviews] = useState([]);
 const [fileInputKey, setFileInputKey] = useState(0);


 const [categorias, setCategorias] = useState([]);
 const [caracteristicas, setCaracteristicas] = useState([]);
 const [selectedCaracteristicas, setSelectedCaracteristicas] = useState([]);


 const [loading, setLoading] = useState(false);
 const [toast, setToast] = useState(null); // { type: "success"|"error", message: "" }
 const [toastVisible, setToastVisible] = useState(false);


 useEffect(() => {
   fetch("/api/categorias").then(res => res.json()).then(setCategorias);
   fetch("/api/caracteristicas").then(res => res.json()).then(setCaracteristicas);
 }, []);


 const toggleCaracteristica = (id) => {
   setSelectedCaracteristicas(prev =>
     prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
   );
 };


 const handleImageChange = (e) => {
   const files = Array.from(e.target.files).slice(0, 3);
   setImagenes(files);
   const previews = [];
   files.forEach((file) => {
     const reader = new FileReader();
     reader.onload = (ev) => {
       previews.push(ev.target.result);
       if (previews.length === files.length) setImagePreviews([...previews]);
     };
     reader.readAsDataURL(file);
   });
   if (files.length === 0) setImagePreviews([]);
 };


 const removeImage = (index) => {
   const newImagenes = imagenes.filter((_, i) => i !== index);
   const newPreviews = imagePreviews.filter((_, i) => i !== index);
   setImagenes(newImagenes);
   setImagePreviews(newPreviews);
   if (newImagenes.length === 0) setFileInputKey(prev => prev + 1);
 };


 const showToast = (type, message) => {
   setToast({ type, message });
   setTimeout(() => setToastVisible(true), 10);
   setTimeout(() => setToastVisible(false), 2500);
   setTimeout(() => setToast(null), 3000);
 };


 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);


   try {
     const formData = new FormData();
     formData.append("nombre", nombre);
     formData.append("codi", codi || "");
     formData.append("precio", precio);
     formData.append("stock", stock);
     formData.append("descripcion", descripcion);
     formData.append("categoria_id", categoriaId || "");
     formData.append("marca", marca);
     formData.append("destacat", destacat ? 1 : 0);
     selectedCaracteristicas.forEach(id => formData.append("caracteristicas[]", id));


     if (imagenes.length > 0) {
       formData.append("imagen", imagenes[0]);
       imagenes.slice(1).forEach(img => formData.append("imagenes[]", img));
     }


     const res = await fetch("/api/productos", { method: "POST", body: formData });
     const data = await res.json();
     if (!res.ok) throw data;


     setNombre(""); setCodi(""); setPrecio(""); setStock("");
     setDescripcion(""); setCategoriaId(""); setMarca("");
     setSelectedCaracteristicas([]); setDestacat(false);
     setImagenes([]); setImagePreviews([]);
     setFileInputKey(prev => prev + 1);


     showToast("success", "Producte creat correctament");


   } catch (err) {
     console.error(err);
     const msg = err.errors
       ? Object.values(err.errors).flat()[0]
       : "Error al crear el producte";
     showToast("error", msg);
   } finally {
     setLoading(false);
   }
 };


 const isSuccess = toast?.type === "success";


 return (
   <div className="max-w-xl mx-auto rounded-xl shadow-lg p-4">


     {/* TOAST */}
     {toast && (
       <div style={{
         position: "fixed",
         bottom: "24px",
         right: "24px",
         zIndex: 9999,
         display: "flex",
         alignItems: "center",
         gap: "12px",
         background: "#1a1a1a",
         color: "#fff",
         padding: "14px 20px",
         borderRadius: "14px",
         boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
         minWidth: "260px",
         transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
         opacity: toastVisible ? 1 : 0,
         transform: toastVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
       }}>
         <div style={{
           background: isSuccess ? "#22c55e" : "#ef4444",
           borderRadius: "50%",
           width: "32px",
           height: "32px",
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           flexShrink: 0,
         }}>
           {isSuccess ? (
             <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
               <path d="M3 8l3.5 3.5L13 4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
           ) : (
             <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
               <path d="M4 4l8 8M12 4l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
             </svg>
           )}
         </div>
         <div>
           <p style={{ fontWeight: 700, fontSize: "14px", margin: 0 }}>
             {isSuccess ? "Producte creat!" : "Error"}
           </p>
           <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>
             {toast.message}
           </p>
         </div>
       </div>
     )}


     <h1 className="text-2xl font-bold mb-4 text-orange-600 text-center">
       Crear Producte
     </h1>


     <form onSubmit={handleSubmit} className="space-y-4">


       <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border p-2 rounded" />
       <input type="text" placeholder="Codi" value={codi} onChange={e => setCodi(e.target.value)} className="w-full border p-2 rounded" />
       <input type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} className="w-full border p-2 rounded" />
       <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} className="w-full border p-2 rounded" />
       <input placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} className="w-full border p-2 rounded" />
       <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full border p-2 rounded" />


       <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} className="w-full border p-2 rounded">
         <option value="">Categoria</option>
         {categorias.map(c => <option key={c.id} value={c.id}>{c.tipo}</option>)}
       </select>


       {/* IMÁGENES */}
       <div>
         <label className="text-sm font-semibold text-gray-700">
           Imatges del producte <span className="text-gray-400 font-normal"></span>
         </label>


         {imagePreviews.length > 0 && (
           <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "8px" }}>
              {imagePreviews.map((src, i) => (
                <div key={i} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", background: "#f9fafb", border: "1px solid #e5e7eb", aspectRatio: "1" }}>
                  <img
                    src={src}
                    alt={`Preview ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    style={{ position: "absolute", top: "4px", right: "4px", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
         )}


         {imagenes.length < 3 && (
           <input key={fileInputKey} type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full border p-2 rounded mt-2" />
         )}
         {imagenes.length === 3 && (
           <p className="text-xs text-orange-500 mt-1">Ja has afegit el màxim de 3 imatges.</p>
         )}
       </div>


       {/* DESTACAT */}
       <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="destacat"
            checked={destacat}
            onChange={e => setDestacat(e.target.checked)}
            className="w-4 h-4 flex-shrink-0 cursor-pointer accent-orange-500"
          />
          <label htmlFor="destacat" className="text-gray-700 font-semibold cursor-pointer">
            Producte destacat
          </label>
        </div>


       {/* CARACTERÍSTICAS */}
      <div>
        <label className="font-semibold">Característiques</label>
        <div className="border rounded p-2 max-h-40 overflow-y-auto space-y-1">
          {caracteristicas.map(c => (
            <div key={c.id} className="flex items-center gap-2 py-0.5">
              <input
                type="checkbox"
                id={`car-${c.id}`}
                checked={selectedCaracteristicas.includes(c.id)}
                onChange={() => toggleCaracteristica(c.id)}
                className="w-4 h-4 flex-shrink-0 cursor-pointer accent-orange-500"
              />
              <label htmlFor={`car-${c.id}`} className="text-sm text-gray-700 cursor-pointer">
                {c.descripcio}
              </label>
            </div>
          ))}
        </div>
      </div>


       <button className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition">
         {loading ? "Creando..." : "Crear"}
       </button>


     </form>
   </div>
 );
}
