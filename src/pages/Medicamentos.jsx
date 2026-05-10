import "../App.css";
import Navbar from "../components/Navbar";

export default function Medicamentos() {

  return (

    <>

      <Navbar />

      <div className="dashboard">

        {/* HEADER */}

        <div className="solicitacoes-header">

          <h1>
            Medicamentos Disponíveis
          </h1>

          <p>
            Encontre medicamentos próximos do vencimento disponíveis para solicitação
          </p>

        </div>

        {/* FILTROS */}

        <div className="filtros">

          <h2>
            🔎 Filtros de Busca
          </h2>

          <div className="filtros-grid">

            <div className="form-group">

              <label>
                Buscar
              </label>

              <input
                type="text"
                placeholder="Nome ou categoria..."
              />

            </div>

            <div className="form-group">

              <label>
                Categoria
              </label>

              <select>

                <option>
                  Todas as categorias
                </option>

                <option>
                  Analgésicos
                </option>

                <option>
                  Anti-inflamatórios
                </option>

                <option>
                  Antibióticos
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Estado
              </label>

              <select>

                <option>
                  Todos os estados
                </option>

                <option>
                  São Paulo
                </option>

                <option>
                  Rio de Janeiro
                </option>

                <option>
                  Minas Gerais
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Validade
              </label>

              <select>

                <option>
                  Todos os prazos
                </option>

                <option>
                  15 dias
                </option>

                <option>
                  30 dias
                </option>

                <option>
                  60 dias
                </option>

              </select>

            </div>

          </div>

          <div className="resultado-busca">

            <span>
              7
            </span>

            <p>
              medicamentos encontrados
            </p>

          </div>

        </div>

        {/* MEDICAMENTOS */}

        <div className="medicamentos-grid">

          {/* CARD */}

          <div className="med-card premium">

            <h3>
              Paracetamol 500mg
            </h3>

            <div className="tags">

              <span className="categoria">
                Analgésicos
              </span>

              <span className="status disponivel">
                Disponível
              </span>

            </div>

            <div className="info-med">

              <p>
                📦 500 comprimidos
              </p>

              <p>
                📍 São Paulo, SP
              </p>

            </div>

            <div className="validade-box">

              <div>

                <span>
                  Validade
                </span>

                <h4>
                  14/05/2026
                </h4>

              </div>

              <div className="dias-restantes">

                65 dias

              </div>

            </div>

            <div className="fornecedor">

              <span>
                Fornecedor
              </span>

              <h4>
                Farmácia Central
              </h4>

            </div>

          </div>

          {/* CARD */}

          <div className="med-card premium">

            <h3>
              Ibuprofeno 600mg
            </h3>

            <div className="tags">

              <span className="categoria">
                Anti-inflamatórios
              </span>

              <span className="status disponivel">
                Disponível
              </span>

            </div>

            <div className="info-med">

              <p>
                📦 300 comprimidos
              </p>

              <p>
                📍 Rio de Janeiro, RJ
              </p>

            </div>

            <div className="validade-box">

              <div>

                <span>
                  Validade
                </span>

                <h4>
                  19/04/2026
                </h4>

              </div>

              <div className="dias-restantes laranja">

                40 dias

              </div>

            </div>

            <div className="fornecedor">

              <span>
                Fornecedor
              </span>

              <h4>
                Hospital Santa Casa
              </h4>

            </div>

          </div>

          {/* CARD */}

          <div className="med-card premium">

            <h3>
              Amoxicilina 500mg
            </h3>

            <div className="tags">

              <span className="categoria">
                Antibióticos
              </span>

              <span className="status reservado">
                Reservado
              </span>

            </div>

            <div className="info-med">

              <p>
                📦 200 cápsulas
              </p>

              <p>
                📍 Belo Horizonte, MG
              </p>

            </div>

            <div className="validade-box">

              <div>

                <span>
                  Validade
                </span>

                <h4>
                  29/06/2026
                </h4>

              </div>

              <div className="dias-restantes">

                111 dias

              </div>

            </div>

            <div className="fornecedor">

              <span>
                Fornecedor
              </span>

              <h4>
                Farmácia Saúde
              </h4>

            </div>

          </div>

        </div>

      </div>

    </>

  );

}