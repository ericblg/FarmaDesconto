import { Link } from "react-router-dom";

export default function Navbar() {
  const usuarioStr = localStorage.getItem("usuario");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
  const isFarmacia = usuario && usuario.tipo === "farmacia";

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">💊</span>
        <h2>REMED</h2>
      </div>

      <nav className="navbar-menu">
        {isFarmacia && (
          <Link to="/dashboard">Dashboard</Link>
        )}

        <Link to="/medicamentos">Medicamentos</Link>

        {isFarmacia && (
          <Link to="/cadastrar">Cadastrar</Link>
        )}

        <Link to="/solicitacoes">Solicitações</Link>

        <Link to="/" onClick={() => localStorage.removeItem("usuario")}>
          Sair
        </Link>
      </nav>
    </header>
  );
}