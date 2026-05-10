import "../App.css";
import Navbar from "../components/Navbar";

export default function Cadastrar() {

  function cadastrarMedicamento() {

    alert("Medicamento cadastrado!");

  }

  return (

    <>

      <Navbar />

      <div className="dashboard">

        {/* TOPO */}

        <div className="topo-cadastrar">

          <div>

            <h1>
              Cadastrar Medicamento
            </h1>

            <p>
              Preencha as informações para disponibilizar medicamentos
            </p>

          </div>

        </div>

        {/* CARD FORM */}

        <div className="card-cadastro">

          {/* INFORMAÇÕES */}

          <div className="secao-form">

            <h2>
              Informações do Medicamento
            </h2>

            <div className="linha-form">

              <div className="form-group">

                <label>
                  Nome do medicamento
                </label>

                <input
                  type="text"
                  placeholder="Ex: Paracetamol 500mg"
                />

              </div>

              <div className="form-group">

                <label>
                  Categoria
                </label>

                <select>

                  <option>
                    Selecione
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

            </div>

            {/* QUANTIDADE */}

            <div className="linha-form-3">

              <div className="form-group">

                <label>
                  Quantidade
                </label>

                <input
                  type="text"
                  placeholder="100"
                />

              </div>

              <div className="form-group">

                <label>
                  Unidade
                </label>

                <select>

                  <option>
                    Comprimidos
                  </option>

                  <option>
                    Cápsulas
                  </option>

                  <option>
                    Frascos
                  </option>

                </select>

              </div>

              <div className="form-group">

                <label>
                  Lote
                </label>

                <input
                  type="text"
                  placeholder="LOT123"
                />

              </div>

            </div>

            {/* VALIDADE */}

            <div className="form-group">

              <label>
                Data de validade
              </label>

              <input type="date" />

            </div>

            {/* DESCRIÇÃO */}

            <div className="form-group">

              <label>
                Observações
              </label>

              <textarea
                placeholder="Informações adicionais sobre o medicamento..."
              />

            </div>

          </div>

          {/* LOCALIZAÇÃO */}

          <div className="secao-form">

            <h2>
              Localização
            </h2>

            <div className="linha-form">

              <div className="form-group">

                <label>
                  Estado
                </label>

                <select>

                  <option>
                    Selecione
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
                  Cidade
                </label>

                <input
                  type="text"
                  placeholder="São Paulo"
                />

              </div>

            </div>

          </div>

          {/* FORNECEDOR */}

          <div className="fornecedor-premium">

            <div>

              <span>
                Organização
              </span>

              <h3>
                Farmácia Central
              </h3>

            </div>

            <div>

              <span>
                Tipo
              </span>

              <h3>
                Farmácia
              </h3>

            </div>

          </div>

          {/* BOTÕES */}

          <div className="acoes-form">

            <button className="btn-secundario">
              Cancelar
            </button>

            <button
              className="btn-principal"
              onClick={cadastrarMedicamento}
            >

              Cadastrar Medicamento

            </button>

          </div>

        </div>

      </div>

    </>

  );

}