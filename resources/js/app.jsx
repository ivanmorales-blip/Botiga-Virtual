import React from "react";
import { createRoot } from "react-dom/client";

import '../../scss/FrontPage.scss'
import '../../scss/FrontEndTemplate.scss'
import '../../scss/CategoriaProductos.scss'
import '../../scss/Admintemplate.scss'

import CategoriaProductos from "./views/backend/categorias/categoriaproductos";
import Categoria from "./views/backend/categorias/categoria";
import Packs from "./views/backend/packs/packs";
import PackCreate from "./views/backend/packs/packcreate";
import PackEdit from "./views/backend/packs/packedit";
import ProductList from "./views/backend/producto/productlist";
import ProductCreate from "./views/backend/producto/productcreate";
import CaracteristicasList from "./views/backend/caracteristicas/CaracteristicasList";
import FrontPage from "./views/frontend/FrontPage";
import Solutionlist from "./views/frontend/Listsolucions";
import SolutionCreate from "./views/frontend/Createsolucions";
import CartPage from "./views/frontend/Carrito";
import CartCounter from "../js/utils/cartcounter.jsx";

/* CART COUNTER */
function mountCartCounter() {
  const el = document.getElementById("cart-counter");

  if (el && !el.__root) {
    el.__root = createRoot(el);
    el.__root.render(<CartCounter />);
  }
}

mountCartCounter();

/* MAIN APP */
const rootElement = document.getElementById("app");

if (rootElement) {
  const root = createRoot(rootElement);

  const page = rootElement.dataset.page;
  const id = rootElement.dataset.id;

  switch (page) {
    case "packs-list":
      root.render(<Packs />);
      break;

    case "packs-create":
      root.render(<PackCreate />);
      break;

    case "packs-edit":
      root.render(<PackEdit id={id} />);
      break;

    case "categoria":
      root.render(<Categoria />);
      break;

    case "products-list":
      root.render(<ProductList />);
      break;

    case "products-create":
      root.render(<ProductCreate />);
      break;

    case "caracteristicas-list":
      root.render(<CaracteristicasList />);
      break;

    case "FrontPage":
      root.render(<FrontPage />);
      break;

    case "categoria-productos":
      root.render(<CategoriaProductos />);
      break;

    case "Solucionlist":
      root.render(<Solutionlist />);
      break;

    case "SolucionCreate":
      root.render(<SolutionCreate />);
      break;

    case "cart":
      root.render(<CartPage />);
      break;

    default:
      root.render(<div>Page not found</div>);
  }
} else {
  console.error("React mount point #app not found!");
}