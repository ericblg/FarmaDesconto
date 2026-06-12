import { useState, useEffect, useMemo } from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import { useModal } from "../contexts/ModalContext";

export default function Solicitacoes() {
  const usuarioStr = localStorage.getItem("usuario");
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
  const isFarmacia = usuario && usuario.tipo === "farmacia";

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("Todos os status");
  const { showAlert, showConfirm, showPrompt } = useModal();

  const carregarSolicitacoes = async () => {
    try {
      const data = await api.get("/solicitacoes");
      setSolicitacoes(data);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar as solicitações.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarSolicitacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function atualizarStatus(id, status) {
    if (await showConfirm(`Mudar status para ${status}?`, "approve")) {
      try {
        await api.put(`/solicitacoes/${id}/status`, { status });
        await showAlert("Status atualizado!", "success");
        carregarSolicitacoes(); // recarrega a lista
      } catch (err) {
        await showAlert(err.message || "Erro ao atualizar status", "error");
      }
    }
  }

  async function editarQuantidade(solicitacao) {
    if (solicitacao.status !== "Pendente") {
      await showAlert("Apenas solicitações Pendentes podem ser editadas.", "warning");
      return;
    }
    const qtdInput = await showPrompt(`Informe a nova quantidade desejada (Atual: ${solicitacao.quantidade}):`, solicitacao.quantidade);
    if (qtdInput === null || qtdInput === "") return;

    const quantidade = parseInt(qtdInput, 10);
    if (isNaN(quantidade) || quantidade <= 0) {
      await showAlert("Quantidade inválida.", "warning");
      return;
    }

    try {
      await api.put(`/solicitacoes/${solicitacao.id}`, { quantidade });
      await showAlert("Quantidade atualizada com sucesso!", "success");
      carregarSolicitacoes();
    } catch (err) {
      await showAlert(err.response?.data?.erro || err.message || "Erro ao editar quantidade.", "error");
    }
  }

  async function cancelarSolicitacao(id) {
    if (await showConfirm("Tem certeza que deseja cancelar esta solicitação? O estoque será devolvido à farmácia.", "delete")) {
      try {
        await api.delete(`/solicitacoes/${id}`);
        await showAlert("Solicitação cancelada com sucesso!", "success");
        carregarSolicitacoes();
      } catch (err) {
        await showAlert(err.response?.data?.erro || err.message || "Erro ao cancelar solicitação.", "error");
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
                    <th>{isFarmacia ? "Solicitante" : "🏥 Farmácia Destino"}</th>
                    <th>Quantidade</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Ações</th>
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
                            {isFarmacia 
                              ? (sol.cliente ? sol.cliente.nome : "Desconhecido") 
                              : (sol.farmacia ? sol.farmacia.nome : "Desconhecido")}
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
                      <td>
                        {isFarmacia ? (
                          <div className="btn-icon-wrapper">
                            {sol.status === "Pendente" && (
                              <button
                                onClick={() => atualizarStatus(sol.id, "Aprovado")}
                                className="btn-icon btn-icon-approve"
                                title="Aprovar"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </button>
                            )}
                            {sol.status === "Aprovado" && (
                              <button
                                onClick={() => atualizarStatus(sol.id, "Concluído")}
                                className="btn-icon btn-icon-edit"
                                title="Concluir"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
                              </button>
                            )}
                          </div>
                        ) : (
                          <>
                            {sol.status === "Pendente" && (
                              <div className="btn-icon-wrapper">
                                <button
                                  onClick={() => editarQuantidade(sol)}
                                  className="btn-icon btn-icon-edit"
                                  title="Editar"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>
                                <button
                                  onClick={() => cancelarSolicitacao(sol.id)}
                                  className="btn-icon btn-icon-cancel"
                                  title="Cancelar"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </td>
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