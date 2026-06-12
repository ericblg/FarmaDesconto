import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../App.css";
import { api } from "../services/api";
import { useModal } from "../contexts/ModalContext";

export default function Editar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useModal();

  const [produto, setProduto] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    preco: "",
    quantidade: "",
    data_validade: ""
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarProduto() {
      try {
        const data = await api.get(`/produtos/${id}`);
        if (!data || !data.id) {
          throw new Error("Produto não encontrado.");
        }
        // Converte a data para o formato YYYY-MM-DD para o input type="date"
        if (data.data_validade) {
          data.data_validade = data.data_validade.split('T')[0];
        }
        setProduto(data);
      } catch (err) {
        showAlert("Não foi possível carregar os dados do produto. Ele pode ter sido excluído.", "error");
        navigate("/medicamentos");
      } finally {
        setCarregando(false);
      }
    }
    carregarProduto();
  }, [id, navigate, showAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro("");

    try {
      await api.put(`/produtos/${id}`, produto);
      await showAlert("Produto atualizado com sucesso!", "success");
      navigate("/medicamentos");
    } catch (err) {
      showAlert("Não foi possível salvar as alterações. Verifique os dados e tente novamente.", "error");
    } finally {
      setSalvando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '100px' }}>
        <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
          <h2>Editar Produto</h2>

          {carregando ? (
            <p>Carregando dados do produto...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome do Produto</label>
                <input
                  type="text"
                  name="nome"
                  value={produto.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoria</label>
                <select
                  name="categoria"
                  value={produto.categoria || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Analgésicos">Analgésicos</option>
                  <option value="Anti-inflamatórios">Anti-inflamatórios</option>
                  <option value="Antibióticos">Antibióticos</option>
                </select>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <input
                  type="text"
                  name="descricao"
                  value={produto.descricao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantidade</label>
                <input
                  type="number"
                  name="quantidade"
                  value={produto.quantidade}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Data de Validade</label>
                <input
                  type="date"
                  name="data_validade"
                  value={produto.data_validade}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Fornecedor</label>
                <input
                  type="text"
                  name="fornecedor"
                  value={produto.farmacia?.nome || 'Farmácia Parceira'}
                  disabled
                  title="O fornecedor não pode ser alterado."
                />
              </div>

              {erro && <p className="erro">{erro}</p>}

              <button type="submit" disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar Alterações"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
