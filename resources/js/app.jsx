import React from "react";
import ReactDOM from "react-dom/client";

// Import your views
import CategoriaProductos from "./views/backend/categorias/categoriaproductos";
import Categoria from "./views/backend/categorias/categoria";
import Packs from "./views/backend/packs/packs";
import PackCreate from "./views/backend/packs/packcreate";
import PackEdit from "./views/backend/packs/packedit";
import ProductList from "./views/backend/producto/productlist";   // New
import ProductCreate from "./views/backend/producto/productcreate"; // New
import CaracteristicasList from "./views/backend/caracteristicas/CaracteristicasList";
import FrontPage from "./views/frontend/FrontPage";
import Solutionlist from "./views/frontend/Listsolucions";
import SolutionCreate from "./views/frontend/Createsolucions";



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

    case "Solucionlist":      
      root.render(<Solutionlist />);
      break;

    case "SolucionCreate":      
      root.render(<SolutionCreate />);
      break;
      
    default:
      root.render(<div>Page not found</div>);
  }
} else {
  console.error("React mount point #app not found!");
}