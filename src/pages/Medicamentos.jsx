import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar";
import { api } from "../services/api";

export default function Medicamentos() {
  const usuarioStr = localStorage.getItem("usuario");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
  const isFarmacia = usuario && usuario.tipo === "farmacia";

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [buscaTexto, setBuscaTexto] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas as categorias");

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const data = await api.get("/produtos");
        setProdutos(data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        setErro("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
      } finally {
        setCarregando(false);
      }
    }
    carregarProdutos();
  }, []);

  async function excluirMedicamento(id) {
    if (window.confirm("Tem certeza que deseja excluir este medicamento?")) {
      try {
        await api.delete(`/produtos/${id}`);
        setProdutos(produtos.filter(p => p.id !== id));
        alert("Medicamento excluído com sucesso!");
      } catch (err) {
        alert(err.message || "Erro ao excluir o medicamento.");
      }
    }
  }

  async function solicitarMedicamento(produto_id) {
    if (window.confirm("Confirmar a solicitação deste medicamento?")) {
      try {
        await api.post("/solicitacoes", { produto_id, quantidade: 1 });
        alert("Solicitação enviada com sucesso! Acompanhe na aba de Solicitações.");
      } catch (err) {
        alert(err.message || "Erro ao solicitar o medicamento.");
      }
    }
  }

  const produtosExibidos = useMemo(() => {
    let filtrados = isFarmacia ? produtos.filter(p => p.farmacia_id === usuario?.id) : produtos;
    
    if (buscaTexto) {
      const buscaLower = buscaTexto.toLowerCase();
      filtrados = filtrados.filter(p => 
        p.nome.toLowerCase().includes(buscaLower) || 
        (p.descricao && p.descricao.toLowerCase().includes(buscaLower))
      );
    }

    if (categoriaFiltro !== "Todas as categorias") {
      filtrados = filtrados.filter(p => 
        p.descricao && p.descricao.includes(categoriaFiltro)
      );
    }

    return filtrados;
  }, [produtos, isFarmacia, usuario, buscaTexto, categoriaFiltro]);


  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="solicitacoes-header">
          <h1>{isFarmacia ? "Meus Medicamentos Cadastrados" : "Medicamentos Disponíveis"}</h1>
          <p>{isFarmacia ? "Gerencie seu estoque de medicamentos" : "Encontre medicamentos disponíveis para solicitação"}</p>
        </div>

        <div className="filtros">
          <h2>🔎 Filtros de Busca</h2>
          <div className="filtros-grid">
            <div className="form-group">
              <label>Buscar</label>
              <input 
                type="text" 
                placeholder="Nome ou categoria..." 
                value={buscaTexto}
                onChange={(e) => setBuscaTexto(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
                <option value="Todas as categorias">Todas as categorias</option>
                <option value="Analgésicos">Analgésicos</option>
                <option value="Anti-inflamatórios">Anti-inflamatórios</option>
                <option value="Antibióticos">Antibióticos</option>
              </select>
            </div>
          </div>
          <div className="resultado-busca">
            <p>Use os filtros para refinar os resultados</p>
          </div>
        </div>

        <div className="medicamentos-grid">
          {carregando ? (
            <p>Carregando medicamentos...</p>
          ) : erro ? (
            <div className="erro-mensagem" style={{ color: "var(--red-color, #e74c3c)", textAlign: "center", padding: "2rem" }}>
              <h3>⚠️ Ops!</h3>
              <p>{erro}</p>
            </div>
          ) : produtosExibidos.length > 0 ? (
            produtosExibidos.map((produto) => {
              const dataValidade = new Date(produto.data_validade);
              const hoje = new Date();
              const diasRestantes = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={produto.id} className="med-card premium">
                  <h3>{produto.nome}</h3>
                  <div className="tags">
                    <span className="categoria">{produto.descricao?.split(' - ')[0] || 'Sem Categoria'}</span>
                    <span className="status disponivel">Disponível</span>
                  </div>
                  <div className="info-med">
                    <p>📦 {produto.quantidade} unidades</p>
                    <p>📍 Farmácia Parceira</p>
                  </div>
                  <div className="validade-box">
                    <div>
                      <span>Validade</span>
                      <h4>{dataValidade.toLocaleDateString('pt-BR')}</h4>
                    </div>
                    <div className={`dias-restantes ${diasRestantes < 30 ? 'laranja' : ''}`}>
                      {diasRestantes} dias
                    </div>
                  </div>
                  <div className="fornecedor">
                    <span>Fornecedor</span>
                    <h4>Farmácia Parceira (ID: {produto.farmacia_id})</h4>
                  </div>
                  
                  {isFarmacia ? (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color, #eee)', display: 'flex', gap: '10px' }}>
                      <Link to={`/editar/${produto.id}`} className="btn-secundario" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Editar</Link>
                      <button onClick={() => excluirMedicamento(produto.id)} className="btn-secundario" style={{ flex: 1, backgroundColor: '#fee2e2', color: '#ef4444', borderColor: '#fca5a5' }}>Excluir</button>
                    </div>
                  ) : (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color, #eee)', display: 'flex', gap: '10px' }}>
                      <button onClick={() => solicitarMedicamento(produto.id)} className="btn-principal" style={{ flex: 1 }}>Solicitar / Comprar</button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>Nenhum medicamento encontrado.</p>
          )}
        </div>
      </div>
    </>
  );
}