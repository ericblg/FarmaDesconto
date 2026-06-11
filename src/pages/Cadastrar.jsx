import { useState } from "react";
import "../App.css";
import Navbar from "../components/Navbar";

export default function Cadastrar() {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [validade, setValidade] = useState("");
  const [observacoes, setObservacoes] = useState("");

  async function cadastrarMedicamento() {
    if (!nome || !validade) {
      alert("Por favor, preencha o nome e a data de validade.");
      return;
    }

    try {
      const usuarioStr = localStorage.getItem("usuario");
      const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
      const token = usuario ? usuario.token : null;

      const response = await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nome,
          descricao: categoria + " - " + observacoes,
          preco: 0, // mock já que é doação
          data_validade: validade,
          quantidade: Number(quantidade) || 1,
          farmacia_id: 1 // mock para a apresentação
        }),
      });

      if (response.ok) {
        alert("Medicamento cadastrado com sucesso!");
        setNome("");
        setCategoria("");
        setQuantidade("");
        setValidade("");
        setObservacoes("");
      } else {
        const err = await response.json();
        alert("Erro ao cadastrar: " + (err.erro || "Verifique os dados"));
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="topo-cadastrar">
          <div>
            <h1>Cadastrar Medicamento</h1>
            <p>Preencha as informações para disponibilizar medicamentos</p>
          </div>
        </div>

        <div className="card-cadastro">
          <div className="secao-form">
            <h2>Informações do Medicamento</h2>
            <div className="linha-form">
              <div className="form-group">
                <label>Nome do medicamento</label>
                <input
                  type="text"
                  placeholder="Ex: Paracetamol 500mg"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Categoria</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="Analgésicos">Analgésicos</option>
                  <option value="Anti-inflamatórios">Anti-inflamatórios</option>
                  <option value="Antibióticos">Antibióticos</option>
                </select>
              </div>
            </div>

            <div className="linha-form-3">
              <div className="form-group">
                <label>Quantidade</label>
                <input
                  type="number"
                  placeholder="100"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Data de validade</label>
              <input 
                type="date" 
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Observações</label>
              <textarea
                placeholder="Informações adicionais sobre o medicamento..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>

          <div className="fornecedor-premium">
            <div>
              <span>Organização</span>
              <h3>Farmácia Central</h3>
            </div>
            <div>
              <span>Tipo</span>
              <h3>Farmácia</h3>
            </div>
          </div>

          <div className="acoes-form">
            <button className="btn-secundario">Cancelar</button>
            <button className="btn-principal" onClick={cadastrarMedicamento}>
              Cadastrar Medicamento
            </button>
          </div>
        </div>
      </div>
    </>
  );
}