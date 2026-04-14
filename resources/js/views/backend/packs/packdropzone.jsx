function DropZone({ selected, setSelected }) {
  const { setNodeRef } = useDroppable({
    id: "dropzone"
  });

  return (
    <div ref={setNodeRef} className="w-1/2 border p-2 min-h-[300px]">

      {selected.length === 0 && (
        <p className="text-gray-400">Drop products here</p>
      )}

      {selected.map(p => (
        <div key={p.id} className="flex justify-between mb-2">

          <span>{p.nombre}</span>

          <div className="flex gap-2">
            <button onClick={() =>
              setSelected(prev =>
                prev.map(x =>
                  x.id === p.id
                    ? { ...x, quantity: Math.max(1, x.quantity - 1) }
                    : x
                )
              )
            }>-</button>

            <span>{p.quantity}</span>

            <button onClick={() =>
              setSelected(prev =>
                prev.map(x =>
                  x.id === p.id
                    ? { ...x, quantity: x.quantity + 1 }
                    : x
                )
              )
            }>+</button>
          </div>

        </div>
      ))}
    </div>
  );
}