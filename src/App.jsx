import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { ModalProvider } from "./contexts/ModalContext";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Medicamentos from "./pages/Medicamentos";
import Cadastrar from "./pages/Cadastrar";
import Solicitacoes from "./pages/Solicitacoes";
import Editar from "./pages/Editar";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <ModalProvider>
      <BrowserRouter>
        <button 
          className="dark-mode-toggle" 
          onClick={() => setDarkMode(!darkMode)}
          title="Alternar Modo Escuro"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* CADASTRO */}

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* MEDICAMENTOS */}

        <Route
          path="/medicamentos"
          element={<Medicamentos />}
        />

        {/* CADASTRAR */}

        <Route
          path="/cadastrar"
          element={<Cadastrar />}
        />

        {/* EDITAR */}

        <Route
          path="/editar/:id"
          element={<Editar />}
        />

        {/* SOLICITAÇÕES */}

        <Route
          path="/solicitacoes"
          element={<Solicitacoes />}
        />

      </Routes>
    </BrowserRouter>
    </ModalProvider>
  );
}