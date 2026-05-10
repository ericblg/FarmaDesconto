import { Link } from "react-router-dom";

export default function Navbar() {

  return (

    <header className="navbar">

      <div className="navbar-logo">

        <span className="logo-icon">
          💊
        </span>

        <h2>
          REMED
        </h2>

      </div>

      <nav className="navbar-menu">

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/medicamentos">
          Medicamentos
        </Link>

        <Link to="/cadastrar">
          Cadastrar
        </Link>

        <Link to="/solicitacoes">
          Solicitações
        </Link>

        <Link to="/">
          Sair
        </Link>

      </nav>

    </header>

  );

}