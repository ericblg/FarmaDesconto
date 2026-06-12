import { useState } from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import { useModal } from "../contexts/ModalContext";

export default function Cadastrar() {
  const usuarioStr = localStorage.getItem("usuario");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [validade, setValidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const { showAlert } = useModal();

  async function cadastrarMedicamento() {
    if (!nome || !validade) {
      await showAlert("Por favor, preencha o nome e a data de validade.", "warning");
      return;
    }

    try {
      await api.post("/produtos", {
        nome,
        categoria,
        descricao,
        preco: 0, // mock já que é doação
        data_validade: validade,
        quantidade: Number(quantidade) || 1,
        farmacia_id: usuario ? usuario.id : 1
      });

      await showAlert("Medicamento cadastrado com sucesso!", "success");
      setNome("");
      setCategoria("");
      setQuantidade("");
      setValidade("");
      setDescricao("");
    } catch (error) {
      await showAlert("Erro ao cadastrar: " + (error.message || "Verifique os dados"), "error");
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
              <label>Descrição</label>
              <textarea
                placeholder="Informações adicionais sobre o medicamento..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </div>

          <div className="fornecedor-premium">
            <div>
              <span>Organização</span>
              <h3>{usuario ? (usuario.farmaciaNome || usuario.nome) : 'Farmácia Central'}</h3>
            </div>
            <div>
              <span>Tipo</span>
              <h3>{usuario ? (usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)) : 'Farmácia'}</h3>
            </div>
          </div>

          <div className="acoes-form">
            <button className="btn-principal" onClick={cadastrarMedicamento}>
              Cadastrar Medicamento
            </button>
          </div>
        </div>
      </div>
    </>
  );
}