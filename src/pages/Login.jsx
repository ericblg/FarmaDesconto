import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "../App.css";

export default function Login() {

  const navigate = useNavigate();

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar() {
    try {
      const response = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: login, senha: senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setErro("");
        // Save user info if needed
        localStorage.setItem("usuario", JSON.stringify(data));
        navigate("/dashboard");
      } else {
        setErro(data.erro || "Login ou senha incorretos");
      }
    } catch (error) {
      setErro("Erro ao conectar com o servidor");
    }
  }

  return (

    <div className="container">

      <div className="logo-area">

        <h1 className="logo">
          REMED
        </h1>

        <p className="subtitle">
          Rede de Redistribuição de Medicamentos
        </p>

      </div>

      <div className="card">

        <h2>
          Entrar na Plataforma
        </h2>

        <p className="description">
          Faça login para acessar sua conta
        </p>

        <div className="form-group">

          <label>Login</label>

          <input
            type="text"
            placeholder="Digite seu login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

        </div>

        <div className="form-group">

          <label>Senha</label>

          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

        </div>

        <p
          className="mostrar-senha"
          onClick={() =>
            setMostrarSenha(!mostrarSenha)
          }
        >

          {mostrarSenha
            ? "Ocultar senha"
            : "Mostrar senha"}

        </p>

        {erro && (
          <p className="erro">
            {erro}
          </p>
        )}

        <button onClick={entrar}>
          Entrar
        </button>

        <div className="divider">

          <span>
            ou
          </span>

        </div>

        <p className="cadastro">

          Ainda não tem uma conta?

          <Link to="/cadastro">

            <span>
              {" "}Cadastre-se
            </span>

          </Link>

        </p>

      </div>

    </div>

  );

}
