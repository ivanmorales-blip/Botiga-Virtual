import React from "react";
import { createRoot } from "react-dom/client";

import '../../scss/FrontPage.scss';
import '../../scss/FrontEndTemplate.scss';
import '../../scss/CategoriaProductos.scss';
import '../../scss/Admintemplate.scss';

import NotificationListener from "./components/notificationlistener.jsx";

/* PAGES */
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
import ProfilePage from "../js/views/frontend/Profile.jsx";
import PedidoManager from "../js/views/backend/Pedido/GestionPedidos.jsx";
import ConfiguracionsPanel from "./views/backend/configuracions/configuracionsPanell.jsx";

/* -----------------------------
   GLOBAL WRAPPER (IMPORTANT FIX)
------------------------------ */
function App({ Page, props }) {
  return (
    <>
      <NotificationListener />
      <Page {...props} />
    </>
  );
}

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
      root.render(<App Page={Packs} />);
      break;

    case "packs-create":
      root.render(<App Page={PackCreate} />);
      break;

    case "packs-edit":
      root.render(<App Page={PackEdit} props={{ id }} />);
      break;

    case "categoria":
      root.render(<App Page={Categoria} />);
      break;

    case "products-list":
      root.render(<App Page={ProductList} />);
      break;

    case "products-create":
      root.render(<App Page={ProductCreate} />);
      break;

    case "caracteristicas-list":
      root.render(<App Page={CaracteristicasList} />);
      break;

    case "FrontPage":
      root.render(<App Page={FrontPage} />);
      break;

    case "categoria-productos":
      root.render(<App Page={CategoriaProductos} />);
      break;

    case "Solucionlist":
      root.render(<App Page={Solutionlist} />);
      break;

    case "SolucionCreate":
      root.render(<App Page={SolutionCreate} />);
      break;

    case "cart":
      root.render(<App Page={CartPage} />);
      break;

    case "profile":
      root.render(<App Page={ProfilePage} />);
      break;

    case "pedidos-gestion":
      root.render(<App Page={PedidoManager} />);
      break;
    
    case "configuracions-panel":
      root.render(<ConfiguracionsPanel />);
      break;

    default:
      root.render(
        <App Page={() => <div>Page not found</div>} />
      );
  }
} else {
  console.error("React mount point #app not found!");
}