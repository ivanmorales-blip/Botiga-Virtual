function Draggable({ product }) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: product.id
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-2 bg-gray-100 mb-2 cursor-grab"
    >
      {product.nombre}
    </div>
  );
}