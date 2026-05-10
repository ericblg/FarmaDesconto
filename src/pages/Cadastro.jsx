import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Cadastro() {

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");

  function cadastrar() {

    if (
      nome === "" ||
      email === "" ||
      senha === "" ||
      confirmarSenha === ""
    ) {

      setErro("Preencha todos os campos");
      return;

    }

    if (senha !== confirmarSenha) {

      setErro("As senhas não coincidem");
      return;

    }

    setErro("");

    alert("Cadastro realizado com sucesso!");

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
          Criar Conta
        </h2>

        <p className="description">
          Cadastre-se para acessar a plataforma
        </p>

        <div className="form-group">

          <label>Nome</label>

          <input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

        </div>

        <div className="form-group">

          <label>Email</label>

          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div className="form-group">

          <label>Confirmar Senha</label>

          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />

        </div>

        <p
          className="mostrar-senha"
          onClick={() => setMostrarSenha(!mostrarSenha)}
        >

          {mostrarSenha ? "Ocultar senha" : "Mostrar senha"}

        </p>

        {erro && (
          <p className="erro">
            {erro}
          </p>
        )}

        <button onClick={cadastrar}>
          Cadastrar
        </button>

        <div className="divider">
          <span>ou</span>
        </div>

        <p className="cadastro">

          Já possui uma conta?

          <Link to="/">
            <span> Entrar</span>
          </Link>

        </p>

      </div>

    </div>

  );

}