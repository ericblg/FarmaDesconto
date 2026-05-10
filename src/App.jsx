import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Medicamentos from "./pages/Medicamentos";
import Cadastrar from "./pages/Cadastrar";
import Solicitacoes from "./pages/Solicitacoes";

export default function App() {

  return (

    <BrowserRouter>

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

        {/* SOLICITAÇÕES */}

        <Route
          path="/solicitacoes"
          element={<Solicitacoes />}
        />

      </Routes>

    </BrowserRouter>

  );

}