import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import { useModal } from "../contexts/ModalContext";

export default function Medicamentos() {
  const usuarioStr = localStorage.getItem("usuario");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
  const isFarmacia = usuario && usuario.tipo === "farmacia";

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [buscaTexto, setBuscaTexto] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas as categorias");
  const { showAlert, showConfirm, showPrompt } = useModal();

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
    if (await showConfirm("Tem certeza que deseja excluir este medicamento?", "delete")) {
      try {
        await api.delete(`/produtos/${id}`);
        setProdutos(produtos.filter(p => p.id !== id));
        await showAlert("Medicamento excluído com sucesso!", "success");
      } catch (err) {
        await showAlert(err.message || "Erro ao excluir o medicamento.", "error");
      }
    }
  }

  async function solicitarMedicamento(produto) {
    const qtdInput = await showPrompt(`Quantas unidades de ${produto.nome} você deseja solicitar? (Máximo: ${produto.quantidade})`, "1");
    if (qtdInput === null || qtdInput === "") return; // Cancelado

    const quantidade = parseInt(qtdInput, 10);
    if (isNaN(quantidade) || quantidade <= 0) {
      await showAlert("Quantidade inválida.", "warning");
      return;
    }
    if (quantidade > produto.quantidade) {
      await showAlert(`Quantidade indisponível! O estoque atual é de ${produto.quantidade} unidades.`, "warning");
      return;
    }

    if (await showConfirm(`Confirmar a solicitação de ${quantidade} unidade(s) deste medicamento?`, "approve")) {
      try {
        await api.post("/solicitacoes", { produto_id: produto.id, quantidade });
        await showAlert("Solicitação enviada com sucesso! Acompanhe na aba de Solicitações.", "success");
        // Atualiza a lista localmente para refletir o novo estoque sem precisar dar reload
        setProdutos(produtos.map(p => p.id === produto.id ? { ...p, quantidade: p.quantidade - quantidade } : p));
      } catch (err) {
        await showAlert(err.response?.data?.erro || err.message || "Erro ao solicitar o medicamento.", "error");
      }
    }
  }

  const produtosExibidos = useMemo(() => {
    let filtrados = isFarmacia ? produtos.filter(p => p.farmacia && p.farmacia.usuario_id === usuario?.id) : produtos;

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
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', lineHeight: '1.2' }}>
                      {produto.nome}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0, fontWeight: '500' }}>
                      {produto.descricao || 'Sem descrição'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#374151' }}>
                      <span style={{ fontSize: '1.1rem' }}>📦</span>
                      <span style={{ fontWeight: '600' }}>Estoque:</span>
                      <span>{produto.quantidade} unidades</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#374151' }}>
                      <span style={{ fontSize: '1.1rem' }}>⏳</span>
                      <span style={{ fontWeight: '600' }}>Validade:</span>
                      <span>{dataValidade.toLocaleDateString('pt-BR')}</span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        backgroundColor: diasRestantes < 30 ? '#fee2e2' : '#f0fdf4', 
                        color: diasRestantes < 30 ? '#ef4444' : '#15803d', 
                        marginLeft: 'auto',
                        fontWeight: '700'
                      }}>
                        {diasRestantes} dias
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#374151' }}>
                      <span style={{ fontSize: '1.1rem' }}>🏢</span>
                      <span style={{ fontWeight: '600' }}>Fornecedor:</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {produto.farmacia?.nome || 'Farmácia Parceira'}
                      </span>
                    </div>
                  </div>

                  {isFarmacia ? (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color, #eee)', display: 'flex', justifyContent: 'center' }}>
                      <div className="btn-icon-wrapper">
                        <Link to={`/editar/${produto.id}`} className="btn-icon btn-icon-edit" title="Editar">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </Link>
                        <button onClick={() => excluirMedicamento(produto.id)} className="btn-icon btn-icon-cancel" title="Excluir">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color, #eee)', display: 'flex', gap: '10px' }}>
                      <button onClick={() => solicitarMedicamento(produto)} className="btn-principal" style={{ flex: 1 }}>Solicitar</button>
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