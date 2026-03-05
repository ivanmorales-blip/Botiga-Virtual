let draggedElement = null;

function drag(event) {
    draggedElement = event.target;
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event, target) {
    event.preventDefault();

    if (target !== "assigned") return;

    const packList = document.getElementById("pack-products");

    // Clone instead of moving
    const clone = draggedElement.cloneNode(true);

    clone.classList.remove("available-product");

    // Add delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "✕";
    deleteBtn.className = "text-red-500 font-bold ml-4";

    deleteBtn.onclick = function () {
        clone.remove();
        updateCount();
    };

    clone.appendChild(deleteBtn);

    packList.appendChild(clone);

    updateCount();
}

function updateCount() {
    let count = document.querySelectorAll("#pack-products li").length;
    document.getElementById("assigned-count").innerText = count;
}