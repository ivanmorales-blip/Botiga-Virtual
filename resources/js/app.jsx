import React from "react";
import ReactDOM from "react-dom/client";

// Import your views
import Categoria from "./views/categoria";
import CategoriaProductos from "./views/categoriaproductos";
import Packs from "./views/packs";
import PackCreate from "./views/packcreate";
import PackEdit from "./views/packedit";
import ProductList from "./views/productlist";   // New
import ProductCreate from "./views/productcreate"; // New
import CaracteristicasList from "./views/CaracteristicasList";
import FrontPage from "./views/FrontPage";



// Grab the mount point
const rootElement = document.getElementById("app");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  // Use data-page attribute from Blade to decide which view to render
  const page = rootElement.dataset.page;
  const id = rootElement.dataset.id; // For edit pages

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

    case "products-list":        // NEW
      root.render(<ProductList />);
      break;

    case "products-create":      // NEW
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

    default:
      root.render(<div>Page not found</div>);
  }
} else {
  console.error("React mount point #app not found!");
}