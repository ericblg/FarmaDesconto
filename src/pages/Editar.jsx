import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../App.css";
import { api } from "../services/api";

export default function Editar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState({
    nome: "",
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
        // Converte a data para o formato YYYY-MM-DD para o input type="date"
        if (data.data_validade) {
          data.data_validade = data.data_validade.split('T')[0];
        }
        setProduto(data);
      } catch (err) {
        setErro(err.message || "Erro ao carregar produto.");
      } finally {
        setCarregando(false);
      }
    }
    carregarProduto();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro("");

    try {
      await api.put(`/produtos/${id}`, produto);
      alert("Produto atualizado com sucesso!");
      navigate("/medicamentos");
    } catch (err) {
      setErro(err.message || "Erro ao salvar o produto.");
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
                <label>Preço</label>
                <input
                  type="number"
                  step="0.01"
                  name="preco"
                  value={produto.preco}
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
