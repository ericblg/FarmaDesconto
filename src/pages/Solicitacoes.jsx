import { useState, useEffect, useMemo } from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import { api } from "../services/api";

export default function Solicitacoes() {
  const usuarioStr = localStorage.getItem("usuario");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
  const isFarmacia = usuario && usuario.tipo === "farmacia";

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("Todos os status");

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  async function carregarSolicitacoes() {
    try {
      const data = await api.get("/solicitacoes");
      setSolicitacoes(data);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar as solicitações.");
    } finally {
      setCarregando(false);
    }
  }

  async function atualizarStatus(id, status) {
    if (window.confirm(`Mudar status para ${status}?`)) {
      try {
        await api.put(`/solicitacoes/${id}/status`, { status });
        alert("Status atualizado!");
        carregarSolicitacoes(); // recarrega a lista
      } catch (err) {
        alert(err.message || "Erro ao atualizar status");
      }
    }
  }

  const metricas = useMemo(() => {
    return {
      total: solicitacoes.length,
      pendentes: solicitacoes.filter(s => s.status === "Pendente").length,
      aprovadas: solicitacoes.filter(s => s.status === "Aprovado").length,
      concluidas: solicitacoes.filter(s => s.status === "Concluído").length,
    };
  }, [solicitacoes]);

  const solicitacoesExibidas = useMemo(() => {
    if (filtroStatus === "Todos os status") return solicitacoes;
    return solicitacoes.filter(s => s.status === filtroStatus);
  }, [solicitacoes, filtroStatus]);

  return (
    <>
      <Navbar />
      <div className="dashboard">
        {/* HEADER */}
        <div className="solicitacoes-header">
          <h1>Minhas Solicitações</h1>
          <p>
            {isFarmacia 
              ? "Gerencie as solicitações de medicamentos recebidas dos clientes." 
              : "Acompanhe o status dos medicamentos que você solicitou."}
          </p>
        </div>

        {/* MÉTRICAS */}
        <div className="cards-metricas">
          <div className="card-metrica">
            <p>Total</p>
            <h2>{metricas.total}</h2>
          </div>
          <div className="card-metrica">
            <p>Pendentes</p>
            <h2 className="amarelo">{metricas.pendentes}</h2>
          </div>
          <div className="card-metrica">
            <p>Aprovadas</p>
            <h2 className="azul">{metricas.aprovadas}</h2>
          </div>
          <div className="card-metrica">
            <p>Concluídas</p>
            <h2 className="verde">{metricas.concluidas}</h2>
          </div>
        </div>

        {/* TABELA */}
        <div className="tabela-box">
          <div className="tabela-topo">
            <div className="titulo-tabela">
              <h2>📄 Lista de Solicitações</h2>
            </div>
            <select 
              className="filtro-status"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="Todos os status">Todos os status</option>
              <option value="Pendente">Pendente</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>

          {carregando ? (
            <p style={{ padding: "20px" }}>Carregando dados...</p>
          ) : erro ? (
            <p style={{ padding: "20px", color: "red" }}>{erro}</p>
          ) : solicitacoesExibidas.length === 0 ? (
            <p style={{ padding: "20px" }}>Nenhuma solicitação encontrada.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Medicamento</th>
                    <th>{isFarmacia ? "Solicitante" : "Farmácia Destino (ID)"}</th>
                    <th>Quantidade</th>
                    <th>Data</th>
                    <th>Status</th>
                    {isFarmacia && <th>Ações (Farmácia)</th>}
                  </tr>
                </thead>
                <tbody>
                  {solicitacoesExibidas.map((sol) => (
                    <tr key={sol.id}>
                      <td className="medicamento-nome">
                        {sol.produto ? sol.produto.nome : "Produto excluído"}
                      </td>
                      <td>
                        <div className="solicitante">
                          <strong>
                            {isFarmacia ? (sol.cliente ? sol.cliente.nome : "Desconhecido") : `Farmácia ID: ${sol.farmacia_id}`}
                          </strong>
                          {isFarmacia && <span>{sol.cliente?.email}</span>}
                        </div>
                      </td>
                      <td>{sol.quantidade}</td>
                      <td>{new Date(sol.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <span className={`status ${sol.status.toLowerCase().replace('í', 'i')}`}>
                          {sol.status}
                        </span>
                      </td>
                      {isFarmacia && (
                        <td>
                          {sol.status === "Pendente" && (
                            <button onClick={() => atualizarStatus(sol.id, "Aprovado")} className="btn-secundario" style={{ borderColor: '#3b82f6', color: '#3b82f6', backgroundColor: '#eff6ff', padding: '6px 12px', fontSize: '12px' }}>
                              Aprovar
                            </button>
                          )}
                          {sol.status === "Aprovado" && (
                            <button onClick={() => atualizarStatus(sol.id, "Concluído")} className="btn-secundario" style={{ borderColor: '#22c55e', color: '#22c55e', backgroundColor: '#f0fdf4', padding: '6px 12px', fontSize: '12px' }}>
                              Concluir
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}