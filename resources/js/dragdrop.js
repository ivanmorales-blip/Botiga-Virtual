let draggedElement = null;

function drag(event) {
    // Always drag the <li>
    draggedElement = event.target.closest('li');

    // REQUIRED for drop to work in modern browsers
    event.dataTransfer.setData('text/plain', draggedElement.dataset.id);
    event.dataTransfer.effectAllowed = 'move';
}

function allowDrop(event) {
    event.preventDefault(); // must allow drop
}

function drop(event, target) {
    event.preventDefault();

    if (target !== 'assigned') return;
    if (!draggedElement) return;

    const packList = document.getElementById('pack-products');

    // Clone dragged element
    const clone = draggedElement.cloneNode(true);
    clone.classList.remove('available-product');
    clone.removeAttribute('draggable');

    // Remove old delete buttons
    clone.querySelectorAll('button').forEach(btn => btn.remove());

    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '✕';
    deleteBtn.className = 'text-red-500 font-bold ml-4';
    deleteBtn.onclick = function () {
        clone.remove();
        updateCount();
    };
    clone.appendChild(deleteBtn);

    packList.appendChild(clone);
    updateCount();
}

function updateCount() {
    const count = document.querySelectorAll('#pack-products li').length;
    document.getElementById('assigned-count').innerText = count;
}