import "../App.css";
import Navbar from "../components/Navbar";
export default function Dashboard() {

  return (

    <>

      <Navbar />

      <div className="dashboard">

        {/* TOPO */}

        <div className="dashboard-topo">

          <div>

            <h1>
              Relatórios de Impacto Social
            </h1>

            <p>
              Acompanhe o impacto positivo da redistribuição de medicamentos
            </p>

          </div>

          <div className="topo-acoes">

            <select>

              <option>
                Último Mês
              </option>

            </select>

            <button className="btn-exportar">
              Exportar PDF
            </button>

          </div>

        </div>

        {/* CARDS */}

        <div className="impacto-cards">

          <div className="impacto-card">

            <div className="icone-card azul-bg">
              👥
            </div>

            <p>Pessoas Beneficiadas</p>

            <h2>600</h2>

            <span>
              Estimativa baseada em distribuições
            </span>

          </div>

          <div className="impacto-card">

            <div className="icone-card verde-bg">
              📦
            </div>

            <p>Medicamentos Redistribuídos</p>

            <h2>200</h2>

            <span>
              Unidades entregues
            </span>

          </div>

          <div className="impacto-card">

            <div className="icone-card roxo-bg">
              📈
            </div>

            <p>Desperdício Evitado</p>

            <h2>7.2%</h2>

            <span>
              Redução de descarte
            </span>

          </div>

          <div className="impacto-card">

            <div className="icone-card laranja-bg">
              🏅
            </div>

            <p>ONGs Atendidas</p>

            <h2>3</h2>

            <span>
              Organizações parceiras
            </span>

          </div>

        </div>

        {/* GRÁFICOS */}

        <div className="graficos-grid">

          <div className="grafico-box">

            <h2>
              Distribuição por Categoria
            </h2>

            <p>
              Tipos de medicamentos disponíveis
            </p>

            <div className="grafico-pizza">

              <div className="pizza"></div>

            </div>

          </div>

          <div className="grafico-box">

            <h2>
              Status dos Medicamentos
            </h2>

            <p>
              Estado atual do inventário
            </p>

            <div className="grafico-barras">

              <div className="barra barra-1"></div>
              <div className="barra barra-2"></div>
              <div className="barra barra-3"></div>

            </div>

          </div>

        </div>

        {/* ESTADOS */}

        <div className="grafico-box grande">

          <h2>
            Distribuição por Estado
          </h2>

          <p>
            Quantidade de medicamentos por localização
          </p>

          <div className="estados-box">

            <div className="estado-item">

              <span>SP</span>

              <div className="linha">

                <div className="linha-verde sp"></div>

              </div>

            </div>

            <div className="estado-item">

              <span>RJ</span>

              <div className="linha">

                <div className="linha-verde rj"></div>

              </div>

            </div>

            <div className="estado-item">

              <span>RS</span>

              <div className="linha">

                <div className="linha-verde rs"></div>

              </div>

            </div>

            <div className="estado-item">

              <span>MG</span>

              <div className="linha">

                <div className="linha-verde mg"></div>

              </div>

            </div>

          </div>

        </div>

        {/* IMPACTO */}

        <div className="impacto-social">

          <h2>
            Impacto Ambiental e Social
          </h2>

          <div className="impacto-social-grid">

            <div className="impacto-info verde-box">

              <h3>
                Sustentabilidade
              </h3>

              <h1>
                417 kg
              </h1>

              <p>
                Resíduos farmacêuticos evitados
              </p>

            </div>

            <div className="impacto-info azul-box">

              <h3>
                Economia
              </h3>

              <h1>
                R$ 500
              </h1>

              <p>
                Valor economizado pelas ONGs
              </p>

            </div>

            <div className="impacto-info roxo-box">

              <h3>
                Alcance Social
              </h3>

              <h1>
                7
              </h1>

              <p>
                Medicamentos disponíveis
              </p>

            </div>

          </div>

        </div>

      </div>

    </>

  );

}