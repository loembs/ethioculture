import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LocalStorageUtils } from "./utils/localStorageUtils";

// Valider et nettoyer les données d'authentification au démarrage
LocalStorageUtils.validateAuthData();

createRoot(document.getElementById("root")!).render(<App />);
