import "../App.css";
import Navbar from "../components/Navbar";

export default function Solicitacoes() {

  return (

    <>

      <Navbar />

      <div className="dashboard">

        {/* HEADER */}

        <div className="solicitacoes-header">

          <h1>
            Solicitações
          </h1>

          <p>
            Gerencie as solicitações recebidas
          </p>

        </div>

        {/* MÉTRICAS */}

        <div className="cards-metricas">

          <div className="card-metrica">

            <p>Total</p>

            <h2>3</h2>

          </div>

          <div className="card-metrica">

            <p>Pendentes</p>

            <h2 className="amarelo">
              1
            </h2>

          </div>

          <div className="card-metrica">

            <p>Aprovadas</p>

            <h2 className="azul">
              1
            </h2>

          </div>

          <div className="card-metrica">

            <p>Concluídas</p>

            <h2 className="verde">
              1
            </h2>

          </div>

        </div>

        {/* TABELA */}

        <div className="tabela-box">

          <div className="tabela-topo">

            <div className="titulo-tabela">

              <h2>
                📄 Lista de Solicitações
              </h2>

            </div>

            <select className="filtro-status">

              <option>
                Todos os status
              </option>

              <option>
                Pendente
              </option>

              <option>
                Aprovado
              </option>

              <option>
                Concluído
              </option>

            </select>

          </div>

          <table>

            <thead>

              <tr>

                <th>Medicamento</th>
                <th>Solicitante</th>
                <th>Quantidade</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>

              </tr>

            </thead>

            <tbody>

              {/* ITEM */}

              <tr>

                <td className="medicamento-nome">
                  Cetirizina 10mg
                </td>

                <td>

                  <div className="solicitante">

                    <strong>
                      Saúde Para Todos
                    </strong>

                    <span>
                      ong@test.com
                    </span>

                  </div>

                </td>

                <td>100</td>

                <td>09/03/2026</td>

                <td>

                  <span className="status pendente">
                    Pendente
                  </span>

                </td>

                <td>

                  <button className="btn-detalhes">
                    Ver Detalhes
                  </button>

                </td>

              </tr>

              {/* ITEM */}

              <tr>

                <td className="medicamento-nome">
                  Ibuprofeno 600mg
                </td>

                <td>

                  <div className="solicitante">

                    <strong>
                      Cruz Vermelha
                    </strong>

                    <span>
                      ong@test.com
                    </span>

                  </div>

                </td>

                <td>150</td>

                <td>07/03/2026</td>

                <td>

                  <span className="status aprovado">
                    Aprovado
                  </span>

                </td>

                <td>

                  <button className="btn-detalhes">
                    Ver Detalhes
                  </button>

                </td>

              </tr>

              {/* ITEM */}

              <tr>

                <td className="medicamento-nome">
                  Paracetamol 500mg
                </td>

                <td>

                  <div className="solicitante">

                    <strong>
                      Médicos Sem Fronteiras
                    </strong>

                    <span>
                      ong@test.com
                    </span>

                  </div>

                </td>

                <td>200</td>

                <td>04/03/2026</td>

                <td>

                  <span className="status concluido">
                    Concluído
                  </span>

                </td>

                <td>

                  <button className="btn-detalhes">
                    Ver Detalhes
                  </button>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </>

  );

}