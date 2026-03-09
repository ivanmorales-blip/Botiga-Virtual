<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Editar Pack</title>

<script src="https://cdn.tailwindcss.com"></script>

</head>

<body class="bg-gray-100">

<div class="min-h-screen p-8">

<div class="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-10 border border-gray-200">

<h1 class="text-4xl font-bold text-gray-800 mb-10 text-center">
Editar Pack
</h1>


@if($errors->any())
<div class="bg-red-100 p-4 mb-6 rounded-xl">
<ul class="list-disc pl-5 text-red-700">
@foreach ($errors->all() as $error)
<li>{{ $error }}</li>
@endforeach
</ul>
</div>
@endif


<form id="pack-form" action="{{ route('packs.update',$pack->id) }}" method="POST">

@csrf
@method('PUT')


<!-- PACK DATA -->

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

<div>
<label class="block text-sm font-medium text-gray-700 mb-1">
Nom del Pack *
</label>

<input type="text"
name="nom"
value="{{ $pack->nom }}"
class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none">
</div>


<div>
<label class="block text-sm font-medium text-gray-700 mb-1">
Preu *
</label>

<input type="number"
name="preu"
value="{{ $pack->preu }}"
class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none">
</div>


<div>
<label class="block text-sm font-medium text-gray-700 mb-1">
Descripció *
</label>

<textarea name="Descripcio"
rows="2"
class="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none">{{ $pack->Descripcio }}</textarea>
</div>

</div>


<!-- DRAG DROP PRODUCTS -->

<div class="grid grid-cols-1 md:grid-cols-2 gap-10 h-[520px]">


<!-- AVAILABLE PRODUCTS -->

<div>

<h2 class="text-xl font-semibold text-gray-700 mb-3 flex justify-between">

Productes disponibles

<span class="bg-gray-200 px-3 py-1 rounded-full text-sm">
{{ $products->count() }}
</span>

</h2>


<ul id="available-products"
class="bg-gray-100 p-5 rounded-2xl min-h-[350px] space-y-3 shadow-inner overflow-y-auto"
ondragover="allowDrop(event)"
ondrop="drop(event,'available')">


@foreach($products as $product)

<li draggable="true"
ondragstart="drag(event)"
data-id="{{ $product->id }}"
class="available-product p-4 bg-white rounded-xl shadow border border-gray-200 cursor-move flex justify-between items-center hover:bg-gray-50">

<div class="flex flex-col">

<span class="font-semibold text-gray-800">
{{ $product->nombre }}
</span>

<span class="text-sm text-gray-500">
{{ $product->categoria->nombre ?? 'Sense categoria' }}
</span>

<span class="text-sm text-gray-600">
{{ $product->precio }} €
</span>

</div>

<div class="text-gray-300 text-xl select-none">☰</div>

</li>

@endforeach

</ul>

</div>



<!-- PACK PRODUCTS -->

<div>

<h2 class="text-xl font-semibold text-gray-700 mb-3 flex justify-between">

Productes del Pack

<span id="assigned-count"
class="bg-gray-300 px-3 py-1 rounded-full text-sm">
{{ count($packProducts) }}
</span>

</h2>


<ul id="pack-products"
class="bg-gray-100 p-5 rounded-2xl min-h-[350px] space-y-3 shadow-inner overflow-y-auto"
ondragover="allowDrop(event)"
ondrop="drop(event,'assigned')">


@foreach($packProducts as $product)

<li data-id="{{ $product->id }}"
class="p-4 bg-white rounded-xl shadow border border-gray-200 flex justify-between items-center">

<div class="flex flex-col">

<span class="font-semibold text-gray-800">
{{ $product->nombre }}
</span>

<span class="text-sm text-gray-500">
{{ $product->categoria->nombre ?? 'Sense categoria' }}
</span>

<span class="text-sm text-gray-600">
{{ $product->precio }} €
</span>

</div>

<button onclick="removeProduct(this)"
class="text-red-500 font-bold ml-4">
✕
</button>

</li>

@endforeach


</ul>

</div>

</div>



<input type="hidden" name="productes" id="productes-input">


<div class="mt-10 flex justify-end gap-4">

<a href="{{ route('menu') }}"
class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl">
Cancel·lar
</a>

<button type="button"
id="save-btn"
class="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl">
Guardar Canvis
</button>

</div>

</form>

</div>
</div>


<script>

let draggedElement = null;

function drag(event){
draggedElement = event.target;
}

function allowDrop(event){
event.preventDefault();
}

function drop(event,target){

event.preventDefault();

if(target !== "assigned") return;

const packList = document.getElementById("pack-products");

const clone = draggedElement.cloneNode(true);

clone.classList.remove("available-product");

let deleteBtn = document.createElement("button");

deleteBtn.innerHTML="✕";
deleteBtn.className="text-red-500 font-bold ml-4";

deleteBtn.onclick=function(){
clone.remove();
updateCount();
};

clone.appendChild(deleteBtn);

packList.appendChild(clone);

updateCount();
}

function removeProduct(btn){
btn.parentElement.remove();
updateCount();
}

function updateCount(){

let count=document.querySelectorAll("#pack-products li").length;

document.getElementById("assigned-count").innerText=count;

}


document.getElementById("save-btn").addEventListener("click",function(){

let assigned=document.querySelectorAll("#pack-products li");

let ids=[];

assigned.forEach(el=>{
ids.push(el.dataset.id);
});

document.getElementById("productes-input").value=JSON.stringify(ids);

document.getElementById("pack-form").submit();

});

</script>

</body>
</html>